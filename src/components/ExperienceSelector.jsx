import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Box } from 'lucide-react';

const ExperienceSelector = () => {
    const navigate = useNavigate();

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
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
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
                zIndex: 0
            }}></div>

            <motion.h1
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.8 }}
                style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center', zIndex: 1, textTransform: 'uppercase', letterSpacing: '4px' }}
            >
                Select Experience
            </motion.h1>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', zIndex: 1 }}>

                {/* Terminal Option */}
                <motion.div
                    whileHover={{ scale: 1.05, borderColor: '#a855f7' }}
                    onClick={() => navigate('/terminal')}
                    style={{
                        width: '300px',
                        height: '400px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(0,0,0,0.6)',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        padding: '20px'
                    }}
                >
                    <Terminal size={64} color="#a855f7" style={{ marginBottom: '20px' }} />
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Terminal OS</h2>
                    <p style={{ textAlign: 'center', opacity: 0.6, lineHeight: 1.6 }}>
                        The classic full-stack developer portfolio. Built for speed and efficiency.
                    </p>
                    <div style={{ marginTop: 'auto', color: '#a855f7', fontSize: '0.9rem' }}>SYSTEM READY</div>
                </motion.div>

                {/* 3D Gallery Option */}
                <motion.div
                    whileHover={{ scale: 1.05, borderColor: '#3b82f6' }}
                    onClick={() => navigate('/gallery')}
                    style={{
                        width: '300px',
                        height: '400px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(0,0,0,0.6)',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        padding: '20px'
                    }}
                >
                    <Box size={64} color="#3b82f6" style={{ marginBottom: '20px' }} />
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>3D Gallery</h2>
                    <p style={{ textAlign: 'center', opacity: 0.6, lineHeight: 1.6 }}>
                        Immersive first-person exploration. Walk through the exhibit.
                    </p>
                    <div style={{ marginTop: 'auto', color: '#3b82f6', fontSize: '0.9rem' }}>ENTER WORLD</div>
                </motion.div>
            </div>

            <div style={{ marginTop: '3rem', opacity: 0.4, fontSize: '0.8rem' }}>mtanthony.com</div>
        </div>
    );
};

export default ExperienceSelector;
