import React from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const GameUI = ({ score, totalCollectibles, soundEnabled, musicEnabled, onToggleSound, onToggleMusic }) => {
    return (
        <>
            {/* Score Display */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '15px 25px',
                borderRadius: '15px',
                color: '#00ffff',
                fontFamily: 'Exo 2, sans-serif',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(0, 255, 255, 0.3)',
            }}>
                <div style={{ fontSize: '0.9em', opacity: 0.8, marginBottom: '5px' }}>
                    CRYSTALS COLLECTED
                </div>
                <div style={{ fontSize: '2em', fontWeight: 'bold', letterSpacing: '2px' }}>
                    {score} / {totalCollectibles}
                </div>
                {score === totalCollectibles && totalCollectibles > 0 && (
                    <div style={{
                        fontSize: '0.8em',
                        marginTop: '10px',
                        color: '#ffff00',
                        animation: 'pulse 1s infinite'
                    }}>
                        ✨ ALL COLLECTED! ✨
                    </div>
                )}
            </div>

            {/* Sound Controls */}
            <div style={{
                position: 'absolute',
                top: 20,
                right: 100,
                zIndex: 10,
                display: 'flex',
                gap: '10px',
            }}>
                {/* Sound Toggle */}
                <button
                    onClick={onToggleSound}
                    style={{
                        padding: '10px',
                        background: soundEnabled ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                    }}
                    title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
                >
                    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>

                {/* Music Toggle */}
                <button
                    onClick={onToggleMusic}
                    style={{
                        padding: '10px',
                        background: musicEnabled ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                        opacity: musicEnabled ? 1 : 0.5,
                    }}
                    title={musicEnabled ? 'Mute Music' : 'Unmute Music'}
                >
                    <Music size={20} />
                    {!musicEnabled && (
                        <div style={{
                            position: 'absolute',
                            width: '2px',
                            height: '30px',
                            background: 'red',
                            transform: 'rotate(45deg)',
                        }} />
                    )}
                </button>
            </div>

            {/* Controls Help */}
            <div style={{
                position: 'absolute',
                bottom: 30,
                right: 30,
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '15px',
                borderRadius: '10px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: 'Exo 2, sans-serif',
                fontSize: '0.85em',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
                <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#00ffff' }}>
                    CONTROLS
                </div>
                <div><strong>W/A/S/D</strong> - Move</div>
                <div><strong>SHIFT</strong> - Sprint</div>
                <div><strong>CLICK</strong> - Collect Crystals</div>
            </div>

            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `}
            </style>
        </>
    );
};

export default GameUI;
