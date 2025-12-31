import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { projects } from '../data/projects';
import './AllProjectsPage.css';

const AllProjectsPage = () => {
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const categories = ['All', 'Web', 'Apps', 'Design', 'Drupal'];

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'All') return matchesSearch;

        const cat = project.category || '';
        const tags = project.tags.join(' ');

        if (filter === 'Web') return matchesSearch && (cat.includes('Web') || cat.includes('WordPress'));
        if (filter === 'Apps') return matchesSearch && (cat.includes('App') || cat.includes('Mobile') || tags.includes('React'));
        if (filter === 'Design') return matchesSearch && cat.includes('Design');
        if (filter === 'Drupal') return matchesSearch && (cat.includes('Drupal') || tags.includes('Drupal'));

        return matchesSearch;
    });

    return (
        <div className="all-projects-page">
            <div className="projects-header">
                <div className="container">
                    <Link to="/" className="back-link-simple">
                        <ArrowLeft size={20} /> Home
                    </Link>
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        Project Archive
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                    >
                        A comprehensive collection of my development and design work.
                    </motion.p>
                </div>
            </div>

            <div className="projects-controls container">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-tags">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-tag ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="projects-grid container">
                <AnimatePresence mode='popLayout'>
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            className="project-card-large"
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Link to={`/project/${project.id}`}>
                                <div className="card-image-wrapper">
                                    <img src={project.image} alt={project.title} loading="lazy" />
                                    <div className="card-overlay" style={{ background: project.color }}>
                                        <span>View Case Study</span>
                                    </div>
                                </div>
                                <div className="card-content">
                                    <span className="card-category">{project.category}</span>
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>
                                    <div className="card-tags">
                                        {project.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="mini-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="projects-footer">
                <p>{filteredProjects.length} projects displayed</p>
            </div>
        </div>
    );
};

export default AllProjectsPage;
