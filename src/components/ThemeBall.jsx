import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import './Theme.css';

const ThemeBall = ({ dotRef, destRef }) => {
    const { setTheme, theme } = useTheme();
    const [startPos, setStartPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [endPos, setEndPos] = useState({ x: 0, y: 0 });
    const [ready, setReady] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const { scrollY } = useScroll();

    useEffect(() => {
        const updatePos = () => {
            if (dotRef.current) {
                const rect = dotRef.current.getBoundingClientRect();
                setStartPos({
                    x: rect.left,
                    y: rect.top, // Exact top-left of the placeholder
                    width: rect.width,
                    height: rect.height
                });
            }

            let destFound = false;
            if (destRef?.current) {
                const rect = destRef.current.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    // We want the center of the ball to land in the center of the placeholder
                    // But since top/left are used, we aim for top-left corners matching or centered logic
                    // The placeholder is likely 40x40ish?
                    // Visual ball size at scale 5 is approx 30px (6px * 5)
                    // Let's center it.

                    setEndPos({
                        x: rect.left + (rect.width / 2) - (15), // Center ball: (30px size / 2) = 15 offset
                        y: rect.top + (rect.height / 2) - (15)
                    });
                    destFound = true;
                }
            }

            if (!destFound) {
                setEndPos({
                    x: typeof window !== 'undefined' ? window.innerWidth - 80 : 1000,
                    y: 25
                });
            }

            if (dotRef.current) setReady(true);
        };

        updatePos();
        window.addEventListener('resize', updatePos);
        return () => window.removeEventListener('resize', updatePos);
    }, [dotRef, destRef]);


    const scrollX = useTransform(scrollY, [0, 500], [startPos.x, endPos.x]);
    const scrollYPos = useTransform(scrollY, [0, 500], [startPos.y, endPos.y]);

    // Instead of scaling, we animate width/height directly to avoid child layout distortions
    // Start size is approx 6px. End size is 32px.
    const widthVal = useTransform(scrollY, [0, 500], [startPos.width || 6, 32]);
    const heightVal = useTransform(scrollY, [0, 500], [startPos.width || 6, 32]);

    const iconOpacity = useTransform(scrollY, [400, 500], [0, 1]);

    if (!ready) return null;

    const themes = [
        { id: 'light', color: '#ffffff', border: '#ddd' },
        { id: 'dark', color: '#0a0a0f', border: '#333' },
        { id: 'matrix', color: '#000000', border: '#00ff41' },
        { id: 'ocean', color: '#0f172a', border: '#38bdf8' },
        { id: 'sunset', color: '#2a1b3d', border: '#ff6b6b' },
        { id: 'cyberpunk', color: '#0b0d17', border: '#f700ff' },
        { id: 'forest', color: '#051405', border: '#4caf50' },
        { id: 'coffee', color: '#2c241b', border: '#ddb892' },
        { id: 'royal', color: '#1a0b2e', border: '#ffd700' },
    ];

    return (
        <>
            <motion.div
                className="theme-ball"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-color)',
                    x: scrollX,
                    y: scrollYPos,
                    width: widthVal,
                    height: heightVal,
                    zIndex: 2000,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}
            >
                <motion.div style={{
                    opacity: iconOpacity,
                    width: '60%',
                    height: '60%',
                    color: '#fff',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {theme === 'light' ? <Moon size="100%" /> : <Sun size="100%" />}
                </motion.div>

                {/* Theme Menu */}
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        style={{
                            position: 'absolute',
                            top: '40px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '10px',
                            background: 'rgba(20, 20, 30, 0.95)',
                            padding: '12px',
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'default',
                            backdropFilter: 'blur(10px)',
                            minWidth: '90px',
                            justifyItems: 'center'
                        }}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                    >
                        {themes.map((t) => (
                            <div
                                key={t.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTheme(t.id);
                                    setMenuOpen(false);
                                }}
                                style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    backgroundColor: t.color,
                                    border: `2px solid ${t.border}`,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    boxShadow: theme === t.id ? `0 0 8px ${t.border}` : 'none'
                                }}
                                title={t.id.charAt(0).toUpperCase() + t.id.slice(1)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </>
    );
};

export default ThemeBall;
