// Create a main component (ChatWindow) where you fetch the chat history data and pass it down to ChatHistory component.

import React, { useEffect, useState } from 'react';
import { fetchChatHistory } from '../services/firebaseService'; 
import ChatHistory from './ChatHistory'; 

const ChatWindow = ({ userId }) => {
    const [chatHistoryData, setChatHistoryData] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await fetchChatHistory(userId);
                setChatHistoryData(history);
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        };
        fetchHistory();
    }, [userId]);

    return (
        <div>
            <ChatHistory history={chatHistoryData} />
            {/* Other chat components */}
        </div>
    );
};

export default ChatWindow;
