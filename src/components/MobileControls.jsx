import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const MobileControls = () => {
    const simulateKey = (key, type) => {
        const event = new KeyboardEvent(type, { key: key, code: key === ' ' ? 'Space' : undefined });
        window.dispatchEvent(event);
    };

    const handleTouchStart = (key) => (e) => {
        e.preventDefault(); // Prevent scrolling/zooming/mouse emulation
        simulateKey(key, 'keydown');
    };

    const handleTouchEnd = (key) => (e) => {
        e.preventDefault();
        simulateKey(key, 'keyup');
    };

    // --- STYLES ---
    // Common button style
    const btnBaseStyle = {
        width: '50px',
        height: '50px',
        background: 'rgba(255, 255, 255, 0.2)',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '50%',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.2rem',
        backdropFilter: 'blur(5px)',
        touchAction: 'none', // Critical for preventing browser zoom/scroll handling
        userSelect: 'none',
        cursor: 'pointer',
        transition: 'background 0.1s',
        pointerEvents: 'auto'
    };

    const dPadBtnStyle = { ...btnBaseStyle, position: 'absolute' };

    // Group Styles
    const leftGroupStyle = {
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        width: '120px',
        height: '120px',
        pointerEvents: 'none', // Container ignores clicks, buttons accept
        zIndex: 100,
    };

    const rightGroupStyle = {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        pointerEvents: 'none',
        zIndex: 100,
        display: 'flex',
        gap: '15px',
        alignItems: 'flex-end',
    };

    return (
        <>
            {/* Media query to hide on desktop */}
            <style>{`
                @media (min-width: 1024px) {
                    .mobile-controls-group { display: none !important; }
                }
            `}</style>

            {/* LEFT D-PAD */}
            <div className="mobile-controls-group" style={leftGroupStyle}>
                <button
                    style={{ ...dPadBtnStyle, top: 0, left: '35px' }}
                    onTouchStart={handleTouchStart('w')} onTouchEnd={handleTouchEnd('w')}
                    onMouseDown={() => simulateKey('w', 'keydown')} onMouseUp={() => simulateKey('w', 'keyup')}
                >
                    <ArrowUp />
                </button>
                <button
                    style={{ ...dPadBtnStyle, bottom: 0, left: '35px' }}
                    onTouchStart={handleTouchStart('s')} onTouchEnd={handleTouchEnd('s')}
                    onMouseDown={() => simulateKey('s', 'keydown')} onMouseUp={() => simulateKey('s', 'keyup')}
                >
                    <ArrowDown />
                </button>
                <button
                    style={{ ...dPadBtnStyle, top: '35px', left: 0 }}
                    onTouchStart={handleTouchStart('a')} onTouchEnd={handleTouchEnd('a')}
                    onMouseDown={() => simulateKey('a', 'keydown')} onMouseUp={() => simulateKey('a', 'keyup')}
                >
                    <ArrowLeft />
                </button>
                <button
                    style={{ ...dPadBtnStyle, top: '35px', right: 0 }}
                    onTouchStart={handleTouchStart('d')} onTouchEnd={handleTouchEnd('d')}
                    onMouseDown={() => simulateKey('d', 'keydown')} onMouseUp={() => simulateKey('d', 'keyup')}
                >
                    <ArrowRight />
                </button>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="mobile-controls-group" style={rightGroupStyle}>
                <button
                    onTouchStart={handleTouchStart('e')} onTouchEnd={handleTouchEnd('e')}
                    onMouseDown={() => simulateKey('e', 'keydown')} onMouseUp={() => simulateKey('e', 'keyup')}
                    style={{ ...btnBaseStyle, background: 'rgba(255, 215, 0, 0.3)' }}
                >
                    E
                </button>
                <button
                    onTouchStart={handleTouchStart('f')} onTouchEnd={handleTouchEnd('f')}
                    onMouseDown={() => simulateKey('f', 'keydown')} onMouseUp={() => simulateKey('f', 'keyup')}
                    style={btnBaseStyle}
                >
                    F
                </button>
                <button
                    onTouchStart={handleTouchStart(' ')} onTouchEnd={handleTouchEnd(' ')}
                    onMouseDown={() => simulateKey(' ', 'keydown')} onMouseUp={() => simulateKey(' ', 'keyup')}
                    style={{ ...btnBaseStyle, width: '80px', borderRadius: '40px' }}
                >
                    JUMP
                </button>
            </div>
        </>
    );
};

export default MobileControls;
