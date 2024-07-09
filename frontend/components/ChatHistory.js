import React from "react";

const ChatHistory = ({ history }) => {
    return (
        <div>
            <h2>Chat History</h2>
            <ul>
                {history.map((chat) => (
                    <li key={chat.id}>
                        <p>{chat.message}</p>
                        <p>Timestamp: {new Date(chat.timestamp.seconds * 1000).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatHistory;
