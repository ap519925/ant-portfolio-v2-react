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
                <svg viewBox="0 0 200 140" className="loader-svg">
                    {/* Main 'A' Triangle */}
                    <motion.path
                        d="M 50 130 L 100 10 L 150 130"
                        stroke="#ffffff"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="transparent"
                        variants={pathVariants}
                    />

                    {/* The P-Loop Swoosh */}
                    <motion.path
                        d="M 30 85 L 125 85 C 165 85 165 40 125 40 L 105 40"
                        stroke="#ffffff"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="transparent"
                        variants={pathVariants}
                    />
                </svg>
            </div>
        </motion.div>
    );
};

export default Loader;
