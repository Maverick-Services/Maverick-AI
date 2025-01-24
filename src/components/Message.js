import React from 'react';
import '../styles/Chatbot.css';

const Message = ({ text, sender, className }) => {
  // Function to detect and render links in the text
  const renderMessageWithLinks = (message) => {
    if (typeof message === 'string') {
      const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/g;
      return message.split(' ').map((word, index) => {
        if (word.match(urlRegex)) {
          const url = word.startsWith('http') ? word : 'http://' + word;
          return (
            <a key={index} href={url} target="_blank" rel="noopener noreferrer">
              {word}
            </a>
          );
        }
        return word + ' ';
      });
    }
    // If the message is JSX (not a string), just return it directly
    return message;
  };

  return (
    <div className={`message ${sender === 'user' ? 'user-message' : 'bot-message'} ${className || ''}`}>
      {sender === 'bot' && (
        
        <img
          src="https://s3.amazonaws.com/tawk-to-pi/bot/025e0d0c0f63f2e08bbe8376"
          height={30}
          width={30}
          alt="avatar"
          className="bot-avatar"
        />
        
      )}
      {text === '...' ? (
        <div className="loading-indicator">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      ) : (
        <div className="bot-message-container">
        <p>{renderMessageWithLinks(text)}</p>
        </div>
      )}
    </div>
  );
};

export default Message;
