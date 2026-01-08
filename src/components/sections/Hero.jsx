import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Terminal from '../features/Terminal';
import './Hero.css';

const Hero = () => {
    const { t } = useLanguage();

    return (
        <div className="hero-wrapper">
            <section id="home" className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content animate-fade-in">
                        <p className="hero-greeting accent-text">{t('hero.greeting') || "Hello, I'm"}</p>
                        <h1 className="hero-name gradient-text">Anthony Phillips<span ref={(el) => window.dotRef = { current: el }}>.</span></h1>
                        <h2 className="hero-role">{t('hero.role')}</h2>
                        <p className="hero-description">
                            {t('hero.description') || "I craft stylish, high-performance digital experiences. Based in Queens, NYC, I specialize in full-stack development, technical analysis, and creating seamless user interfaces."}
                        </p>

                        <div className="hero-buttons">
                            <a href="#work" className="btn btn-primary">
                                {t('hero.cta')} <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
                            </a>
                            <a href="#contact" className="btn">
                                {t('hero.contact')}
                            </a>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <Terminal />
                    </div>
                </div>

                <a href="#about" className="scroll-indicator">
                    <span className="mouse">
                        <span className="wheel"></span>
                    </span>
                    <span className="arrow"><ChevronDown size={24} /></span>
                </a>
            </section>
        </div>
    );
};

export default Hero;
