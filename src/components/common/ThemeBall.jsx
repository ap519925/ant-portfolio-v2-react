import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import './Theme.css';

const TennisTexture = ({ opacity }) => (
    <motion.div
        style={{
            opacity,
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            borderRadius: '50%',
            background: '#ccff00', // Tennis ball neon green
            boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.2)', // Depth
            pointerEvents: 'none',
            zIndex: 2
        }}
    >
        {/* Tennis Ball Lines - SVG Curves */}
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', borderRadius: '50%' }}>
            {/* White curves */}
            <path d="M 15 15 C 35 35, 35 65, 15 85" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 85 15 C 65 35, 65 65, 85 85" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
    </motion.div>
);

const ThemeBall = ({ dotRef, destRef, langDestRef }) => {
    const { setTheme, theme } = useTheme();
    const { toggleLanguage, language } = useLanguage();
    const [startPos, setStartPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [themeEndPos, setThemeEndPos] = useState({ x: 0, y: 0 });
    const [langEndPos, setLangEndPos] = useState({ x: 0, y: 0 });
    const [ready, setReady] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const { scrollY } = useScroll();
    const smoothScroll = useSpring(scrollY, { stiffness: 150, damping: 25 });

    useEffect(() => {
        const updatePos = () => {
            if (dotRef.current) {
                const rect = dotRef.current.getBoundingClientRect();
                setStartPos({ x: rect.left, y: rect.top, width: rect.width || 6, height: rect.height || 6 });
            }
            if (destRef?.current) {
                const rect = destRef.current.getBoundingClientRect();
                setThemeEndPos({ x: rect.left + (rect.width / 2) - 16, y: rect.top + (rect.height / 2) - 16 });
            }
            if (langDestRef?.current) {
                const rect = langDestRef.current.getBoundingClientRect();
                setLangEndPos({ x: rect.left + (rect.width / 2) - 16, y: rect.top + (rect.height / 2) - 16 });
            }
            setReady(true);
        };

        updatePos();
        window.addEventListener('resize', updatePos);
        window.addEventListener('scroll', updatePos); // Recalculate on scroll to catch sticky/fixed movement changes

        // Also use ResizeObserver for precision during Navbar transition
        const resizeObserver = new ResizeObserver(() => {
            updatePos();
        });

        if (destRef?.current) resizeObserver.observe(destRef.current);
        const navbar = document.querySelector('.navbar');
        if (navbar) resizeObserver.observe(navbar);

        return () => {
            window.removeEventListener('resize', updatePos);
            window.removeEventListener('scroll', updatePos);
            resizeObserver.disconnect();
        };
    }, [dotRef, destRef, langDestRef]);

    // --- Bounce & Split Physics --- //

    // X Axis: Linear interpolation for Theme Ball
    const themeX = useTransform(scrollY, [0, 500], [startPos.x, themeEndPos.x]);

    // Y Axis: Bounce Effect!
    const themeY = useTransform(scrollY, (v) => {
        if (!ready) return 0;
        const p = Math.min(v / 500, 1);
        const linearY = startPos.y + (themeEndPos.y - startPos.y) * p;

        // Bounce Logic: 3 Bounces (6 PI). Amplitude decays from 200px.
        const bounceAmp = 200 * (1 - p);
        // Use abs(sin) for bouncing off "floor" (or just oscillating if bouncing spread across screen)
        // Let's invert y to make it hop UP.
        const bounce = Math.abs(Math.sin(p * Math.PI * 6)) * bounceAmp;

        // Adding bounce to linear path. (Subtracting from Y moves it UP)
        // Adding bounce to linear path moves it DOWN into the page
        return linearY + bounce;
    });

    // Language Ball Split Logic
    const langX = useTransform(scrollY, (v) => {
        if (!ready) return 0;
        const p = Math.min(v / 500, 1);
        const splitPoint = 0.85;

        // Position of Theme Ball (Calculate manually to stay synced)
        const currentThemeX = startPos.x + (themeEndPos.x - startPos.x) * p;

        if (p < splitPoint) return currentThemeX; // Stick together

        // Separate!
        const splitP = (p - splitPoint) / (1 - splitPoint);
        // Start split from where Theme X is at 0.85
        const splitStart = startPos.x + (themeEndPos.x - startPos.x) * splitPoint;
        return splitStart + (langEndPos.x - splitStart) * splitP;
    });

    const langY = useTransform(scrollY, (v) => {
        if (!ready) return 0;
        const p = Math.min(v / 500, 1);
        const splitPoint = 0.85;

        // Re-calc theme Y logic
        const linearY = startPos.y + (themeEndPos.y - startPos.y) * p;
        const bounceAmp = 200 * (1 - p);
        const bounce = Math.abs(Math.sin(p * Math.PI * 6)) * bounceAmp;
        const currentThemeY = linearY + bounce;

        if (p < splitPoint) return currentThemeY;

        // Continuity at Split Point
        const splitP = (p - splitPoint) / (1 - splitPoint);
        const splitLinearY = startPos.y + (themeEndPos.y - startPos.y) * splitPoint;
        const splitBounce = Math.abs(Math.sin(splitPoint * Math.PI * 6)) * (200 * (1 - splitPoint));
        const splitStart = splitLinearY + splitBounce;

        return splitStart + (langEndPos.y - splitStart) * splitP;
    });

    // Fade Transition: Tennis Texture -> Button Icon
    const tennisOpacity = useTransform(smoothScroll, [0, 420, 480], [1, 1, 0]);
    const iconOpacity = useTransform(smoothScroll, [420, 500], [0, 1]); // Icons fade in at end
    const btnScale = useTransform(smoothScroll, [0, 500], [0.2, 1]); // Grow from small dot

    // Size: Start small (dot), grow to button size
    const widthVal = useTransform(smoothScroll, [0, 500], [startPos.width || 8, 32]);
    const heightVal = useTransform(smoothScroll, [0, 500], [startPos.height || 8, 32]);

    const rotation = useTransform(smoothScroll, [0, 500], [0, 720]); // Spin the ball!

    if (!ready) return null;

    // Theme Menu Array (Abbreviated for brevity, full logic retained)
    const themes = [
        { id: 'light', color: '#ffffff', border: '#ddd' },
        { id: 'dark', color: '#0a0a0f', border: '#333' },
        { id: 'matrix', color: '#000000', border: '#00ff41' },
    ]; // (User has more, I should keep strictly if replacing file, but for this interaction simplifying the map for cleanliness if user didn't complain about theme counts. 
    // Actually safer to retain FULL list from previous read to not break functionality.
    // I will paste the full list from Step 426).

    const fullThemes = [
        { id: 'light', color: '#ffffff', border: '#ddd' },
        { id: 'dark', color: '#0a0a0f', border: '#333' },
        { id: 'matrix', color: '#000000', border: '#00ff41' },
        { id: 'ocean', color: '#0f172a', border: '#38bdf8' },
        { id: 'sunset', color: '#2a1b3d', border: '#ff6b6b' },
        { id: 'cyberpunk', color: '#0b0d17', border: '#f700ff' },
        { id: 'forest', color: '#051405', border: '#4caf50' },
        { id: 'coffee', color: '#2c241b', border: '#ddb892' },
        { id: 'royal', color: '#1a0b2e', border: '#ffd700' },
        { id: 'synthwave', color: '#2b213a', border: '#b967ff' },
        { id: 'nordic', color: '#2e3440', border: '#88c0d0' },
        { id: 'earth', color: '#2b2621', border: '#bc6c25' },
        { id: 'midnight', color: '#020617', border: '#6366f1' },
        { id: 'minimal', color: '#ffffff', border: '#18181b' },
        { id: 'candy', color: '#fff0f5', border: '#ff91c8' },
    ];

    return (
        <>
            {/* Gooey Filter for Split Effect */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <filter id="goo-new">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            {/* Filtered Container */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2000, filter: 'url(#goo-new)' }}>

                {/* Theme Ball (Main) */}
                <motion.div
                    className="theme-ball-main"
                    onClick={() => setMenuOpen(!menuOpen)}
                    whileHover={{ scale: 1.25, rotate: 90, boxShadow: '0 0 25px var(--accent-glow)' }}
                    whileTap={{ scale: 0.9, rotate: -15 }}
                    style={{
                        position: 'fixed', top: 0, left: 0,
                        x: themeX, y: themeY,
                        width: widthVal, height: heightVal,
                        rotate: rotation,
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-color)', // Underlying Button Color
                        border: '2px solid rgba(255, 255, 255, 0.4)', // Slightly stronger border
                        cursor: 'pointer', pointerEvents: 'auto',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        zIndex: 2002
                    }}
                >
                    <TennisTexture opacity={tennisOpacity} />
                    <motion.div style={{ opacity: iconOpacity, width: '60%', height: '60%', color: '#fff', zIndex: 3 }}>
                        <Palette size="100%" />
                    </motion.div>
                </motion.div>

                {/* Language Ball (Split) */}
                <motion.div
                    onClick={toggleLanguage}
                    whileHover={{ scale: 1.25, rotate: -15, boxShadow: '0 0 25px var(--accent-glow)' }}
                    whileTap={{ scale: 0.9, rotate: 0 }}
                    style={{
                        position: 'fixed', top: 0, left: 0,
                        x: langX, y: langY,
                        width: widthVal, height: heightVal,
                        rotate: rotation,
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-color)',
                        border: '2px solid rgba(255, 255, 255, 0.4)',
                        cursor: 'pointer', pointerEvents: 'auto',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        zIndex: 2002
                    }}
                >
                    <TennisTexture opacity={tennisOpacity} />
                    <motion.div style={{ opacity: iconOpacity, color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 3 }}>
                        {language === 'en' ? 'ZH' : 'EN'}
                    </motion.div>
                </motion.div>
            </div>

            {/* Theme Menu (Unfiltered) */}
            {menuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'fixed', left: themeEndPos.x - 30, top: themeEndPos.y + 25, zIndex: 2005,
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
                        background: 'rgba(20, 20, 30, 0.95)', padding: '12px', borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'
                    }}
                >
                    {fullThemes.map((t) => (
                        <div key={t.id} onClick={() => { setTheme(t.id); setMenuOpen(false); }}
                            style={{
                                width: '22px', height: '22px', borderRadius: '50%',
                                backgroundColor: t.color, border: `2px solid ${t.border}`,
                                cursor: 'pointer', margin: 'auto',
                                boxShadow: theme === t.id ? `0 0 8px ${t.border}` : 'none'
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </>
    );
};

export default ThemeBall;
