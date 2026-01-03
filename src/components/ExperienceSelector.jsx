import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Box, Play } from 'lucide-react';

const ExperienceSelector = () => {
    const navigate = useNavigate();
    const [hoveredOption, setHoveredOption] = useState(null);
    const terminalVideoRef = useRef(null);
    const galleryVideoRef = useRef(null);

    // Play video when hovering
    useEffect(() => {
        if (hoveredOption === 'terminal' && terminalVideoRef.current) {
            terminalVideoRef.current.play();
        } else if (terminalVideoRef.current) {
            terminalVideoRef.current.pause();
            terminalVideoRef.current.currentTime = 0;
        }

        if (hoveredOption === 'gallery' && galleryVideoRef.current) {
            galleryVideoRef.current.play();
        } else if (galleryVideoRef.current) {
            galleryVideoRef.current.pause();
            galleryVideoRef.current.currentTime = 0;
        }
    }, [hoveredOption]);

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const videoVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050505',
            color: 'white',
            fontFamily: 'Exo 2',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background gradient */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
                zIndex: 0
            }}></div>

            {/* Video Preview Background */}
            <AnimatePresence>
                {hoveredOption && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={videoVariants}
                        transition={{ duration: 0.4 }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '70vw',
                            height: '70vh',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            border: `3px solid ${hoveredOption === 'terminal' ? '#a855f7' : '#3b82f6'}`,
                            boxShadow: `0 0 60px ${hoveredOption === 'terminal' ? '#a855f780' : '#3b82f680'}`,
                            zIndex: 1,
                        }}
                    >
                        {hoveredOption === 'terminal' && (
                            <video
                                ref={terminalVideoRef}
                                src="/assets/terminal-preview.mp4"
                                loop
                                muted
                                playsInline
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'brightness(0.7)',
                                }}
                            />
                        )}
                        {hoveredOption === 'gallery' && (
                            <video
                                ref={galleryVideoRef}
                                src="/assets/gallery-preview.mp4"
                                loop
                                muted
                                playsInline
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'brightness(0.7)',
                                }}
                            />
                        )}
                        {/* Overlay gradient */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'radial-gradient(circle at center, transparent 0%, rgba(5,5,5,0.8) 100%)',
                            pointerEvents: 'none'
                        }}></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.h1
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.8 }}
                style={{
                    fontSize: '3rem',
                    marginBottom: '3rem',
                    textAlign: 'center',
                    zIndex: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '4px',
                    position: 'relative'
                }}
            >
                Select Experience
            </motion.h1>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', zIndex: 2, position: 'relative' }}>

                {/* Terminal Option */}
                <motion.div
                    whileHover={{ scale: 1.05, y: -10 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setHoveredOption('terminal')}
                    onHoverEnd={() => setHoveredOption(null)}
                    onClick={() => navigate('/terminal')}
                    style={{
                        width: '350px',
                        height: '450px',
                        border: `2px solid ${hoveredOption === 'terminal' ? '#a855f7' : 'rgba(255,255,255,0.1)'}`,
                        background: hoveredOption === 'terminal'
                            ? 'rgba(168, 85, 247, 0.1)'
                            : 'rgba(0,0,0,0.6)',
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(20px)',
                        padding: '30px',
                        transition: 'all 0.3s ease',
                        boxShadow: hoveredOption === 'terminal'
                            ? '0 20px 60px rgba(168, 85, 247, 0.4)'
                            : '0 10px 30px rgba(0,0,0,0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Animated background gradient on hover */}
                    {hoveredOption === 'terminal' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
                                animation: 'rotate 8s linear infinite',
                            }}
                        />
                    )}

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <motion.div
                            animate={hoveredOption === 'terminal' ? {
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.1, 1.1, 1]
                            } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <Terminal size={80} color="#a855f7" style={{ marginBottom: '25px' }} />
                        </motion.div>
                        <h2 style={{
                            fontSize: '1.8rem',
                            marginBottom: '15px',
                            color: hoveredOption === 'terminal' ? '#a855f7' : 'white',
                            transition: 'color 0.3s'
                        }}>Terminal OS</h2>
                        <p style={{
                            textAlign: 'center',
                            opacity: 0.8,
                            lineHeight: 1.8,
                            fontSize: '1rem'
                        }}>
                            The classic full-stack developer portfolio. Built for speed and efficiency.
                        </p>
                        {hoveredOption === 'terminal' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    marginTop: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    color: '#a855f7',
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Play size={20} /> PREVIEW PLAYING
                            </motion.div>
                        )}
                        <div style={{
                            marginTop: 'auto',
                            paddingTop: '25px',
                            color: '#a855f7',
                            fontSize: '0.95rem',
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                        }}>
                            {hoveredOption === 'terminal' ? '► CLICK TO ENTER' : 'SYSTEM READY'}
                        </div>
                    </div>
                </motion.div>

                {/* 3D Gallery Option */}
                <motion.div
                    whileHover={{ scale: 1.05, y: -10 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setHoveredOption('gallery')}
                    onHoverEnd={() => setHoveredOption(null)}
                    onClick={() => navigate('/gallery')}
                    style={{
                        width: '350px',
                        height: '450px',
                        border: `2px solid ${hoveredOption === 'gallery' ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
                        background: hoveredOption === 'gallery'
                            ? 'rgba(59, 130, 246, 0.1)'
                            : 'rgba(0,0,0,0.6)',
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(20px)',
                        padding: '30px',
                        transition: 'all 0.3s ease',
                        boxShadow: hoveredOption === 'gallery'
                            ? '0 20px 60px rgba(59, 130, 246, 0.4)'
                            : '0 10px 30px rgba(0,0,0,0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Animated background gradient on hover */}
                    {hoveredOption === 'gallery' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                                animation: 'rotate 8s linear infinite',
                            }}
                        />
                    )}

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <motion.div
                            animate={hoveredOption === 'gallery' ? {
                                rotateY: 360,
                                scale: [1, 1.1, 1.1, 1]
                            } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            <Box size={80} color="#3b82f6" style={{ marginBottom: '25px' }} />
                        </motion.div>
                        <h2 style={{
                            fontSize: '1.8rem',
                            marginBottom: '15px',
                            color: hoveredOption === 'gallery' ? '#3b82f6' : 'white',
                            transition: 'color 0.3s'
                        }}>3D Gallery</h2>
                        <p style={{
                            textAlign: 'center',
                            opacity: 0.8,
                            lineHeight: 1.8,
                            fontSize: '1rem'
                        }}>
                            Immersive first-person exploration. Walk through the exhibit.
                        </p>
                        {hoveredOption === 'gallery' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    marginTop: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    color: '#3b82f6',
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Play size={20} /> PREVIEW PLAYING
                            </motion.div>
                        )}
                        <div style={{
                            marginTop: 'auto',
                            paddingTop: '25px',
                            color: '#3b82f6',
                            fontSize: '0.95rem',
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                        }}>
                            {hoveredOption === 'gallery' ? '► CLICK TO ENTER' : 'ENTER WORLD'}
                        </div>
                    </div>
                </motion.div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '30px',
                opacity: 0.4,
                fontSize: '0.8rem',
                zIndex: 2
            }}>
                mtanthony.com
            </div>

            <style>{`
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ExperienceSelector;
