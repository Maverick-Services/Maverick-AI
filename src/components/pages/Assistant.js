import React from 'react';
import '../../styles/Chatbot.css';
import Message from '../Message';
import { IoMdArrowBack } from "react-icons/io";
import { IoMdMic } from "react-icons/io";
import { IoMdSend } from "react-icons/io";

const Assistant = ({
  goBackToChat,
  isOnline,
  messages,
  loading,
  showOptions,
  userInput,
  setUserInput,
  handleSendMessage,
  handleVoiceInput,
  handleOptionClick,
  chatWindowRef,
  isRecording,
  setIsRecording
}) => {

  return (
    <>
      <div className="chatbot-header">
        <IoMdArrowBack onClick={goBackToChat} style={{ cursor: "pointer" }} size={22} />
        <div className="avatar">
          <img
            src="https://s3.amazonaws.com/tawk-to-pi/bot/025e0d0c0f63f2e08bbe8376"
            height={35}
            width={35}
            alt="avatar"
          />
        </div>
        <div className="bot-name">
          <span>Maverick AI Assistant</span>
          <span>{isOnline ? "online" : " "}</span>
        </div>
      </div>
      <div className="chat-window" ref={chatWindowRef}>
        {messages?.map((msg, index) => (
          <div key={index} className={`message-container ${msg.sender}`}>
            {/* Render the message */}
            <Message text={msg.text} sender={msg.sender} className={msg.className || ''} />

            {/* Render options only after specific bot messages */}
            {msg.sender === 'bot' && msg.text.includes("What services are you interested in?") && (
              <div className="options-container">
                <button onClick={() => handleOptionClick('Digital Presence Management')}>
                  Digital Presence Management
                </button>
                <button onClick={() => handleOptionClick('IT Core Services')}>
                  IT Core Services
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Render loading animation */}
        {loading && (
          <div className="loading-message">
            <Message key="loading" text="..." sender="bot" className="loading" />
          </div>
        )}
      </div>


      {isRecording && (
        <div className="recording-overlay">
          <div className="waveform-animation">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
          <div className="recording-text">AI Assistant Listening...</div>
        </div>
      )}


      <div className="input-container">
        {/* <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        /> */}
        <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Prevents form submission issues
              handleSendMessage(userInput);
            }
          }}
        />
        <button onClick={handleVoiceInput}>
          <IoMdMic size={20} />
        </button>
        {/* <button onClick={handleSendMessage}>
          <IoMdSend size={20} />
        </button> */}
        <button onClick={() => handleSendMessage(userInput)}>
          <IoMdSend size={20} />
        </button>

      </div>
    </>
  );
};

export default Assistant;
