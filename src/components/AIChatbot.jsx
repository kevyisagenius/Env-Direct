import React, { useState, useEffect, useRef } from 'react';
import './AIChatbot.css'; // Import the CSS file
const API_URL = import.meta.env.VITE_API_URL;

// Simple Chat Bubble Icon (you can replace with an SVG or a more complex icon)
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      id: messages.length + 1, // Ensure unique ID
      text: inputValue,
      sender: 'user'
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const currentInput = inputValue; // Store current input value before clearing
    setInputValue(''); // Clear input field immediately

    try {
      const response = await fetch(`${API_URL}/api/chat`, { // Calls your Spring Boot backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }), // Send the stored input value
      });

      if (!response.ok) {
        // Try to parse error from backend if available
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If backend error isn't JSON, use status text
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        throw new Error(errorData.error || 'Failed to get response from AI');
      }

      const data = await response.json();
      
      let botReplyText = 'Sorry, I couldn\'t understand that.'; // Default reply
      if (data.reply) { // Check for the new "reply" field
        botReplyText = data.reply.trim();
      } else if (data.error) { // Handle potential error message from backend
        botReplyText = `Error: ${data.error}`;
      }

      const botMessage = {
        id: messages.length + 2, // Ensure unique ID, consider a better ID generation for robustness
        text: botReplyText,
        sender: 'bot'
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Error sending message to AI:", error);
      const errorMessage = {
        id: messages.length + 2, // Ensure unique ID
        text: `Error: ${error.message || 'Could not connect to AI assistant.'}`,
        sender: 'bot'
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>AI Assistant</span>
            <button onClick={toggleChat} className="close-button">&times;</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input 
              type="text" 
              value={inputValue} 
              onChange={handleInputChange} 
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
      <button className="chatbot-button" onClick={toggleChat}>
        {isOpen ? <span style={{fontSize: '20px'}}>&times;</span> : <ChatIcon />}
      </button>
    </div>
  );
};

export default AIChatbot; 