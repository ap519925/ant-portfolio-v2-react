import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Code, Layers, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '../data/projects';
import './ProjectPage.css';

const ProjectPage = () => {
    const { id } = useParams();
    const project = projects.find(p => p.id === id);

    useEffect(() => {
        // Delay scroll to top to allow transitions (like ball movement) to settle/start smoothly
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
        return () => clearTimeout(timer);
    }, [id]);

    const [selectedIndex, setSelectedIndex] = React.useState(null);

    // Keyboard Navigation for Lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedIndex === null) return;
            if (e.key === 'Escape') setSelectedIndex(null);
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex]);

    if (!project) {
        return (
            <div className="project-not-found">
                <h2>Project not found</h2>
                <Link to="/terminal" className="btn">Back to Home</Link>
            </div>
        );
    }

    const { content } = project;

    const showNext = (e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % project.gallery.length);
    };

    const showPrev = (e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="project-page"
        >
            {/* ... (Hero section remains same, verify line numbers carefully) ... */}
            {/* Actually I need to replace the imports and component start mainly, and the Lightbox logic at end. */}
            {/* But replace_file_content replaces a block. I should target the top imports first, then the Lightbox URL logic separately? Or replace whole file if manageable? */}
            {/* The file is ~170 lines. I can replace sections. */}

            <div className="project-hero" style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), var(--bg-primary)), url(${project.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}>
                <div className="container">
                    <Link to="/terminal" className="back-link">
                        <ArrowLeft size={20} /> Back to Work
                    </Link>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="project-header"
                    >
                        <span className="project-category-badge">{project.category}</span>
                        <h1 className="project-title-large">{project.title}</h1>
                        <p className="project-subtitle">{content?.subtitle || project.description}</p>

                        <div className="project-meta">
                            {content?.technologies && (
                                <div className="meta-item">
                                    <Code size={18} />
                                    <span>{content.technologies.slice(0, 3).join(', ')}</span>
                                </div>
                            )}
                        </div>

                        {(content?.link || project.link) && (
                            <a href={content?.link || project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary project-cta">
                                Visit Website <ExternalLink size={18} style={{ marginLeft: '8px' }} />
                            </a>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="project-content-section">
                <div className="container">
                    <div className="content-grid">
                        <div className="main-content">
                            {content?.overview && (
                                <section className="content-block">
                                    <h3>Overview</h3>
                                    <p>{content.overview}</p>
                                </section>
                            )}

                            {/* Project Gallery */}
                            {project.gallery && project.gallery.length > 0 && (
                                <section className="content-block gallery-section">
                                    <h3>Project Gallery</h3>
                                    <div className="gallery-grid">
                                        {project.gallery.map((img, index) => (
                                            <motion.div
                                                key={index}
                                                className="gallery-item"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: "-50px" }}
                                                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedIndex(index)}
                                                layoutId={`gallery-img-${index}`}
                                            >
                                                <img src={img} alt={`${project.title} screenshot ${index + 1}`} loading="lazy" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {content?.contributions && (
                                <section className="content-block">
                                    <h3>Key Contributions</h3>
                                    <ul className="contributions-list">
                                        {content.contributions.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>

                        <div className="sidebar-content">
                            <div className="tech-stack-card">
                                <h3><Layers size={20} /> Tech Stack</h3>
                                <div className="tech-tags">
                                    {content?.technologies ? (
                                        content.technologies.map(tech => (
                                            <span key={tech} className="tech-tag">{tech}</span>
                                        ))
                                    ) : (
                                        project.tags.map(tag => (
                                            <span key={tag} className="tech-tag">{tag}</span>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        className="lightbox-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedIndex(null)}
                    >
                        <motion.button className="lightbox-close" onClick={() => setSelectedIndex(null)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <X size={32} />
                        </motion.button>

                        <motion.button className="lightbox-nav prev" onClick={showPrev} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <ChevronLeft size={40} />
                        </motion.button>

                        <motion.img
                            key={selectedIndex} // Key change triggers animation
                            src={project.gallery[selectedIndex]}
                            alt="Full size"
                            className="lightbox-img"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        />

                        <motion.button className="lightbox-nav next" onClick={showNext} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <ChevronRight size={40} />
                        </motion.button>

                        <div className="lightbox-counter">
                            {selectedIndex + 1} / {project.gallery.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProjectPage;
