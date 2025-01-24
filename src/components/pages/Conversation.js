import React from 'react';
import '../../styles/Chatbot.css';
import { TbHistoryOff } from "react-icons/tb";

const Conversation = ({ showHistory, chatHistory, hideHistory }) => {
  return (
    <>
      {showHistory ? (
        <>
          <div className="chat-history">
            <h2>Conversations</h2>
            {(!chatHistory || chatHistory.length === 0) ? (
              <p>No chat history available.</p>
            ) : (
              <div className="history-list">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`history-message ${msg.sender}`}>
                    <strong>{msg.sender === 'user' ? 'User' : 'Bot'}</strong> {msg.text}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div onClick={hideHistory}>
            <span className="hideHistory"><TbHistoryOff size={28} /></span>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Conversation;
