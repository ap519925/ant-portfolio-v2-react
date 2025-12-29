import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <div className="hero-wrapper">
            <section id="home" className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content animate-fade-in">
                        <p className="hero-greeting accent-text">Hello, I'm</p>
                        <h1 className="hero-name gradient-text">Anthony Phillips<span ref={(el) => window.dotRef = { current: el }}>.</span></h1>
                        <h2 className="hero-role">Full-Stack Developer & Analyst</h2>
                        <p className="hero-description">
                            I craft stylish, high-performance digital experiences. Based in Queens, NYC, I specialize in
                            full-stack development, technical analysis, and creating seamless user interfaces.
                        </p>

                        <div className="hero-buttons">
                            <a href="#work" className="btn btn-primary">
                                View My Work <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
                            </a>
                            <a href="#contact" className="btn">
                                Contact Me
                            </a>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <InteractiveCodeBlock />
                    </div>
                </div>

                <a href="#about" className="scroll-indicator">
                    <span className="mouse">
                        <span className="wheel"></span>
                    </span>
                    <span className="arrow"><ChevronDown size={24} /></span>
                </a>
            </section>
        </div>
    );
};

// Interactive Code Block Subcomponent
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useTheme } from './ThemeContext';

const InteractiveCodeBlock = () => {
    const [windowState, setWindowState] = useState('normal');
    const { toggleTheme } = useTheme();
    const [history, setHistory] = useState([
        { type: 'output', text: 'Welcome to Anthony\'s Terminal v1.0.0' },
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

    const handleCommand = (cmd) => {
        const command = cmd.trim().toLowerCase();
        let outputText = '';
        let type = 'output';

        switch (command) {
            case 'help':
                outputText = `Available commands:
  - help: Show this list
  - clear: Clear terminal
  - theme: Toggle theme
  - party: Celebration time
  - ls: List directory
  - cd [dir]: Navigate to section
  - whoami: About Anthony
  - joke: Random dev joke
  - quote: Inspirational quote
  - time: Current time
  - pwd: Present working directory
  - github: Open GitHub
  - linkedin: Open LinkedIn`;
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'theme':
                toggleTheme();
                outputText = 'Theme toggled successfully.';
                type = 'success-output';
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
            case 'joke':
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
            case 'quote':
                const quotes = [
                    "Code is like humor. When you have to explain it, it's bad. - Cory House",
                    "First, solve the problem. Then, write the code. - John Johnson",
                    "Programming isn't about what you know; it's about what you can figure out. - Chris Pine",
                    "The best error message is the one that never shows up. - Thomas Fuchs"
                ];
                outputText = quotes[Math.floor(Math.random() * quotes.length)];
                type = 'success-output';
                break;
            case 'time':
                outputText = `Current time: ${new Date().toLocaleTimeString()}\nDate: ${new Date().toLocaleDateString()}`;
                break;
            case 'pwd':
                outputText = '/home/anthony/portfolio';
                break;
            case 'whoami':
                outputText = 'Anthony Phillips\nFull-Stack Developer & Analyst based in NYC.';
                break;
            case 'ls':
                outputText = 'home    about    work    contact    resume.pdf';
                break;
            case 'cd':
                outputText = 'usage: cd [directory]';
                break;
            case 'github':
                window.open('https://github.com/AntMan247', '_blank');
                outputText = 'Opening GitHub...';
                type = 'success-output';
                break;
            case 'linkedin':
                window.open('https://linkedin.com', '_blank');
                outputText = 'Opening LinkedIn...';
                type = 'success-output';
                break;
            default:
                if (command.startsWith('cd ')) {
                    const dir = command.split(' ')[1];
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
                } else if (command.startsWith('echo ')) {
                    const text = cmd.substring(5);
                    outputText = text;
                } else {
                    outputText = `Command not found: ${command}. Type "help" for valid commands.`;
                }
                break;
        }

        setHistory(prev => [
            ...prev,
            { type: 'command', text: cmd },
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
    const constraintsRef = useRef(null);

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
                            <span className="dot red" onClick={(e) => { e.stopPropagation(); handleClose(); }} title="Close"></span>
                            <span className="dot yellow" onClick={(e) => { e.stopPropagation(); handleMinimize(); }} title="Minimize"></span>
                            <span className="dot green" onClick={(e) => { e.stopPropagation(); handleMaximize(); }} title="Maximize"></span>
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
export default Hero;
