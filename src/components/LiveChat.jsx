import React, { useState, useEffect, useRef } from 'react';
import './LiveChat.css';
import { Send, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hi! I'm Anthony's AI Assistant. Ask me about his skills, projects, or how to contact him." }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Expose open function globally for Terminal integration
    useEffect(() => {
        window.openLiveChat = () => setIsOpen(true);
        return () => { delete window.openLiveChat; };
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // User Message
        const userText = inputValue.trim();
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setInputValue('');
        setIsTyping(true);

        // Simulated AI Delay/Response
        setTimeout(() => {
            const botResponse = generateResponse(userText);
            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
            setIsTyping(false);
        }, 1500); // 1.5s delay for realism
    };

    // Simple Rule-Based AI Logic
    const generateResponse = (input) => {
        const lower = input.toLowerCase();

        if (lower.includes('contact') || lower.includes('email') || lower.includes('reach')) {
            return "You can email Anthony directly at ant.phillips@example.com (Replace with real email) or connect on LinkedIn!";
        }
        if (lower.includes('skill') || lower.includes('stack') || lower.includes('tech')) {
            return "Anthony is proficient in React, Node.js, TypeScript, and standard web technologies. He loves building interactive UIs like this one!";
        }
        if (lower.includes('project') || lower.includes('work')) {
            return "You can browse the 'Projects' tab to see his latest work, including this portfolio site.";
        }
        if (lower.includes('hire') || lower.includes('job')) {
            return "Anthony is currently open to new opportunities! Please reach out via the Contact section.";
        }
        if (lower.includes('real') || lower.includes('human')) {
            return "I am a simulated AI assistant running locally in your browser. Anthony is the real human here.";
        }
        if (lower.includes('hello') || lower.includes('hi')) {
            return "Hello there! How can I help you today?";
        }

        // Default Fallback
        return "I'm focusing on Anthony's professional background. Try asking about his skills, projects, or contact info!";
    };

    return (
        <div className="chat-widget-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chat-window"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className="chat-header">
                            <div className="chat-title">
                                <span className="chat-status-dot"></span>
                                AI Assistant
                            </div>
                            <button className="chat-close" onClick={() => setIsOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.role}`}>
                                    {msg.text}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="message bot typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form className="chat-input-area" onSubmit={handleSend}>
                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Type a message..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button type="submit" className="chat-send" disabled={!inputValue.trim() || isTyping}>
                                <Send size={16} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Launcher Button */}
            <motion.button
                className="chat-launcher"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
};

export default LiveChat;
