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
                    {/* Path 1: The "A" Triangle (Outer Wrapper) */}
                    <motion.path
                        d="M 35 180 L 100 20 L 165 180"
                        fill="transparent"
                        stroke="#a855f7"
                        strokeWidth="18"
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

                    {/* Path 2: The "P" Loop inside (Inner Leg + Closed Loop) - Slanted Parallel */}
                    <motion.path
                        d="M 65 180 L 83 135 L 135 135 C 185 135 185 65 135 65 L 100 65 L 83 135"
                        fill="transparent"
                        stroke="#a855f7"
                        strokeWidth="18"
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
