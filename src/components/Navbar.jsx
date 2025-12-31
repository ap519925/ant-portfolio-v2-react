import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Twitter, Youtube } from 'lucide-react';
import ThemeBall from './ThemeBall';
import './Navbar.css';

import { useLanguage } from './LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dotRef = useRef(null);
  const destRef = useRef(null);
  const langDestRef = useRef(null);
  const logoContainerRef = useRef(null);

  const { t } = useLanguage();

  useEffect(() => {
    // ... scroll logic
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: t('nav.home'), href: '/#home' },
    { name: t('nav.about'), href: '/#about' },
    { name: t('nav.work'), href: '/#work' },
    { name: t('nav.contact'), href: '/#contact' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <Link to="/#home" className="logo" ref={logoContainerRef}>
            <img src="https://mtanthony.com/assets/alogo.png" alt="AP Logo" className="logo-img" />
            <div className="dot-placeholder" ref={dotRef}></div>
          </Link>

          {/* Ball transforms from dot, then splits */}
          <ThemeBall
            dotRef={dotRef}
            destRef={destRef}
            langDestRef={langDestRef}
          />

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

            {/* Destination for Language Globe */}
            <div ref={langDestRef} className="theme-toggle-placeholder lang-placeholder" style={{ marginLeft: '16px', marginRight: '2px' }} />

            {/* Destination for Theme Ball */}
            <div ref={destRef} className="theme-toggle-placeholder theme-placeholder" style={{ marginLeft: '2px' }} />

            <div className="social-links-mobile">
              <a href="https://github.com/ap519925" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
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
