import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mail, MapPin, Linkedin, Github, Twitter, Youtube, Video, Music } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    const ref = useRef(null);
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = React.useState(null); // null, 'sending', 'success', 'error'

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const response = await fetch("https://formsubmit.co/ajax/anthony.phillips.job@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus(null), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error("Form error:", error);
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="section contact-section">

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
                                        <p>anthony.phillips.job@gmail.com</p>
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
                                <a href="https://www.linkedin.com/in/anthony-phillips-dev/" className="social-btn"><Linkedin size={20} /></a>
                                <a href="https://x.com/bearish_bulls" className="social-btn"><Twitter size={20} /></a>
                                <a href="https://www.youtube.com/@jpowbrrrrrr" className="social-btn"><Youtube size={20} /></a>
                                <a href="https://www.tiktok.com/@antman1660" className="social-btn"><Video size={20} /></a>
                                <a href="https://open.spotify.com/playlist/3GWBkCGdj8G3iQ3we1DKwu" className="social-btn"><Music size={20} /></a>
                            </div>
                        </div>

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Your Name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Your Email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    placeholder="Your Message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={status === 'sending' || status === 'success'}>
                                {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Failed, Try again.' : 'Send Message'}
                            </button>
                            {status === 'success' && <p style={{ color: 'green', marginTop: '10px' }}>Thanks! I'll be in touch soon.</p>}
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
