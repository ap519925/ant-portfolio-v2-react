import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import ProjectPage from './components/ProjectPage';
import AllProjectsPage from './components/AllProjectsPage';
import { LanguageProvider } from './components/LanguageContext';
import Loader from './components/Loader';
import ThemeBall from './components/ThemeBall';

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Smooth scroll behavior correction for anchors
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Initial Load Timer
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Lock scroll during loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [loading]);

  return (
    <LanguageProvider>
      <div className="app">
        <AnimatePresence mode="wait">
          {loading && <Loader key="loader" finishLoading={() => setLoading(false)} />}
        </AnimatePresence>

        <div className="blob blob-top-right"></div>
        <div className="blob blob-bottom-left"></div>

        {!loading && (
          <>
            <Navbar />
            <main>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<AllProjectsPage />} />
                  <Route path="/project/:id" element={<ProjectPage />} />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
          </>
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
