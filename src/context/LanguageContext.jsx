import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // 'en' or 'zh'

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'zh' : 'en');
    };

    // Simple dictionary for demo purposes
    const t = (key) => {
        const translations = {
            'nav.home': { en: 'Home', zh: '首页' },
            'nav.about': { en: 'About', zh: '关于' },
            'nav.work': { en: 'Work', zh: '作品' },
            'nav.contact': { en: 'Contact', zh: '联系' },
            'hero.role': { en: 'Full-Stack Developer & Analyst', zh: '全栈开发工程师 & 分析师' },
            'hero.location': { en: 'based in New York City', zh: '坐标 纽约' },
            'hero.cta': { en: 'View My Work', zh: '查看作品' },
            'hero.contact': { en: 'Contact Me', zh: '联系我' },
            'hero.greeting': { en: "Hello, I'm", zh: "你好，我是" },
            'hero.description': {
                en: "I craft stylish, high-performance digital experiences. Based in Queens, NYC, I specialize in full-stack development, technical analysis, and creating seamless user interfaces.",
                zh: "我致力于打造时尚且高性能的数字体验。现居纽约皇后区，专注于全栈开发、技术分析以及构建流畅的用户界面。"
            },
        };
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
