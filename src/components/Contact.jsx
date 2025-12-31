import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mail, MapPin, Linkedin, Github, Twitter } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    const ref = useRef(null);

    // Mouse position state
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth physics for rotation
    const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

    // Map mouse position to rotation degrees
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseXRel = e.clientX - rect.left - width / 2;
        const mouseYRel = e.clientY - rect.top - height / 2;

        x.set(mouseXRel / width);
        y.set(mouseYRel / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <section id="contact" className="section contact-section">
            <div className="noise-overlay"></div>

            {/* 3D Floating Shapes Background */}
            <div className="shape-3d shape-1"></div>
            <div className="shape-3d shape-2"></div>

            <div className="container" style={{ perspective: '2000px' }}>
                <h2 className="section-title">Get In Touch</h2>

                <motion.div
                    ref={ref}
                    className="contact-wrapper-3d"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: 'preserve-3d'
                    }}
                >
                    <div className="contact-wrapper" style={{ transform: "translateZ(50px)" }}>
                        <div className="contact-info">
                            <h3>Let's Talk</h3>
                            <p>
                                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                            </p>

                            <div className="contact-details">
                                <div className="contact-item">
                                    <div className="icon-box">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h4>Email Me</h4>
                                        <p>anthony@mtanthony.com</p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="icon-box">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h4>Location</h4>
                                        <p>Queens, NYC</p>
                                    </div>
                                </div>
                            </div>

                            <div className="social-links">
                                <a href="https://github.com/ap519925" className="social-btn"><Github size={20} /></a>
                                <a href="https://linkedin.com" className="social-btn"><Linkedin size={20} /></a>
                                <a href="https://twitter.com/bearish_bulls" className="social-btn"><Twitter size={20} /></a>
                            </div>
                        </div>

                        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" placeholder="Your Name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" placeholder="Your Email" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" rows="5" placeholder="Your Message"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
