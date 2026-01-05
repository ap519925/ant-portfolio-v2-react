import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const MobileControls = () => {
    // Helper to trigger keyboard events for desktop-like behavior
    const simulateKey = (key, type) => {
        const event = new KeyboardEvent(type, { key: key, code: key === ' ' ? 'Space' : undefined });
        window.dispatchEvent(event);
    };

    // --- JOYSTICK LOGIC ---
    const joystickRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const origin = useRef({ x: 0, y: 0 });
    const maxRadius = 40; // Max joystick movement from center

    const handleStart = (clientX, clientY) => {
        setDragging(true);
        origin.current = { x: clientX, y: clientY };
    };

    const handleMove = (clientX, clientY) => {
        if (!dragging) return;
        const dx = clientX - origin.current.x;
        const dy = clientY - origin.current.y;
        const distance = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);

        // Clamp to maxRadius
        const clampedDist = Math.min(distance, maxRadius);
        const x = Math.cos(angle) * clampedDist;
        const y = Math.sin(angle) * clampedDist;

        setPosition({ x, y });

        // Translate joystick pos to Keys (W/A/S/D)
        const threshold = 10;
        if (y < -threshold) { simulateKey('w', 'keydown'); simulateKey('s', 'keyup'); }
        else if (y > threshold) { simulateKey('s', 'keydown'); simulateKey('w', 'keyup'); }
        else { simulateKey('w', 'keyup'); simulateKey('s', 'keyup'); }

        if (x < -threshold) { simulateKey('a', 'keydown'); simulateKey('d', 'keyup'); }
        else if (x > threshold) { simulateKey('d', 'keydown'); simulateKey('a', 'keyup'); }
        else { simulateKey('a', 'keyup'); simulateKey('d', 'keyup'); }
    };

    const handleEnd = () => {
        setDragging(false);
        setPosition({ x: 0, y: 0 });
        // Release all keys
        ['w', 'a', 's', 'd'].forEach(k => simulateKey(k, 'keyup'));
    };

    // Touch handlers
    const onTouchStart = (e) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e) => handleMove(e.touches[0].clientX, e.touches[0].clientY);

    // Mouse handlers (for testing on desktop if needed)
    const onMouseDown = (e) => handleStart(e.clientX, e.clientY);
    const useWindowMouseEvents = () => {
        useEffect(() => {
            const move = (e) => handleMove(e.clientX, e.clientY);
            const up = () => handleEnd();
            if (dragging) {
                window.addEventListener('mousemove', move);
                window.addEventListener('mouseup', up);
            }
            return () => {
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', up);
            };
        }, [dragging]);
    };
    useWindowMouseEvents(); // Attach window listeners when dragging with mouse

    // --- BUTTON HANDLERS ---
    const handleTouchStartBtn = (key) => (e) => { e.preventDefault(); simulateKey(key, 'keydown'); };
    const handleTouchEndBtn = (key) => (e) => { e.preventDefault(); simulateKey(key, 'keyup'); };
    const handleMouseDownBtn = (key) => () => simulateKey(key, 'keydown');
    const handleMouseUpBtn = (key) => () => simulateKey(key, 'keyup');

    // --- STYLES ---
    const btnBaseStyle = {
        width: '50px', height: '50px',
        background: 'rgba(255, 255, 255, 0.2)', border: '2px solid rgba(255, 255, 255, 0.5)', borderRadius: '50%',
        color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem',
        backdropFilter: 'blur(5px)', userSelect: 'none', cursor: 'pointer', pointerEvents: 'auto', touchAction: 'none'
    };

    return (
        <>
            <style>{`@media (min-width: 1024px) { .mobile-controls-group { display: none !important; } }`}</style>

            {/* JOYSTICK ZONE - Bottom Left */}
            <div className="mobile-controls-group" style={{
                position: 'absolute', bottom: '40px', left: '40px',
                width: '100px', height: '100px', zIndex: 100, touchAction: 'none'
            }}>
                {/* Joystick Base */}
                <div
                    onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={handleEnd}
                    onMouseDown={onMouseDown}
                    style={{
                        width: '100px', height: '100px',
                        borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid rgba(255,255,255,0.3)', position: 'relative',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}
                >
                    {/* Joystick Stick */}
                    <div style={{
                        width: '50px', height: '50px', borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        transition: dragging ? 'none' : 'transform 0.1s ease-out'
                    }} />
                </div>
            </div>

            {/* ACTION BUTTONS - Bottom Right */}
            <div className="mobile-controls-group" style={{
                position: 'absolute', bottom: '30px', right: '30px',
                zIndex: 100, display: 'flex', gap: '15px', alignItems: 'flex-end', pointerEvents: 'none'
            }}>
                <button
                    onTouchStart={handleTouchStartBtn('e')} onTouchEnd={handleTouchEndBtn('e')}
                    onMouseDown={handleMouseDownBtn('e')} onMouseUp={handleMouseUpBtn('e')}
                    style={{ ...btnBaseStyle, background: 'rgba(255, 215, 0, 0.3)' }}
                >E</button>

                <button
                    onTouchStart={handleTouchStartBtn('f')} onTouchEnd={handleTouchEndBtn('f')}
                    onMouseDown={handleMouseDownBtn('f')} onMouseUp={handleMouseUpBtn('f')}
                    style={btnBaseStyle}
                >F</button>

                <button
                    onTouchStart={handleTouchStartBtn(' ')} onTouchEnd={handleTouchEndBtn(' ')}
                    onMouseDown={handleMouseDownBtn(' ')} onMouseUp={handleMouseUpBtn(' ')}
                    style={{ ...btnBaseStyle, width: '80px', borderRadius: '40px' }}
                >JUMP</button>
            </div>
        </>
    );
};

export default MobileControls;
