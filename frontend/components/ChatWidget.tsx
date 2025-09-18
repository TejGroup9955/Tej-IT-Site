"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

const ChatWidget: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [userInfoSubmitted, setUserInfoSubmitted] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { user_message: string; bot_response: string }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [shakeWidget, setShakeWidget] = useState(false);
  const [errorFields, setErrorFields] = useState({ name: false, email: false, phone: false });
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedSessionId = sessionStorage.getItem("chatSessionId");
      if (!storedSessionId) {
        storedSessionId = uuidv4();
        sessionStorage.setItem("chatSessionId", storedSessionId);
      }
      setSessionId(storedSessionId);
      setIsPopupVisible(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const openChatTimeout = setTimeout(() => {
        setIsChatOpen(true);
        setIsPopupVisible(false);
      }, 2000);
      return () => clearTimeout(openChatTimeout);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !isChatOpen) {
      setIsPopupVisible(true);
    } else if (isChatOpen) {
      setIsPopupVisible(false);
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (userInfoSubmitted && isChatOpen && sessionId && typeof window !== "undefined") {
      axios
        .get(`http://10.10.50.78:5000/api/chat_history/${sessionId}`)
        .then((response) => {
          setChatHistory(response.data);
          scrollToBottom();
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
        });
    }
  }, [userInfoSubmitted, isChatOpen, sessionId]);

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };

  const toggleChat = () => {
    if (typeof window !== "undefined") {
      setIsChatOpen(!isChatOpen);
      if (!isChatOpen) {
        setIsPopupVisible(false);
        if (userInfoSubmitted) {
          scrollToBottom();
        }
      } else {
        setIsPopupVisible(true);
      }
    }
  };

  const dismissPopup = () => {
    if (typeof window !== "undefined") {
      setIsPopupVisible(false);
    }
  };

  const triggerValidationFeedback = () => {
    setShakeWidget(true);
    setErrorFields({
      name: !userName,
      email: !userEmail,
      phone: !userPhone,
    });
    setTimeout(() => setShakeWidget(false), 500); // Stop shaking after 0.5s
  };

  const selectOption = (option: string) => {
    if (!userName || !userEmail || !userPhone) {
      triggerValidationFeedback();
      return;
    }

    setUserInfoSubmitted(true);
    setIsChatOpen(true);
    sendMessage(option);
  };

  const submitPreChatForm = () => {
    if (!userName || !userEmail || !userPhone) {
      triggerValidationFeedback();
      return;
    }

    setUserInfoSubmitted(true);
    setIsChatOpen(true);
    sendMessage("How can we help you?");
  };

  const sendMessage = async (msg?: string) => {
    const userMessage = msg || message.trim();
    if (!userMessage) return;

    if (typeof window !== "undefined" && !sessionId) {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      sessionStorage.setItem("chatSessionId", newSessionId);
    }

    setIsTyping(true);
    setChatHistory([...chatHistory, { user_message: userMessage, bot_response: "" }]);
    scrollToBottom();

    try {
      const response = await axios.post("http://10.10.50.78:5000/api/chat", {
        message: userMessage,
        session_id: sessionId,
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
      });

      if (response.data.requires_details) {
        triggerValidationFeedback();
        setChatHistory((prev) => prev.slice(0, -1));
        setUserInfoSubmitted(false);
        return;
      }

      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { user_message: userMessage, bot_response: response.data.response },
      ]);
      setMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { user_message: userMessage, bot_response: "Sorry, I encountered an error. Please try again." },
      ]);
      scrollToBottom();
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <style jsx>{`
        #chat-widget {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 360px;
          max-height: 600px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          z-index: 10000;
          font-family: 'Poppins', sans-serif;
          transform: translateY(100%);
          transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
        }
        #chat-widget.chat-hidden {
          transform: translateY(100%);
          opacity: 0;
          pointer-events: none;
        }
        #chat-widget:not(.chat-hidden) {
          transform: translateY(0);
          opacity: 1;
        }
        #chat-widget.shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        #chat-widget.animate-pop {
          animation: pop 0.3s ease-in-out;
        }
        @keyframes pop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        #chat-header {
          background: linear-gradient(90deg, #007bff, #0056b3);
          color: #fff;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          font-size: 16px;
          font-weight: 600;
        }
        #bot-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 12px;
          object-fit: cover;
        }
        #chat-close {
          background: none;
          border: none;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          line-height: 1;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #chat-close:hover {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }
        #chat-close svg {
          width: 20px;
          height: 20px;
        }
        #pre-chat-form, #chat-area {
          padding: 20px;
          flex: 1;
          overflow-y: auto;
        }
        #welcome-message {
          font-size: 15px;
          color: #222;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 500;
        }
        #pre-chat-form button {
          display: block;
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.3s, transform 0.2s;
        }
        #pre-chat-form button:hover {
          background: #0056b3;
          transform: translateY(-2px);
        }
        #pre-chat-form input {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          font-size: 13px;
          background: #f9f9f9;
        }
        #pre-chat-form input.error {
          border-color: #ff0000;
          box-shadow: 0 0 8px rgba(255, 0, 0, 0.2);
        }
        #pre-chat-form input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
        }
        #start-chat-btn {
          background: #28a745;
          color: #fff;
        }
        #start-chat-btn:hover {
          background: #218838;
          transform: translateY(-2px);
        }
        #chat-history {
          flex: 1;
          overflow-y: auto;
          padding: 10px 0;
        }
        .message {
          margin: 10px 0;
          padding: 12px 16px;
          border-radius: 12px;
          max-width: 85%;
          font-size: 13px;
          line-height: 1.6;
          display: flex;
          align-items: flex-start;
        }
        .user-message {
          background: #e3f2fd;
          color: #222;
          align-self: flex-end;
          margin-left: auto;
          border-bottom-right-radius: 4px;
        }
        .bot-message {
          background: #f1f4f8;
          color: #222;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        .message-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          margin-right: 10px;
          flex-shrink: 0;
          object-fit: cover;
        }
        #typing-indicator {
          display: flex;
          align-items: center;
          padding: 10px;
          color: #555;
          font-size: 12px;
        }
        #typing-indicator img {
          margin-right: 8px;
        }
        #typing-indicator.chat-hidden {
          display: none;
        }
        #chat-input-area {
          display: flex;
          align-items: center;
          padding: 12px;
          background: #f1f4f8;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
        }
        
        #chat-input {
          flex: 1;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          font-size: 13px;
          background: #fff;
        }
        #chat-input:focus {
          outline: none;
          border-color: #007bff;
        }
        #chat-input-area button {
          padding: 12px 18px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          margin-left: 10px;
          font-weight: 500;
          transition: background 0.3s, transform 0.2s;
        }
        #chat-input-area button:hover {
          background: #0056b3;
          transform: translateY(-2px);
        }
        #chat-toggle-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10001;
        }
        #chat-toggle {
          width: 60px;
          height: 60px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        #chat-toggle:hover {
          background: #0056b3;
          transform: scale(1.15) rotate(360deg);
        }
        #chat-toggle img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 50%;
        }
        #popup-message {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 200px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #222;
          font-family: 'Poppins', sans-serif;
          transform: translateY(0);
          transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
        }
        #popup-message.popup-hidden {
          transform: translateY(20px);
          opacity: 0;
          pointer-events: none;
        }
        #popup-message span {
          flex: 1;
        }
        #popup-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        #popup-close:hover {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 50%;
        }
        #popup-close svg {
          width: 16px;
          height: 16px;
        }
        .chat-section.chat-hidden {
          display: none;
        }
        #welcome-gif-container {
          position: absolute;
          bottom: 90px;
          right: 165px;
          width: 120px;
          background: transparent;
          display: flex;
          justify-content: center;
          transform: translateY(0);
          transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
        }
        #welcome-gif-container.popup-hidden {
          transform: translateY(20px);
          opacity: 0;
          pointer-events: none;
        }
        .welcome-gif {
          width: 120px;
          height: 120px;
        }
        #welcome-gif-container:not(.popup-hidden) {
          animation: bounce 0.5s ease-in-out;
        }
        #popup-message:not(.popup-hidden) {
          animation: bounce 0.5s ease-in-out;
        }
        @keyframes bounce {
          0% { transform: translateY(20px); opacity: 0; }
          50% { transform: translateY(-5px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 400px) {
          #chat-widget {
            width: 90%;
            max-height: 80vh;
            bottom: 70px;
          }
          #popup-message {
            width: 180px;
            font-size: 12px;
            right: 0;
            bottom: 70px;
          }
          #welcome-gif-container {
            bottom: 80px;
            right: 170px;
            width: 90px;
          }
          .welcome-gif {
            width: 90px;
            height: 90px;
          }
          #chat-toggle img {
            width: 50px;
            height: 50px;
          }
          #bot-avatar {
            width: 36px;
            height: 36px;
          }
          .message-avatar {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
      <div id="chat-toggle-container">
        <div
          id="welcome-gif-container"
          className={`welcome-gif-container ${isPopupVisible ? "" : "popup-hidden"}`}
        >
          <Image
            src="/chatbot/welcome.gif"
            alt="Welcome Animation"
            className="welcome-gif"
            width={120}
            height={120}
            unoptimized={true}
          />
        </div>
        <div
          id="popup-message"
          className={`popup-message ${isPopupVisible ? "" : "popup-hidden"}`}
        >
          <span>How may I assist you today?</span>
          <button onClick={dismissPopup} aria-label="Close popup">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <button
          id="chat-toggle"
          onClick={toggleChat}
          style={{ display: isChatOpen ? "none" : "flex" }}
        >
          <Image
            src="/chatbot/chat.webp"
            alt="Chat"
            width={85}
            height={85}
          />
        </button>
        <div id="chat-widget" className={`chat-widget ${isChatOpen ? "" : "chat-hidden"} ${isChatOpen ? "animate-pop" : ""} ${shakeWidget ? "shake" : ""}`}>
          <div id="chat-header">
            <Image
              src="/chatbot/bot.png"
              alt="TejITbot"
              id="bot-avatar"
              width={70}
              height={70}
            />
            <span>TejIT BOT</span>
            <button onClick={toggleChat} aria-label="Minimize chat" id="chat-close">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="12" x2="20" y2="12"></line>
              </svg>
            </button>
          </div>
          <div
            id="pre-chat-form"
            className={`chat-section ${userInfoSubmitted ? "chat-hidden" : ""}`}
          >
            <p id="welcome-message">Welcome to Tej IT Solutions! How can we assist you today?</p>
            <button onClick={() => selectOption("I have a question")}>I have a question</button>
            <button onClick={() => selectOption("Tell me about your services")}>
              Explore Services
            </button>
            <p style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
              Personalize your experience
            </p>
            <input
              type="text"
              id="user-name"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setErrorFields((prev) => ({ ...prev, name: false }));
              }}
              className={errorFields.name ? "error" : ""}
            />
            <input
              type="email"
              id="user-email"
              placeholder="Your Email"
              value={userEmail}
              onChange={(e) => {
                setUserEmail(e.target.value);
                setErrorFields((prev) => ({ ...prev, email: false }));
              }}
              className={errorFields.email ? "error" : ""}
            />
            <input
              type="tel"
              id="user-phone"
              placeholder="Your Phone"
              value={userPhone}
              onChange={(e) => {
                setUserPhone(e.target.value);
                setErrorFields((prev) => ({ ...prev, phone: false }));
              }}
              className={errorFields.phone ? "error" : ""}
            />
            <button id="start-chat-btn" onClick={submitPreChatForm}>
              Start Chat
            </button>
          </div>
          <div
            id="chat-area"
            className={`chat-section ${userInfoSubmitted ? "" : "chat-hidden"}`}
          >
            <div id="chat-history" ref={chatHistoryRef}>
              {chatHistory.map((msg, index) => (
                <div key={index}>
                  <div className="message user-message">
                    <strong>You:</strong> {msg.user_message}
                  </div>
                  {msg.bot_response && (
                    <div className="message bot-message">
                      <Image
                        src="/chatbot/chat-icon.webp"
                        alt="TejITbot"
                        className="message-avatar"
                        width={24}
                        height={24}
                      />
                      <div>
                        <strong>TejITbot:</strong> {msg.bot_response}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div id="typing-indicator" className={`typing-indicator ${isTyping ? "" : "chat-hidden"}`}>
              <Image
                src="/chatbot/loading.gif"
                alt="Typing..."
                width={24}
                height={24}
                unoptimized={true}
              />
              <span>TejITbot is responding...</span>
            </div>
            <div id="chat-input-area">
              <input
                type="text"
                id="chat-input"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={() => sendMessage()}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;