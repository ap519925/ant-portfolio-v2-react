import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Twitter, Youtube } from 'lucide-react';
import ThemeBall from './ThemeBall';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dotRef = useRef(null);
  const destRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Work', href: '/#work' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <Link to="/#home" className="logo">
            <img src="https://mtanthony.com/assets/alogo.png" alt="AP Logo" className="logo-img" />
            <div className="dot-placeholder" ref={dotRef}></div>
          </Link>

          {/* Ball transforms from dot */}
          <ThemeBall dotRef={dotRef} destRef={destRef} />

          <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Destination for Theme Ball */}
            <div ref={destRef} className="theme-toggle-placeholder" />

            <div className="social-links-mobile">
              <a href="https://github.com/AntMan247" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
            </div>
          </div>

          <div className="hamburger" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
