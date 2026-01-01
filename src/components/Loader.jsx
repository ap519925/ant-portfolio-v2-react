import React from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

const Loader = ({ finishLoading }) => {
    const containerVariants = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.3
            }
        },
        exit: {
            opacity: 0,
            y: "-100%",
            transition: {
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1]
            }
        }
    };

    const pathVariants = {
        initial: {
            pathLength: 0,
            opacity: 0
        },
        animate: {
            pathLength: 1,
            opacity: 1,
            transition: {
                duration: 1.5,
                ease: "easeInOut"
            }
        }
    };

    // Fill animation after stroke
    const fillVariants = {
        initial: { fillOpacity: 0 },
        animate: {
            fillOpacity: 1,
            transition: { delay: 1.5, duration: 0.5 }
        }
    };

    return (
        <motion.div
            className="loader-overlay"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onAnimationComplete={() => {
                setTimeout(finishLoading, 2500);
            }}
        >
            <div className="loader-svg-wrapper">
                <svg className="loader-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    {/* Path 1: The "A" Triangle */}
                    <motion.path
                        d="M 60 180 L 100 20 L 160 180"
                        fill="transparent"
                        stroke="var(--accent-color)"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                            delay: 0.2
                        }}
                    />

                    {/* Path 2: The "P" Loop/Crossbar */}
                    <motion.path
                        d="M 30 145 L 125 145 C 175 145 175 85 125 85 L 105 85"
                        fill="transparent"
                        stroke="var(--accent-color)"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                            delay: 0.5
                        }}
                    />
                </svg>
            </div>
        </motion.div>
    );
};

export default Loader;
