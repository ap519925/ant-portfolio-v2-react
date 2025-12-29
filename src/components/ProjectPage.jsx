import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Code, Layers } from 'lucide-react';
import { projects } from '../data/projects';
import './ProjectPage.css';

const ProjectPage = () => {
    const { id } = useParams();
    const project = projects.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!project) {
        return (
            <div className="project-not-found">
                <h2>Project not found</h2>
                <Link to="/" className="btn">Back to Home</Link>
            </div>
        );
    }

    const { content } = project;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="project-page"
        >
            <div className="project-hero" style={{ background: project.bg }}>
                <div className="container">
                    <Link to="/" className="back-link">
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
        </motion.div>
    );
};

export default ProjectPage;
