import React, { useState, useRef } from 'react';
import { Html, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Music, X, Minimize2, Maximize2 } from 'lucide-react';

// Your Spotify playlist URL
const PLAYLIST_EMBED_URL = 'https://open.spotify.com/embed/playlist/3GWBkCGdj8G3iQ3we1DKwu?utm_source=generator';

const SpotifyWidget3D = ({ position = [0, 4, -15] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const groupRef = useRef();

    // Gentle floating animation
    useFrame((state) => {
        if (groupRef.current && !isOpen) {
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <group ref={groupRef} position={position}>
                {/* Floating Icon/Button when closed */}
                {!isOpen && (
                    <Html position={[0, 0, 0]} center transform sprite style={{ pointerEvents: 'auto' }}>
                        <button
                            onClick={() => setIsOpen(true)}
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
                                border: '3px solid rgba(255, 255, 255, 0.5)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(29, 185, 84, 0.5)',
                                transition: 'all 0.3s ease',
                                animation: 'pulse 2s infinite',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.1)';
                                e.target.style.boxShadow = '0 12px 48px rgba(29, 185, 84, 0.8)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 8px 32px rgba(29, 185, 84, 0.5)';
                            }}
                        >
                            <Music size={40} color="white" />
                        </button>
                        <style>{`
                            @keyframes pulse {
                                0%, 100% { transform: scale(1); }
                                50% { transform: scale(1.05); }
                            }
                        `}</style>
                    </Html>
                )}

                {/* Expanded Spotify Widget */}
                {isOpen && (
                    <Html
                        position={[0, 0, 0]}
                        center
                        transform
                        distanceFactor={8}
                        zIndexRange={[1000, 0]}
                        style={{
                            pointerEvents: 'auto',
                            userSelect: 'none',
                        }}
                    >
                        <div style={{
                            width: isMinimized ? '350px' : '450px',
                            minHeight: isMinimized ? '100px' : 'auto',
                            background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)',
                            borderRadius: '20px',
                            border: '2px solid rgba(29, 185, 84, 0.5)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                        }}>
                            {/* Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
                                padding: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Music size={24} color="white" />
                                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                                        My Playlist
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => setIsMinimized(!isMinimized)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {isMinimized ? <Maximize2 size={18} color="white" /> : <Minimize2 size={18} color="white" />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            setCurrentTrack(null);
                                        }}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <X size={18} color="white" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            {!isMinimized && (
                                <div style={{ padding: '20px' }}>
                                    {/* Spotify Playlist Player */}
                                    <iframe
                                        src={PLAYLIST_EMBED_URL}
                                        width="100%"
                                        height="480"
                                        frameBorder="0"
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        allowFullScreen
                                        loading="eager"
                                        title="Spotify Playlist Player"
                                        style={{ borderRadius: '12px', border: 'none' }}
                                    />
                                </div>
                            )}

                            {/* Minimized View */}
                            {isMinimized && (
                                <div
                                    onClick={() => setIsMinimized(false)}
                                    style={{
                                        padding: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        cursor: 'pointer',
                                    }}>
                                    <div style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: '#1DB954',
                                        boxShadow: '0 0 10px #1DB954',
                                        animation: 'pulse 1.5s infinite',
                                    }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                                            My Playlist
                                        </div>
                                        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                                            Click to expand
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Html>
                )}

                {/* Glow effect behind the widget */}
                <mesh position={[0, 0, -0.5]}>
                    <planeGeometry args={[6, 6]} />
                    <meshBasicMaterial color="#1DB954" transparent opacity={0.2} />
                </mesh>
            </group>
        </Float>
    );
};

export default SpotifyWidget3D;
