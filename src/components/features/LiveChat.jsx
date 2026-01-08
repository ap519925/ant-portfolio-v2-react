import React, { useState, useEffect, useRef } from 'react';
import './LiveChat.css';
import { Send, MessageSquare, X, Settings, Key, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { callOpenRouter } from '../../utils/aiService';

const BOT = {
    id: 'bear',
    name: 'Bear Bearrington III',
    avatar: '/assets/bear-bearrington.png',
    color: '#D4A574',
    greeting: "Good day! I'm Bear Bearrington III, a distinguished dog and your AI assistant. How may I be of service?",
    model: 'meta-llama/llama-3.2-3b-instruct:free',
    systemPrompt: "You are Bear Bearrington III, a sophisticated and distinguished dog who serves as an AI assistant. You are literally a dog - a dapper, well-dressed dog with impeccable manners and refined tastes. You occasionally make subtle dog-related references (treats, walks, tail wagging, playing fetch, belly rubs, bones) while maintaining your distinguished gentleman persona. You are helpful, knowledgeable, and always professional, speaking with the courteous tone befitting a cultured canine of high society. Balance your dog nature with your sophisticated demeanor.",
};

const LiveChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'bot', text: BOT.greeting }]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [apiKey, setApiKey] = useState(localStorage.getItem('OPENROUTER_KEY') || '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');

    const messagesEndRef = useRef(null);

    useEffect(() => {
        window.openLiveChat = () => setIsOpen(true);
        return () => { delete window.openLiveChat; };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, isOpen, showSettings]);

    const handleSaveKey = () => {
        if (apiKey) localStorage.setItem('OPENROUTER_KEY', apiKey);
        setShowSettings(false);
        setMessages(prev => [...prev, { role: 'bot', text: "API Key saved! Connecting to the neural networks..." }]);
    };

    const handleClearChat = () => {
        setMessages([{ role: 'bot', text: BOT.greeting }]);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userText = inputValue.trim();
        const newMsg = { role: 'user', text: userText };
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
        setIsTyping(true);

        let botResponse = "";

        try {
            if (apiKey) {
                // Keep only last 10 messages (5 exchanges) to avoid context length issues
                const recentMessages = messages.slice(-10);
                const orMsgs = [
                    { role: "system", content: BOT.systemPrompt },
                    ...recentMessages.slice(1).map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text })),
                    { role: "user", content: userText }
                ];
                botResponse = await callOpenRouter(orMsgs, apiKey, BOT.model);
            } else {
                await new Promise(r => setTimeout(r, 1000));
                botResponse = "Please configure your OpenRouter API Key in settings.";
            }
        } catch (err) {
            botResponse = `Error: ${err.message}`;
        }

        setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
        setIsTyping(false);
    };

    return (
        <div className="live-chat-widget" style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="live-chat-widget chat-window"
                    >
                        <div className="chat-header">
                            <div className="header-info">
                                <div className="bot-icon-wrapper">
                                    <img src={BOT.avatar} alt={BOT.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                </div>
                                <span className="chat-bot-name">{BOT.name}</span>
                            </div>
                            <div className="header-actions">
                                <button onClick={handleClearChat} className="header-btn" title="Clear Chat">
                                    <Trash2 size={16} />
                                </button>
                                <button onClick={() => setShowSettings(!showSettings)} className="header-btn" title="Settings">
                                    <Settings size={16} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="header-btn" title="Close">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* CONTENT: EITHER CHAT OR SETTINGS */}
                        {
                            showSettings ? (
                                <div className="settings-panel">
                                    <div className="settings-title"><Key size={16} /> API Configuration</div>
                                    <div className="config-group">
                                        <label className="config-label">OpenRouter API Key</label>
                                        <input
                                            type="password" className="config-input" placeholder="sk-or..."
                                            value={apiKey}
                                            onChange={e => setApiKey(e.target.value)}
                                        />
                                    </div>
                                    <div className="save-text">Keys are stored locally in your browser.</div>
                                    <button className="save-btn" onClick={handleSaveKey}>Save & Close</button>
                                </div>
                            ) : (
                                <>
                                    <div className="chat-messages">
                                        {messages.map((msg, index) => {
                                            // Check if message contains image URLs (GIF, JPG, PNG, WEBP)
                                            const imageRegex = /(https?:\/\/[^\s]+\.(?:gif|jpg|jpeg|png|webp))/gi;
                                            const parts = msg.text.split(imageRegex);

                                            return (
                                                <div key={index} className={`message ${msg.role}`}>
                                                    {parts.map((part, i) => {
                                                        if (part.match(imageRegex)) {
                                                            return (
                                                                <img
                                                                    key={i}
                                                                    src={part}
                                                                    alt="Shared image"
                                                                    style={{
                                                                        maxWidth: '100%',
                                                                        borderRadius: '8px',
                                                                        marginTop: '8px',
                                                                        display: 'block'
                                                                    }}
                                                                />
                                                            );
                                                        }
                                                        return part;
                                                    })}
                                                </div>
                                            );
                                        })}
                                        {isTyping && (
                                            <div className="message bot typing-indicator">
                                                <span style={{ background: BOT.color }}></span>
                                                <span style={{ background: BOT.color }}></span>
                                                <span style={{ background: BOT.color }}></span>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    <form className="chat-input-area" onSubmit={handleSend}>
                                        <input
                                            type="text"
                                            className="chat-input"
                                            placeholder={`Message ${BOT.name}...`}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                        />
                                        <button type="submit" className="chat-send" disabled={!inputValue.trim() || isTyping}>
                                            <Send size={16} />
                                        </button>
                                    </form>
                                </>
                            )
                        }
                    </motion.div >
                )}
            </AnimatePresence >

            <motion.button
                className="chat-launcher"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderColor: isOpen ? BOT.color : 'rgba(255,255,255,0.1)' }}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div >
    );
};

export default LiveChat;
