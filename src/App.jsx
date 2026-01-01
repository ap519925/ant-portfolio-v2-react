import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LanguageProvider } from './components/LanguageContext';
import Loader from './components/Loader';
import ThemeBall from './components/ThemeBall';
import LiveChat from './components/LiveChat';

// Lazy loading route components for performance
const Home = React.lazy(() => import('./components/Home'));
const ProjectPage = React.lazy(() => import('./components/ProjectPage'));
const AllProjectsPage = React.lazy(() => import('./components/AllProjectsPage'));
const Gallery3D = React.lazy(() => import('./components/Gallery3D'));
const ExperienceSelector = React.lazy(() => import('./components/ExperienceSelector'));

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Hidden Navbar/Footer/Chat on specific immersive routes
  const isImmersive = location.pathname === '/' || location.pathname === '/gallery';

  // Smooth scroll behavior correction for anchors
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
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
            {!isImmersive && <Navbar />}
            <main>
              <Suspense fallback={<div style={{ minHeight: '100vh' }}></div>}>
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<ExperienceSelector />} />
                    <Route path="/terminal" element={<Home />} />
                    <Route path="/projects" element={<AllProjectsPage />} />
                    <Route path="/project/:id" element={<ProjectPage />} />
                    <Route path="/gallery" element={<Gallery3D />} />
                  </Routes>
                </AnimatePresence>
              </Suspense>
            </main>
            {!isImmersive && <LiveChat />}
            {!isImmersive && <Footer />}
          </>
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
