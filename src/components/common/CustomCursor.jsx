import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
    // 1. Motion Values for precise, non-react-render updates
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // 2. Spring physics for the trailing ring
    const springConfig = { damping: 25, stiffness: 250 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // 3. Simple State for visual variants (hovering/clicking)
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [ripples, setRipples] = useState([]);

    useEffect(() => {
        // --- MOVE HANDLER ---
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        // --- HOVER HANDLERS (Delegation) ---
        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button') || e.target.style.cursor === 'pointer' || e.target.classList.contains('clickable')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        // --- CLICK HANDLERS ---
        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        // --- TAP/RIPPLE HANDLER ---
        const handleTap = (e) => {
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);

            if (x !== undefined && y !== undefined) {
                const newRipple = { x, y, id: Date.now() };
                setRipples((prev) => [...prev, newRipple]);

                // Cleanup ripple after animation
                setTimeout(() => {
                    setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
                }, 600);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('click', handleTap); // Desktop clicks
        window.addEventListener('touchstart', handleTap); // Mobile taps

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('click', handleTap);
            window.removeEventListener('touchstart', handleTap);
        };
    }, []);

    // Helper for className
    const ringClass = `custom-cursor-ring ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`;

    return (
        <>
            {/* Ripples (Visible on all devices) */}
            {ripples.map((ripple) => (
                <div
                    key={ripple.id}
                    className="tap-ripple"
                    style={{ left: ripple.x, top: ripple.y }}
                />
            ))}

            {/* Custom Cursor (Hidden on Touch via CSS) */}
            {/* Inner Dot - Follows EXACTLY (no spring) */}
            <motion.div
                className="custom-cursor-dot"
                style={{
                    translateX: cursorX,
                    translateY: cursorY,
                    x: "-50%",
                    y: "-50%"
                }}
            />

            {/* Outer Ring - Follows with SPRING */}
            <motion.div
                className={ringClass}
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    x: "-50%",
                    y: "-50%"
                }}
            />
        </>
    );
};

export default CustomCursor;
