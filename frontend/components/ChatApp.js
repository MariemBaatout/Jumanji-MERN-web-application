import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ChatApp.css';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const chatEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Show welcome message on first load
  useEffect(() => {
    setMessages([
      { from: 'ai', content: '👋 Hello, how can I help you?' }
    ]);
  }, []);

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    setMessages((prev) => [
      ...prev,
      { from: 'user', content: URL.createObjectURL(selectedFile) },
    ]);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('📦 Backend response:', response.data);

      setMessages((prev) => [
        ...prev,
        {
          from: 'ai',
          content: `🐯 Name: ${response.data.name}\n🌍 Location: ${response.data.location}\n📉 Endangered: ${response.data.endangered ? 'Yes' : 'No'}`,
        },
        {
          from: 'ai',
          content: '🔗 For more information, please navigate to the [Endangered Animal List](/animals).',
        },
      ]);
    } catch (error) {
      console.error('❌ Frontend error:', error);

      setMessages((prev) => [
        ...prev,
        { from: 'ai', content: '⚠️ Error analyzing the image. Try again later.' },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">🐾 Jumanji Chat</h2>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="message-container"
            style={{ justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
              {msg.from === 'ai' && <span className="avatar">🤖</span>}
              {msg.from === 'user' && msg.content.startsWith('blob') ? (
                <img src={msg.content} alt="uploaded" className="image-message" />
              ) : (
                <p className={`bubble ${msg.from === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                  {msg.content.includes('[Endangered Animal List]') ? (
                    <>
                      🔗 For more information, please navigate to the{' '}
                      <Link to="/animals" className="inline-link">
                        Endangered Animal List
                      </Link>.
                    </>
                  ) : (
                    msg.content.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))
                  )}
                </p>
              )}
              {msg.from === 'user' && !msg.content.startsWith('blob') && <span className="avatar">🧑</span>}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="file-input"
        />
        <button onClick={handleImageUpload} className="send-button">Send</button>
      </div>
    </div>
  );
}

export default ChatApp;
