import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chatbot.css';
import axios from 'axios'; // Import axios for API requests
import SearchResult from './pages/SearchResult';
import Assistant from './pages/Assistant';
import Conversation from './pages/Conversation';
import { IoSend } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5"
import { TbHistoryOff } from "react-icons/tb";
import { IoChevronForward } from "react-icons/io5";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const [suggestions, setSuggestions] = useState([]); // Store search suggestions
  const [showOptions, setShowOptions] = useState(false); // Control options display
  const [searchResultVisible, setSearchResultVisible] = useState(false); // Toggle search result pop-up
  const [searchResults, setSearchResults] = useState([]); // Store search results
  const [showHistory, setShowHistory] = useState(false); // Toggle chat history
  const [chatHistory, setChatHistory] = useState([]); // Store full chat history
  const chatWindowRef = useRef(null); // Reference to chat window for auto-scrolling
  const [feedback, setFeedback] = useState('')
  const searchResultRef = useRef(null);
  const [isChatbot,setIsChatbot]=useState(true)
  const [conversation,setConversation]=useState(false)
  const [isOnline, setIsOnline] = useState(false);
  const [isResponding,setIsResponding]=useState(true)
  const [isRecording, setIsRecording] = useState(false);

  const searchIntents = [
   
    { tag: "services", patterns: ["What services do you offer?", "Tell me about your services", "What can you do for me?", "What services do you provide?"], responses: "We provide IT services such as Digital Presence Management and Core Technical Services. What services are you interested in?- Digital Presence Management\n- IT Core Technical Services" },
    {
      tag: "digital_presence_management",
      patterns: ["Tell me more about Digital Presence Management", "What is Digital Presence Management?", "What services are included in Digital Presence Management?"],
      responses: [
        "Digital Presence Management includes the following services: https://maverickservices.in/best-seo-service-in-delhi/ \n- E-commerce startup\n- Brand Management Services\n- Digital Marketing & SEO\n- Website/App Development"
      ]
    },
    {
      tag: "it_technical_services",
      patterns: ["Tell me more about Core Technical Services", "What is IT Core Technical Services?", "Can you explain IT Core Technical Services?"],
      responses: [
        "Our Core Technical Services include the following:\n- Network Penetration Testing\n- Cyber Security\n- Managed IT Services\n- IT Recruitment"
      ]
    },
    {
      tag: "avail_services",
      patterns: ["How can I avail these services?", "How do I access these services?", "How can I get started with your services?"],
      responses: [
        "To avail our services, please visit our website at www.maverickservices.in and contact us through the contact form or reach us directly at https://maverickservices.in/contact-us/."
      ]
    },
    {
      tag: "location",
      patterns: ["Where is your location?", "Where are you located?", "Can you tell me your address?", "What is your physical location?"],
      responses: [
        "We are based in New Delhi, India. You can contact us via our website or visit us at our office for more details."
      ]
    },
    {
      tag: "contact",
      patterns: ["How can I contact you?","how to connect", "How do I get in touch?", "What is your contact information?", "Can I reach you online?"],
      responses: [
        "You can contact us through the contact form on our website at https://maverickservices.in/contact-us/. Alternatively, you can call us or email us through the details provided on our site."
      ]
    },
    {
      tag: "about_us",
      patterns: ["Tell me about your company", "Can you tell me about your business?", "What does Maverick do?"],
      responses: [
        "Maverick Services is a New Delhi-based IT and Business Services provider. We offer a combination of IT solutions, digital marketing, and creative services to help businesses grow online. Our team focuses on strategizing and executing projects to enhance your brand's presence."
      ]
    },

    {
      tag: "website",
      patterns: ["What is your website?", "Where can I find your website?", "Can you share your website URL?"],
      responses: [
        "Our website is www.maverickservices.in. Feel free to explore our services and get in touch with us!"
      ]
    },
    {
      tag: "faq",
      patterns: ["Do you have a FAQ?", "What are your frequently asked questions?", "Where can I find FAQs?"],
      responses: [
        "You can find our FAQ section on the website. Here is the link: www.maverickservices.in/faq."
      ]
    },
  ];


  // whenever enter in input then it will be run 
  const toggleChatbotState = () => {
    setIsChatbot((prev) => !prev); // Toggle the chatbot state
  };
  
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Check if userInput matches any patterns in searchIntents
      const matches = searchIntents.filter((intent) =>
        intent.patterns.some((pattern) =>
          pattern.toLowerCase().includes(userInput.toLowerCase())
        )
      );
  
      toggleChatbotState(); // Toggle chatbot state on Enter press
  
      if (matches.length === 0) {
        // No matches found
        setSearchResults([]); // Clear previous results
        setSearchResultVisible(true); // Show "No results" UI
      } else {
        // Matches found
        setSearchResults(matches); // Display matching results
        setSearchResultVisible(true); // Show results UI
      }
    }
  };
  
  
  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);
    const filteredSuggestions = searchIntents.filter((intent) =>
      intent.patterns.some((pattern) =>
        pattern.toLowerCase().includes(input.toLowerCase())
      )
    );
    setSuggestions(filteredSuggestions);
  };
  
  
  const handleSuggestionClick = (suggestion) => {
    toggleChatbotState(); // Toggle chatbot state on suggestion click
  
    setUserInput(suggestion);
    setSuggestions([]);
  
    const filteredResults = searchIntents.filter((intent) =>
      intent.patterns.some((pattern) =>
        pattern.toLowerCase().includes(suggestion.toLowerCase())
      )
    );
  
    setSearchResults(filteredResults);
    setSearchResultVisible(true);
  
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: suggestion, sender: 'user' },
    ]);
  };
  
// Text-to-Speech function
const speak = (text) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
};


const handleSendMessage = async (userMessage = userInput) => {
  if (!userMessage.trim()) return;

  // Add the user's message to the chat
  const userMsg = { text: userMessage, sender: 'user' };
  setMessages((prevMessages) => [...prevMessages, userMsg]);
  setChatHistory((prevHistory) => [...prevHistory, userMsg]);
  setUserInput('');
  setLoading(true);

  try {
    const response = await axios.post('https://maverick-backend-lfah.onrender.com/api/chat', { message: userMessage });
    const botResponse = response.data.botResponse;
    // Display the bot's message after a short delay
    setTimeout(() => {
      const botMsg = { text: botResponse, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMsg]);
      setChatHistory((prevHistory) => [...prevHistory, botMsg]);
      setLoading(false);
      
      setIsResponding(false)
      // Handle options based on bot's response
      if (botResponse.toLowerCase().includes('what services are you interested in?')) {
        setShowOptions(true);
      } else {
        setShowOptions(false);
      }
      
      // Speak out the bot's response
      speak(botResponse);
    }, 2000);
  } catch (error) {
    console.error('Error fetching bot response:', error);
    const errorMsg = { text: "Sorry, I couldn't get a response.", sender: 'bot' };
    setMessages((prevMessages) => [...prevMessages, errorMsg]);
    setChatHistory((prevHistory) => [...prevHistory, errorMsg]);
    setLoading(false);
  }
};

const handleVoiceInput = () => {
  window.speechSynthesis.cancel();
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;

    // Update the user input field with the voice input
    setUserInput(transcript);

    // Call the handleSendMessage function to process the user's message
    // Do not add the user message here manually since it's already done in handleSendMessage
    handleSendMessage(transcript);
  };

  recognition.onerror = (error) => {
    console.error('Speech recognition error:', error);
  };


  setIsRecording(true); // Activate recording UI
   
    // Simulate stopping recording after some time
    setTimeout(() => setIsRecording(false), 3000);
};


  
  const handleOptionClick = (option) => {
    setUserInput(option);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text:`${option}`, sender: 'user' },
    ]);
    setShowOptions(false);
    setLoading(true);
    setUserInput("");
  
    axios
      .post('https://maverick-backend-lfah.onrender.com/api/chat', { message: option })
      .then((response) => {
        const botResponse = response.data.botResponse;
        const botMessage = { text: botResponse, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching bot response:', error);
        const botMessage = { text: "Sorry, I couldn't get a response.", sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setLoading(false);
      });
  };
  
  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
    toggleChatbotState(); // Toggle chatbot state when showing history
  };
  
  const startNewConversation = () => {
    toggleChatbotState(); // Toggle chatbot state to start a new conversation
    setConversation((prev) => !prev);
  
    setMessages([]);
    setUserInput('');
    setSuggestions([]);
    setSearchResultVisible(false);
    setChatHistory([]);
  
    const initialMessages = [{ text: "...", sender: "bot", className: "loading" }];
    setMessages(initialMessages);
  
    setTimeout(() => {
      const welcomeMessage = { text: 'Good morning and welcome to Maverick', sender: 'bot' };
      const assistMessage = { text: 'How may I assist you today?', sender: 'bot' };
      setMessages([welcomeMessage, assistMessage]);
      setChatHistory((prevHistory) => [...prevHistory, welcomeMessage, assistMessage]);
      setLoading(false);
    }, 2000);
  };
  
  const goBackToChat = () => {
    window.speechSynthesis.cancel();
    setMessages([]);
    setUserInput('');
    setShowOptions(false);
    toggleChatbotState(); // Toggle chatbot state when going back to chat
    setConversation(false);
  };
  
  const SearchPop = () => {
    setSearchResultVisible(false);
    toggleChatbotState(); // Toggle chatbot state when closing search results
    setUserInput('');
    setFeedback('');
  };
  
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);
  
  useEffect(() => {
    if (searchResultRef.current) {
      searchResultRef.current.scrollTop = searchResultRef.current.scrollHeight;
    }
  }, [searchResults]);

  useEffect(() => {
    // Simulating delayed "online" state update
    const timer = setTimeout(() => {
      setIsOnline(true);
    }, 2000);
  
    return () => clearTimeout(timer);
  }, []);
  
  
  
  
  const hideHistory = () => {
    toggleChatbotState(); // Toggle chatbot state when hiding history
    setShowHistory(false);
  };

  
  
  
  
  
  return (
    <div className="chatbot-wrapper">
    <div className="chatbot-container">
      {isChatbot ? (
        <>
          <div className="search-popup">
            <div className="Initiat-message">
              <h1>Hi there 👋</h1>
              <p>Need help? Search our help center for answers or start a conversation:</p>
            </div>
            <div className="search-column">
              <div className="search-input">
                <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Search your answers"
                />
                <FaSearch className="icons" onClick={handleKeyPress} />
              </div>
              {userInput.trim() && (
                <div className="suggestions">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion.patterns[0])}
                    >
                      <i><IoDocumentTextOutline size={17} /></i>
                      {suggestion.patterns[0]}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="newConversation">
              <div className="new-conversation-button" onClick={startNewConversation}>
                <i><IoSend size={20} /></i> New Conversation
              </div>
            </div>
          </div>
          <div className="history-button" onClick={toggleHistory}>
            {showHistory ? (
              <span className="hideHistory"><TbHistoryOff size={28} /></span>
            ) : (
              <div className="history-button1">
                <p>Conversations</p>
                <div className="history-avatar">
                  <img
                    src="https://s3.amazonaws.com/tawk-to-pi/bot/025e0d0c0f63f2e08bbe8376"
                    height={50}
                    width={50}
                    alt="avatar"
                  />
                  <div className="history-messages">
                    <span className="assistant-name">Maverick AI Assistant</span>
                    <span className="assistant-message">How may I assist you?</span>
                  </div>
                  <span><IoChevronForward size={30} /></span>
                </div>
              </div>
            )}
          </div>
        </>
      ) : searchResultVisible ? (
        <SearchResult 
        searchResultRef={searchResultRef}
        SearchPop={SearchPop}
        searchResults={searchResults}
        userInput={userInput}
        feedback={feedback}
        setFeedback={setFeedback}
        ></SearchResult>
      ) : conversation ? (
        <Assistant
        goBackToChat={goBackToChat} 
        isOnline={isOnline}
        messages={messages}
        loading={loading}
        showOptions={showOptions}
        userInput={userInput}
        setUserInput={setUserInput}
        handleSendMessage={handleSendMessage}
        handleVoiceInput={handleVoiceInput}
        handleOptionClick={handleOptionClick}
        chatWindowRef={chatWindowRef}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        ></Assistant>        
      ) : (
        <Conversation
        showHistory={showHistory}
        chatHistory={chatHistory}
        hideHistory={hideHistory}
         />
      )}
    </div>
    <a className="free-Livechat">
      <img src="https://www.tawk.to/wp-content/uploads/2020/04/tawk-sitelogo.png" height={23} width={23} alt="Tawk logo" />
      <i>Ad-free <strong>live chat</strong> to Maverick AI Assistant</i>
    </a>
  </div>
  






  );
};

export default Chatbot;







