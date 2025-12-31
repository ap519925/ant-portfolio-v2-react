import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { ExternalLink, Folder, ArrowRight, Globe, Smartphone, Github, Monitor } from 'lucide-react';
import { projects } from '../data/projects'; // Import data
import './Work.css';

const Work = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = [
        { name: 'All', icon: Folder },
        { name: 'Web', icon: Globe },
        { name: 'Apps', icon: Smartphone },
        { name: 'Design', icon: Monitor }
    ];

    // Filter projects based on active category
    const filteredProjects = projects.filter(project => {
        if (activeCategory === 'All') return true;

        const cat = project.category || '';
        if (activeCategory === 'Web') {
            return cat.includes('Web') || cat.includes('Drupal') || cat.includes('WordPress');
        }
        if (activeCategory === 'Apps') {
            return cat.includes('App') || cat.includes('AI') || cat.includes('Crypto') || cat.includes('Mobile') || project.tags.includes('App');
        }
        if (activeCategory === 'Design') {
            return cat.includes('Design');
        }
        return false;
    });

    return (
        <section id="work" className="section work-section">
            <div className="container">
                <h2 className="section-title">Selected Work</h2>

                {/* Category Filter */}
                <div className="category-filter">
                    {categories.map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            className={`category-btn ${activeCategory === name ? 'active' : ''}`}
                            onClick={() => setActiveCategory(name)}
                        >
                            <Icon size={18} />
                            <span>{name}</span>
                        </button>
                    ))}
                </div>

                <div className="section-fluid-main">
                    <div className="section-row">
                        {filteredProjects.map((project) => (
                            <React.Fragment key={project.id}>
                                <div className="section-col" style={{ '--project-color': project.color }}>
                                    <Link to={`/project/${project.id}`} className="section-link">
                                        <div className="section-in">
                                            <img src={project.image} alt={project.title} />
                                            {/* Colorful Overlay */}
                                            <div className="project-overlay"></div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="hover-text">
                                    <h2>{project.title}</h2>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="view-more" style={{ marginTop: '50px', textAlign: 'center' }}>
                    <Link to="/projects" className="btn">View All Projects</Link>
                </div>
            </div>
        </section>
    );
};

export default Work;
