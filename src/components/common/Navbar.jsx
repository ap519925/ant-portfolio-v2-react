import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Twitter, Youtube, Home, TrendingUp, LineChart, Video, Music } from 'lucide-react';
import ThemeBall from './ThemeBall';
import './Navbar.css';

import { useLanguage } from '../../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dotRef = useRef(null);
  const destRef = useRef(null);
  const langDestRef = useRef(null);
  const logoContainerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { t } = useLanguage();

  // Check if we're on the terminal route
  const isTerminalRoute = location.pathname === '/terminal';

  useEffect(() => {
    // ... scroll logic
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Adjust nav links based on current route
  const basePath = isTerminalRoute ? '/terminal' : '/';
  const navLinks = [
    { name: t('nav.home'), href: `${basePath}#home` },
    { name: t('nav.about'), href: `${basePath}#about` },
    { name: t('nav.work'), href: `${basePath}#work` },
    { name: t('nav.contact'), href: `${basePath}#contact` },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <Link to={`${basePath}#home`} className="logo" ref={logoContainerRef}>
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
            {/* Back to Selection Button */}
            {isTerminalRoute && (
              <button
                onClick={() => navigate('/')}
                className="nav-link back-to-selection"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <Home size={18} />
                Selection
              </button>
            )}

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

            {/* Social Icons (Desktop) */}
            <div className="nav-socials" style={{ display: 'flex', gap: '15px', marginLeft: '20px', alignItems: 'center' }}>
              <a href="https://github.com/ap519925" target="_blank" rel="noopener noreferrer" className="nav-social-link"><Github size={20} /></a>
              <a href="https://www.linkedin.com/in/anthony-phillips-dev/" target="_blank" rel="noopener noreferrer" className="nav-social-link"><Linkedin size={20} /></a>
              <a href="https://x.com/bearish_bulls" target="_blank" rel="noopener noreferrer" className="nav-social-link"><Twitter size={20} /></a>
              <a href="https://www.youtube.com/@jpowbrrrrrr" target="_blank" rel="noopener noreferrer" className="nav-social-link"><Youtube size={20} /></a>
              <a href="https://stocktwits.com/DONALD_CRUMP" target="_blank" rel="noopener noreferrer" className="nav-social-link" title="StockTwits"><TrendingUp size={20} /></a>
              <a href="https://www.tradingview.com/u/DONALD-CRUMP/" target="_blank" rel="noopener noreferrer" className="nav-social-link" title="TradingView"><LineChart size={20} /></a>
              <a href="https://www.tiktok.com/@antman1660" target="_blank" rel="noopener noreferrer" className="nav-social-link" title="TikTok"><Video size={20} /></a>
              <a href="https://open.spotify.com/playlist/3GWBkCGdj8G3iQ3we1DKwu" target="_blank" rel="noopener noreferrer" className="nav-social-link" title="Spotify"><Music size={20} /></a>
            </div>

            {/* Social Icons (Mobile Menu) */}
            <div className="social-links-mobile">
              <a href="https://github.com/ap519925" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
              <a href="https://www.linkedin.com/in/anthony-phillips-dev/" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
              <a href="https://x.com/bearish_bulls" target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
              <a href="https://www.youtube.com/@jpowbrrrrrr" target="_blank" rel="noopener noreferrer"><Youtube size={20} /></a>
              <a href="https://stocktwits.com/DONALD_CRUMP" target="_blank" rel="noopener noreferrer"><TrendingUp size={20} /></a>
              <a href="https://www.tradingview.com/u/DONALD-CRUMP/" target="_blank" rel="noopener noreferrer"><LineChart size={20} /></a>
              <a href="https://www.tiktok.com/@antman1660" target="_blank" rel="noopener noreferrer"><Video size={20} /></a>
              <a href="https://open.spotify.com/playlist/3GWBkCGdj8G3iQ3we1DKwu" target="_blank" rel="noopener noreferrer"><Music size={20} /></a>
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
