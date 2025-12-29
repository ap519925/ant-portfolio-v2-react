import React from 'react';
import { Mail, MapPin, Linkedin, Github, Twitter } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    return (
        <section id="contact" className="section contact-section">
            <div className="container">
                <h2 className="section-title">Get In Touch</h2>

                <div className="contact-wrapper">
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
                            <a href="https://github.com/AntMan247" className="social-btn"><Github size={20} /></a>
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
            </div>
        </section>
    );
};

export default Contact;
