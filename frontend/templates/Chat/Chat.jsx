import { useEffect, useRef, useState } from 'react';

import {
  ArrowDownwardOutlined,
  InfoOutlined,
  Settings,
} from '@mui/icons-material';

import {
  Button,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import { collection, onSnapshot, query, where } from 'firebase/firestore';

import { useDispatch, useSelector } from 'react-redux';

import NavigationIcon from '@/assets/svg/Navigation.svg';

import { MESSAGE_ROLE, MESSAGE_TYPES } from '@/constants/bots';

import CenterChatContentNoMessages from './CenterChatContentNoMessages';

import ChatSpinner from './ChatSpinner';

import Message from './Message';

import styles from './styles';

import {
  openInfoChat,
  resetChat,
  setChatSession,
  setError,
  setFullyScrolled,
  setInput,
  setMessages,
  setMore,
  setSessionLoaded,
  setStreaming,
  setStreamingDone,
  setTyping,
} from '@/redux/slices/chatSlice';
import { firestore } from '@/redux/store';
import createChatSession from '@/services/chatbot/createChatSession';
import sendMessage from '@/services/chatbot/sendMessage';

const ChatInterface = () => {
  const initialChatData = [
    [], // Chat 1 (empty to start with)
    [
      {
        id: 1,
        role: MESSAGE_ROLE.AI,
        type: MESSAGE_TYPES.TEXT,
        payload: {
          text: 'Hello! How can I assist you today?',
        },
      },
      {
        id: 2,
        role: MESSAGE_ROLE.HUMAN,
        type: MESSAGE_TYPES.TEXT,
        payload: {
          text: 'I need help with my mathematics assignment.',
        },
      },
      {
        id: 3,
        role: MESSAGE_ROLE.AI,
        type: MESSAGE_TYPES.TEXT,
        payload: {
          text: 'Sure, I can assist you with that.',
        },
      },
    ],
    [
      {
        id: 4,
        role: MESSAGE_ROLE.AI,
        type: MESSAGE_TYPES.TEXT,
        payload: {
          text: 'Welcome back! What is it that you need help with today?',
        },
      },
      {
        id: 5,
        role: MESSAGE_ROLE.HUMAN,
        type: MESSAGE_TYPES.TEXT,
        payload: {
          text: 'I want to change my account settings.',
        },
      },
      {
        id: 6,
        role: MESSAGE_ROLE.AI,
        type: MESSAGE_TYPES.TEXT,
        payload: {
          text: 'Let me guide you through the process.',
        },
      },
    ],
  ];

  const messagesContainerRef = useRef();

  const [currentChatIndex, setCurrentChatIndex] = useState(-1); // Start with no chat selected
  const [chatMessages, setChatMessages] = useState([]);
  const [chatData, setChatData] = useState(initialChatData);

  const handleSwitchChat = (index) => {
    setCurrentChatIndex(index);
    setChatMessages(chatData[index]);
  };

  const handleCreateChat = () => {
    const newChatData = [...chatData, []]; // Add a new empty chat array
    const newIndex = newChatData.length - 1; // Index of the new chat

    setChatData(newChatData);
    setCurrentChatIndex(newIndex);
    setChatMessages(newChatData[newIndex]);
  };

  useEffect(() => {
    if (currentChatIndex !== -1) {
      setChatMessages(chatData[currentChatIndex]);
    }
  }, [currentChatIndex, chatData]);

  const dispatch = useDispatch();
  const {
    more,
    input,
    typing,
    chat,
    sessionLoaded,
    openSettingsChat,
    infoChatOpened,
    fullyScrolled,
    streamingDone,
    streaming,
    error,
  } = useSelector((state) => state.chat);
  const { data: userData } = useSelector((state) => state.user);

  const sessionId = localStorage.getItem('sessionId');

  const currentSession = chat;
  // const chatMessages = currentSession?.messages;
  const showNewMessageIndicator = !fullyScrolled && streamingDone;

  const startConversation = async (message) => {
    dispatch(
      setMessages({
        role: MESSAGE_ROLE.AI,
      })
    );
    dispatch(setTyping(true));

    // Define the chat payload
    const chatPayload = {
      user: {
        id: userData?.id,
        fullName: userData?.fullName,
        email: userData?.email,
      },
      type: 'chat',
      message,
    };

    // Send a chat session
    const { status, data } = await createChatSession(chatPayload, dispatch);

    // Remove typing bubble
    dispatch(setTyping(false));
    if (status === 'created') dispatch(setStreaming(true));

    // Set chat session
    dispatch(setChatSession(data));
    dispatch(setSessionLoaded(true));
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem('sessionId');
      dispatch(resetChat());
    };
  }, []);

  useEffect(() => {
    let unsubscribe;

    if (sessionLoaded || currentSession) {
      messagesContainerRef.current?.scrollTo(
        0,
        messagesContainerRef.current?.scrollHeight,
        {
          behavior: 'smooth',
        }
      );

      const sessionRef = query(
        collection(firestore, 'chatSessions'),
        where('id', '==', sessionId)
      );

      unsubscribe = onSnapshot(sessionRef, async (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'modified') {
            const updatedData = change.doc.data();
            const updatedMessages = updatedData.messages;

            const lastMessage = updatedMessages[updatedMessages.length - 1];

            if (lastMessage?.role === MESSAGE_ROLE.AI) {
              dispatch(
                setMessages({
                  role: MESSAGE_ROLE.AI,
                  response: lastMessage,
                })
              );
              dispatch(setTyping(false));
            }
          }
        });
      });
    }

    return () => {
      if (sessionLoaded || currentSession) unsubscribe();
    };
  }, [sessionLoaded]);

  const handleOnScroll = () => {
    const scrolled =
      Math.abs(
        messagesContainerRef.current.scrollHeight -
          messagesContainerRef.current.clientHeight -
          messagesContainerRef.current.scrollTop
      ) <= 1;

    if (fullyScrolled !== scrolled) dispatch(setFullyScrolled(scrolled));
  };

  const handleScrollToBottom = () => {
    messagesContainerRef.current?.scrollTo(
      0,
      messagesContainerRef.current?.scrollHeight,
      {
        behavior: 'smooth',
      }
    );

    dispatch(setStreamingDone(false));
  };
  const simulateAIResponse = () => {
    setTimeout(() => {
      const updatedChatData = [...chatData];
      updatedChatData[currentChatIndex].push({
        id: updatedChatData[currentChatIndex].length + 1,
        role: MESSAGE_ROLE.AI,
        type: MESSAGE_TYPES.TEXT,
        payload: {
          text: 'Sure, I can assist you with that.',
        },
      });
      setChatData(updatedChatData);
    }, 1000); // Simulate AI typing delay
  };
  const simulateSendMessage = async (message) => {
    // Ensure currentChatIndex is valid
    if (currentChatIndex === -1 || currentChatIndex >= chatData.length) {
      console.error('Invalid chat index');
      return;
    }

    // Simulate sending message and updating local chat data
    const updatedChatData = [...chatData];

    // Ensure currentChatIndex has a valid array to push into
    if (!updatedChatData[currentChatIndex]) {
      updatedChatData[currentChatIndex] = [];
    }

    updatedChatData[currentChatIndex].push({
      id: updatedChatData[currentChatIndex].length + 1,
      role: MESSAGE_ROLE.HUMAN,
      type: MESSAGE_TYPES.TEXT,
      payload: {
        text: message.payload.text,
      },
    });

    setChatData(updatedChatData);

    // Simulate AI response (replace with actual backend integration)
    simulateAIResponse();
  };

  const handleSendMessage = async () => {
    if (!input) {
      dispatch(setError('Please enter a message'));
      setTimeout(() => {
        dispatch(setError(null));
      }, 3000);
      return;
    }

    const message = {
      role: MESSAGE_ROLE.HUMAN,
      type: MESSAGE_TYPES.TEXT,
      payload: {
        text: input,
      },
    };

    dispatch(setMessages({ role: MESSAGE_ROLE.HUMAN }));

    // Simulate sending message (you can replace with actual backend integration later)
    await simulateSendMessage(message);

    dispatch(setInput('')); // Clear input after sending
  };

  const simulateQuickReply = async (option) => {
    const message = {
      role: MESSAGE_ROLE.HUMAN,
      type: MESSAGE_TYPES.QUICK_REPLY,
      payload: {
        text: option,
      },
    };

    // Simulate sending message and updating local chat data
    await simulateSendMessage(message);
  };

  const handleQuickReply = async (option) => {
    dispatch(setInput(option));
    dispatch(setMessages({ role: MESSAGE_ROLE.HUMAN }));

    // Simulate sending quick reply (you can replace with actual backend integration later)
    await simulateQuickReply(option);
  };

  // TODO
  // const handleQuickReply = async (option) => {
  //   dispatch(setInput(option));
  //   dispatch(setStreaming(true));

  //   const message = {
  //     role: MESSAGE_ROLE.HUMAN,
  //     type: MESSAGE_TYPES.QUICK_REPLY,
  //     payload: {
  //       text: option,
  //     },
  //   };

  //   dispatch(
  //     setMessages({
  //       role: MESSAGE_ROLE.HUMAN,
  //     })
  //   );
  //   dispatch(setTyping(true));

  //   await sendMessage({ message, id: currentSession?.id }, dispatch);
  // };

  const keyDownHandler = async (e) => {
    if (typing || !input || streaming) return;
    if (e.keyCode === 13) handleSendMessage();
  };

  const renderSendIcon = () => {
    return (
      <InputAdornment position="end">
        <IconButton
          onClick={handleSendMessage}
          {...styles.bottomChatContent.iconButtonProps(
            typing || error || !input || streaming
          )}
        >
          <NavigationIcon />
        </IconButton>
      </InputAdornment>
    );
  };

  const renderMoreChat = () => {
    if (!more) return null;
    return (
      <Grid {...styles.moreChat.moreChatProps}>
        <Grid {...styles.moreChat.contentMoreChatProps}>
          <Settings {...styles.moreChat.iconProps} />
          <Typography {...styles.moreChat.titleProps}>Settings</Typography>
        </Grid>
        <Grid
          {...styles.moreChat.contentMoreChatProps}
          onClick={() => dispatch(openInfoChat())}
        >
          <InfoOutlined {...styles.moreChat.iconProps} />
          <Typography {...styles.moreChat.titleProps}>Information</Typography>
        </Grid>
      </Grid>
    );
  };

  const renderSwitchButtons = () => {
    return (
      <Grid
        container
        spacing={2}
        justifyContent="center"
        wrap="nowrap"
        // eslint-disable-next-line prettier/prettier
      sx={{ overflowX: 'auto', maxWidth: '100%' }}
      >
        {chatData.map((_chat, index) => (
          <Grid item key={index}>
            <Button
              variant={index === currentChatIndex ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => handleSwitchChat(index)}
              sx={{
                backgroundColor:
                  index === currentChatIndex ? '#1976d2' : '#ffffff',
                color: '#000000',
                '&:hover': {
                  backgroundColor:
                    index === currentChatIndex ? '#1565c0' : '#f0f0f0',
                  color: '#000000',
                },
              }}
            >
              Chat {index + 1}
            </Button>
          </Grid>
        ))}
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCreateChat}
            sx={{
              backgroundColor: '#ffffff',
              color: '#000000',
              '&:hover': {
                backgroundColor: '#1565c0',
                color: '#000000', // Black text color on hover
              },
            }}
          >
            Create New Chat
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderCenterChatContent = () => {
    if (
      !openSettingsChat &&
      !infoChatOpened &&
      chatMessages?.length !== 0 &&
      !!chatMessages
    ) {
      return (
        <Grid
          onClick={() => dispatch(setMore({ role: 'shutdown' }))}
          {...styles.centerChat.centerChatGridProps}
        >
          <Grid
            ref={messagesContainerRef}
            onScroll={handleOnScroll}
            {...styles.centerChat.messagesGridProps}
          >
            {chatMessages.map((message, index) => (
              <Message
                key={index}
                {...message}
                messagesLength={chatMessages.length}
                messageNo={index + 1}
                onQuickReply={handleQuickReply}
                streaming={streaming}
                fullyScrolled={fullyScrolled}
              />
            ))}
            {typing && <ChatSpinner />}
          </Grid>
        </Grid>
      );
    }

    return null;
  };

  const renderCenterChatContentNoMessages = () => {
    if ((chatMessages?.length === 0 || !chatMessages) && !infoChatOpened)
      return <CenterChatContentNoMessages />;
    return null;
  };

  const renderNewMessageIndicator = () => {
    return (
      <Fade in={showNewMessageIndicator}>
        <Button
          startIcon={<ArrowDownwardOutlined />}
          onClick={handleScrollToBottom}
          {...styles.newMessageButtonProps}
        />
      </Fade>
    );
  };

  const renderBottomChatContent = () => {
    if (!openSettingsChat && !infoChatOpened)
      return (
        <Grid {...styles.bottomChatContent.bottomChatContentGridProps}>
          <Grid {...styles.bottomChatContent.chatInputGridProps(!!error)}>
            <TextField
              value={input}
              onChange={(e) => dispatch(setInput(e.currentTarget.value))}
              onKeyUp={keyDownHandler}
              error={!!error}
              helperText={error}
              disabled={!!error}
              focused={false}
              {...styles.bottomChatContent.chatInputProps(
                renderSendIcon,
                !!error,
                input
              )}
            />
          </Grid>
        </Grid>
      );

    return null;
  };

  return (
    <Grid {...styles.mainGridProps}>
      {renderSwitchButtons()}
      {renderMoreChat()}
      {renderCenterChatContent()}
      {renderCenterChatContentNoMessages()}
      {renderNewMessageIndicator()}
      {renderBottomChatContent()}
    </Grid>
  );
};

export default ChatInterface;
