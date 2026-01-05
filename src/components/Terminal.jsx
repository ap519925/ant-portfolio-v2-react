import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from './ThemeContext';
import { callOpenRouter } from '../utils/aiService';

const Terminal = () => {
    const [windowState, setWindowState] = useState('normal');
    const { toggleTheme, setTheme } = useTheme();
    const [history, setHistory] = useState([
        { type: 'output', text: 'Welcome to Anthony\'s Terminal v2.0.0 (AI Enabled)' },
        { type: 'output', text: 'Try "ask <question>" to query the AI.' },
        { type: 'output', text: 'Type "help" for a list of commands.' },
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    const handleClose = () => setWindowState('closed');
    const handleMinimize = () => setWindowState(prev => prev === 'minimized' ? 'normal' : 'minimized');
    const handleMaximize = () => setWindowState(prev => prev === 'maximized' ? 'normal' : 'maximized');

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    }, [history]);

    const handleCommand = async (cmd) => {
        const fullCmd = cmd.trim();
        const command = fullCmd.split(' ')[0].toLowerCase();
        const args = fullCmd.substring(command.length).trim();

        let outputText = '';
        let type = 'output';

        // Helper to push output immediately (for async loaders)
        const pushHistory = (txt, t = 'output') => {
            setHistory(prev => [...prev, { type: t, text: txt }]);
        };

        switch (command) {
            case 'ask':
            case 'ai':
            case 'openrouter':
                if (!args) {
                    outputText = `Usage: ${command} <question>`;
                    break;
                }

                // Add command to history immediately so we can show a loader
                setHistory(prev => [...prev, { type: 'command', text: fullCmd }]);
                setInput(''); // Clear input early

                // DETERMINE PROVIDER
                const provider = 'openrouter';

                // GET KEY
                const key = localStorage.getItem('OPENROUTER_KEY') || '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';

                if (!key) {
                    pushHistory(`Error: No API Key found for ${provider}. Configure it in the LiveChat settings first.`, 'error-output');
                    return;
                }

                pushHistory(`Connecting to ${provider}...`, 'output');

                try {
                    let response = "";
                    // Prepare message structure for aiService
                    const messages = [{ role: 'user', content: args }];
                    response = await callOpenRouter(messages, key);
                    pushHistory(response, 'success-output');
                } catch (err) {
                    console.error("AI Error:", err);
                    pushHistory(`Connection Failed: ${err.message}`, 'error-output');
                }
                return; // Return early since we handled history manually
            case 'chat':
                if (window.openLiveChat) {
                    window.openLiveChat();
                    outputText = 'Opening secure communication channel...';
                    type = 'success-output';
                } else {
                    outputText = 'Chat system offline. (Widget not loaded)';
                    type = 'error-output';
                }
                break;
            case 'start':
            case 'help':
                const commands = [
                    { cmd: 'help', desc: 'Show this list' },
                    { cmd: 'ask <msg>', desc: 'Ask AI (OpenRouter) 🤖' },
                    { cmd: 'chat', desc: 'Live Chat (Tawk.to) 💬' },
                    { cmd: 'games', desc: 'My favorite games 🎮' },
                    { cmd: 'specs', desc: 'My PC Build 🖥️' },
                    { cmd: 'sports', desc: 'Activities I love ⚽' },
                    { cmd: 'chinese', desc: 'Mandarin skills 🇨🇳' },
                    { cmd: 'sing', desc: 'Karaoke time 🎤' },
                    { cmd: 'music', desc: 'Play a random track 🎵' },
                    { cmd: 'theme', desc: 'Toggle theme 🎨' },
                    { cmd: 'whoami', desc: 'About Anthony' },
                    { cmd: 'clear', desc: 'Clear terminal' },
                ];

                outputText = (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '10px 0' }}>
                        <div style={{ marginBottom: '8px', opacity: 0.8 }}>Available commands:</div>
                        {commands.map((item) => (
                            <div key={item.cmd} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
                                <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{item.cmd}</span>
                                <span style={{ opacity: 0.9 }}>{item.desc}</span>
                            </div>
                        ))}
                    </div>
                );
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'theme':
                toggleTheme();
                outputText = 'Theme toggled successfully.';
                type = 'success-output';
                break;
            case 'games':
                outputText = (
                    <div>
                        <div style={{ marginBottom: '5px' }}>Top Games in Rotation:</div>
                        <ul style={{ listStyleType: 'none', paddingLeft: '10px', color: 'var(--text-secondary)' }}>
                            <li>🔵 <strong style={{ color: '#fff' }}>Halo</strong> - "Wake me when you need me."</li>
                            <li>🪂 <strong style={{ color: '#fff' }}>PUBG</strong> - "Winner Winner Chicken Dinner!"</li>
                            <li>⚔️ <strong style={{ color: '#fff' }}>Valorant</strong> - Jett/Omen Main.</li>
                        </ul>
                    </div>
                );
                break;
            case 'halo':
                outputText = 'Spartan-117 reporting for duty. Shields rechargeable. MJOLNIR Armor systems nominal.';
                type = 'success-output';
                break;
            case 'pubg':
                outputText = 'Better luck next time! 🍳';
                break;
            case 'valorant':
                outputText = 'ACE! 🔫🔫🔫🔫🔫';
                type = 'success-output';
                break;
            case 'specs':
            case 'build':
                outputText = (
                    <div>
                        <div style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>System Specifications:</div>
                        <div>CPU: 12th Gen Intel® Core™ i9-12900K</div>
                        <div>GPU: Intel® Arc™ A770LE 16GB</div>
                        <div>RAM: 64GB DDR5</div>
                        <div>Storage: 4TB NVMe SSD</div>
                        <div>Case: Lian Li O11 Dynamic</div>
                        <div style={{ marginTop: '5px', fontStyle: 'italic', opacity: 0.7 }}>"Powered by Team Blue."</div>
                    </div>
                );
                break;
            case 'sports':
                outputText = '⚽ Soccer (Midfielder) | 🎾 Tennis (Nadal fan?) | 🏀 Basketball (Shooting Guard)';
                break;
            case 'chinese':
            case 'mandarin':
                outputText = (
                    <div>
                        <div>你好! (Nǐ hǎo!)</div>
                        <div>我叫 Anthony. 很高兴认识你.</div>
                        <div style={{ opacity: 0.7 }}>(Hello! My name is Anthony. Nice to meet you.)</div>
                    </div>
                );
                break;
            case 'sing':
                outputText = (
                    <div>
                        <div>🎤 <span style={{ fontStyle: 'italic' }}>"月亮代表我的心..." (The Moon Represents My Heart)</span></div>
                        <div style={{ marginTop: '5px' }}>🎤 <span style={{ fontStyle: 'italic' }}>"Never gonna give you up, never gonna let you down..."</span></div>
                    </div>
                );
                break;
            case 'sudo':
                outputText = 'Permission denied: User is not in the sudoers file. This incident will be reported.';
                type = 'error-output';
                break;
            case 'ping':
                outputText = 'Pong! 🏓 (Latency: 1ms)';
                break;
            case 'coffee':
                outputText = '☕ Brewing java... [██████████] 100% Done.';
                type = 'success-output';
                break;
            case 'ls':
                outputText = 'home    about    work    contact    resume.pdf';
                break;
            case 'ls -a':
            case 'ls -la':
            case 'matrix':
                setTheme('matrix');
                outputText = (
                    <div>
                        <div style={{ marginBottom: '10px' }}>
                            home    about    work    contact    resume.pdf    <span style={{ color: '#00ff41', textShadow: '0 0 5px #00ff41' }}>.matrix_config</span>
                        </div>
                        <div style={{ color: '#00ff41', fontFamily: 'monospace' }}>
                            <div>[SYSTEM] Hidden configuration found.</div>
                            <div>[SYSTEM] Decoding entry...</div>
                            <div>[SYSTEM] Matrix mode activated.</div>
                        </div>
                    </div>
                );
                type = 'success-output';
                break;
            case 'stocks':
                outputText = (
                    <div>
                        <div style={{ marginBottom: '5px', borderBottom: '1px solid var(--text-secondary)', paddingBottom: '2px' }}>📊 Market Watch</div>

                        <div style={{ marginBottom: '8px' }}>
                            <div style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>Top MoversToday:</div>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <span>🚀 <strong style={{ color: '#00ff41' }}>GME</strong> +12%</span>
                                <span>🚀 <strong style={{ color: '#00ff41' }}>AMC</strong> +8%</span>
                                <span>📉 <strong style={{ color: '#ff4d4d' }}>NVDA</strong> -1.2%</span>
                            </div>
                        </div>

                        <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                            <li>🪙 <strong style={{ color: '#f7931a' }}>BTC</strong>: $98,420 <span style={{ color: '#00ff41', fontSize: '0.8em' }}>(+4.2%)</span></li>
                            <li>🐕 <strong style={{ color: '#e6b758' }}>DOGE</strong>: $0.42 <span style={{ color: '#00ff41', fontSize: '0.8em' }}>(+6.9%)</span></li>
                            <li>🍎 <strong style={{ color: '#ccc' }}>AAPL</strong>: $235.10 <span style={{ color: '#ff4d4d', fontSize: '0.8em' }}>(-0.5%)</span></li>
                        </ul>
                        <div style={{ opacity: 0.6, fontSize: '0.8rem', marginTop: '5px' }}>*Data simulated. Not financial advice.*</div>
                    </div>
                );
                break;
            case 'crump': {
                const quotes = [
                    "Just bought the dip! 📉➡️📈",
                    "Charts are looking bullish on the 4H timeframe.",
                    "HODL till the moon! 🚀",
                    "Market makers are trapping bears right now.",
                    "Remember: Time in the market > Timing the market.",
                    "Analyzing the MACD crossover... looks like a reversal imminent.",
                    "Stochastics are oversold. Loading the boat.",
                    "Volume precedes price. Watch the breakout."
                ];
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                outputText = (
                    <div>
                        <div style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>@DONALD_CRUMP:</div>
                        <div>"{randomQuote}"</div>
                        <div style={{ marginTop: '5px', fontSize: '0.8rem' }}><a href="https://stocktwits.com/DONALD_CRUMP" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>View Profile</a></div>
                    </div>
                );
                break;
            }
            case 'music':
                outputText = (
                    <div style={{ margin: '10px 0' }}>
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/playlist/3GWBkCGdj8G3iQ3we1DKwu?utm_source=generator&theme=0"
                            width="100%"
                            height="152"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            title="Spotify Playlist"
                        ></iframe>
                        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.75rem', opacity: 0.6 }}>
                            If the player doesn't load, <a href="https://open.spotify.com/playlist/3GWBkCGdj8G3iQ3we1DKwu" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)' }}>open in Spotify</a>
                        </div>
                    </div >
                );
                break;
            case 'party':
            case 'confetti':
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                outputText = 'Party time!';
                type = 'success-output';
                break;
            case 'joke': {
                const jokes = [
                    "Why do programmers prefer dark mode? Because light attracts bugs!",
                    "How many programmers does it take to change a light bulb? None. It's a hardware problem.",
                    "Why do Java developers wear glasses? Because they don't C#!",
                    "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
                    "There are 10 types of people in the world: those who understand binary and those who don't.",
                    "Programming is 10% writing code and 90% understanding why it doesn't work."
                ];
                outputText = jokes[Math.floor(Math.random() * jokes.length)];
                break;
            }
            case 'quote': {
                const quotes = [
                    "Code is like humor. When you have to explain it, it's bad. - Cory House",
                    "First, solve the problem. Then, write the code. - John Johnson",
                    "Programming isn't about what you know; it's about what you can figure out. - Chris Pine",
                    "The best error message is the one that never shows up. - Thomas Fuchs"
                ];
                outputText = quotes[Math.floor(Math.random() * quotes.length)];
                type = 'success-output';
                break;
            }
            case 'time':
            case 'date':
                outputText = `Current time: ${new Date().toLocaleTimeString()}\nDate: ${new Date().toLocaleDateString()}`;
                break;
            case 'pwd':
                outputText = '/home/anthony/portfolio';
                break;
            case 'whoami':
                outputText = 'Anthony Phillips\nFull-Stack Developer & Analyst based in NYC.';
                break;
            case 'cd':
                outputText = 'usage: cd [directory]';
                break;
            case 'github':
                window.open('https://github.com/ap519925', '_blank');
                outputText = 'Opening GitHub...';
                type = 'success-output';
                break;
            case 'linkedin':
                window.open('https://linkedin.com', '_blank');
                outputText = 'Opening LinkedIn...';
                type = 'success-output';
                break;
            default:
                if (fullCmd.startsWith('cd ')) {
                    const dir = fullCmd.split(' ')[1];
                    const sections = ['home', 'about', 'work', 'contact'];
                    if (sections.includes(dir)) {
                        const element = document.getElementById(dir);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                            outputText = `Navigating to /${dir}...`;
                            type = 'success-output';
                        }
                    } else if (dir === '..') {
                        outputText = 'Already at root.';
                    } else {
                        outputText = `cd: no such file or directory: ${dir}`;
                        type = 'error-output';
                    }
                } else if (fullCmd.startsWith('echo ')) {
                    const text = fullCmd.substring(5);
                    outputText = text;
                } else {
                    outputText = `Command not found: ${command}. Type "help" for valid commands.`;
                }
                break;
        }

        setHistory(prev => [
            ...prev,
            { type: 'command', text: fullCmd },
            { type: type, text: outputText }
        ]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    const [size, setSize] = useState({ width: 450, height: 350 });

    // Resize Logic
    const initResize = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = size.width;
        const startHeight = size.height;

        const doDrag = (e) => {
            setSize({
                width: Math.max(300, startWidth + e.clientX - startX),
                height: Math.max(200, startHeight + e.clientY - startY)
            });
        };

        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
        };

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
    };

    const variants = {
        normal: {
            scale: 1,
            opacity: 1,
            height: size.height,
            width: size.width,
            rotateY: -5,
            rotateX: 5,
            position: 'absolute'
        },
        hover: {
            rotateY: 0,
            rotateX: 0
        },
        closed: {
            scale: 0,
            opacity: 0,
            transition: { duration: 0.3 }
        },
        minimized: {
            height: '50px',
            width: '200px',
            overflow: 'hidden',
            rotateY: 0,
            rotateX: 0
        },
        maximized: {
            scale: 1.1,
            rotateY: 0,
            rotateX: 0,
            zIndex: 100,
            position: 'absolute',
            width: '90vw',
            height: '80vh'
        }
    };

    return (
        <AnimatePresence>
            {windowState !== 'closed' && (
                <motion.div
                    className={`code-block-wrapper ${windowState}`}
                    initial="normal"
                    animate={windowState}
                    whileHover={windowState === 'normal' ? "hover" : undefined}
                    variants={variants}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    drag={windowState === 'normal'}
                    dragMomentum={false}
                    onClick={() => {
                        if (windowState !== 'minimized' && inputRef.current) {
                            inputRef.current.focus();
                        }
                    }}
                    style={{ zIndex: 50 }}
                >
                    <div className="code-block-header" style={{ cursor: 'grab' }}>
                        <div className="window-controls">
                            <span className="dot red" onClick={(e) => { e.stopPropagation(); handleClose(); }} title="Close">
                                <X size={8} strokeWidth={4} />
                            </span>
                            <span className="dot yellow" onClick={(e) => { e.stopPropagation(); handleMinimize(); }} title="Minimize">
                                <Minus size={8} strokeWidth={4} />
                            </span>
                            <span className="dot green" onClick={(e) => { e.stopPropagation(); handleMaximize(); }} title="Maximize">
                                <Maximize2 size={8} strokeWidth={4} />
                            </span>
                        </div>
                    </div>

                    <div className="code-block-content" style={{ height: 'calc(100% - 50px)' }}>
                        {history.map((line, index) => (
                            <div key={index} className={line.type === 'command' ? 'terminal-line' : line.type}>
                                {line.type === 'command' && <span className="terminal-prompt">➜  ~</span>}
                                {line.text}
                            </div>
                        ))}
                        <div className="terminal-line">
                            <span className="terminal-prompt">➜  ~</span>
                            <input
                                ref={inputRef}
                                type="text"
                                className="terminal-input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                spellCheck="false"
                                autoComplete="off"
                            />
                        </div>
                        <div ref={bottomRef} />
                    </div>

                    {/* Resize Handle */}
                    {windowState === 'normal' && (
                        <div
                            onMouseDown={initResize}
                            style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 0,
                                width: '20px',
                                height: '20px',
                                cursor: 'nwse-resize',
                                zIndex: 10,
                                background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.3) 50%)',
                                borderBottomRightRadius: '12px'
                            }}
                        />
                    )}
                </motion.div>
            )}

            {windowState === 'closed' && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setWindowState('normal')}
                    className="btn btn-sm"
                    style={{ position: 'absolute' }}
                >
                    Reopen Terminal
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default Terminal;
