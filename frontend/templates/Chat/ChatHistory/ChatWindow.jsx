import ChatHistory from './ChatHistory';

const ChatWindow = () => {
  const chatHistoryData = [
    { id: 1, message: 'Hello!', timestamp: '2024-05-23T10:00:00Z' },
    { id: 2, message: 'Hi there!', timestamp: '2024-05-23T10:01:00Z' },
    { id: 3, message: 'How are you?', timestamp: '2024-05-23T10:02:00Z' },
  ];
  return (
    <div>
      <ChatHistory history={chatHistoryData} />
      {/* Other chat components */}
    </div>
  );
};
export default ChatWindow;
