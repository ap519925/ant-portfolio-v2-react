import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { BookOpen, Code, Terminal, User, Briefcase, Award, ChevronDown, ChevronUp } from 'lucide-react';
import './About.css';

const TimelineItem = ({ job, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            className={`timeline-item-card card ${isOpen ? 'expanded' : ''}`}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setIsOpen(!isOpen)}
            style={{ cursor: 'pointer' }}
        >
            <span className="timeline-dot"></span>

            <div className="timeline-header-content">
                <div style={{ flex: 1 }}>
                    <div className="timeline-date">{job.period}</div>
                    <h4 className="timeline-role">{job.role}</h4>
                    <h5 className="timeline-company">{job.company}</h5>
                </div>
                <div className="expand-icon">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <ul className="timeline-details">
                            {job.details.map((detail, i) => (
                                <li key={i}>{detail}</li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const About = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const workExperience = [
        {
            company: "IEEE/ComSoc",
            role: "Sr. Software Engineer (Drupal)",
            period: "03/2025 – Present",
            details: [
                "Lead architect for 30+ Drupal 10 microsites using shared multisite architecture.",
                "Automated user provisioning with custom modules, syncing Groups and Domain Access.",
                "Implemented rigorous CI/CD on Acquia Cloud; enhanced backup/recovery schedules.",
                "Leveraged AI (Gemini) for code reviews and developed custom SEO modules."
            ]
        },
        {
            company: "Jacobs Solutions (Massport)",
            role: "Sr. Software Engineer (Drupal)",
            period: "02/2024 – 03/2025",
            details: [
                "Engineered React flight tracker with real-time API integration.",
                "Reduced API overhead by 60% by rewriting legacy bus locator apps in React/Drupal.",
                "Standardized GitHub workflows and implemented Playwright automated testing (40% bug reduction)."
            ]
        },
        {
            company: "The Intrepid Museum",
            role: "Front-end Developer (Drupal)",
            period: "06/2023 – 01/2024",
            details: [
                "Led frontend development for a brand-new Drupal 10 site, ensuring sub-second load times.",
                "Built React apps for ticket purchasing and interactive maps.",
                "Seamlessly migrated legacy Drupal 7 content to D10 using custom Migrate API scripts."
            ]
        },
        {
            company: "Bearishbulls Trading Group",
            role: "Full-Stack Developer",
            period: "09/2019 – 06/2023",
            details: [
                "Built a PWA for real-time market data and trade signals using WordPress/AngularJS.",
                "Integrated AWS Lambda for asynchronous financial API processing."
            ]
        },
        {
            company: "United Nations (DESA & UNAOC)",
            role: "Full-Stack Consultant",
            period: "04/2018 – 09/2019",
            details: [
                "Developed Drupal 8 and WordPress sites for global forums.",
                "Implemented AWS SES for dashboard notifications and React Native mobile apps."
            ]
        },
        {
            company: "The New School",
            role: "Web Services Manager",
            period: "08/2016 – 03/2018",
            details: [
                "Managed Drupal 8 initiative for Libraries; deployed Red Hat virtual servers on AWS EC2."
            ]
        },
        {
            company: "BlueDrop Solutions LLC",
            role: "Principal Development Consulting",
            period: "10/2017 – Present",
            details: [
                "Completed over 20 freelance projects, including WordPress websites, custom web apps, and e-commerce platforms, utilizing PHP 8.x for backend development.",
                "Provide web management services ranging from content updates to server management (VPS deployment on Debian, Ubuntu, CentOS).",
                "Drupal 11 Website redesign and migration for 14 different local labor union chapters, including CiviCRM integration and custom module development.",
                "Migration from Drupal 7 → Drupal 11, & complete theme redesign.",
                "Deployed to 14 different IBEW local chapter websites; currently setting up newly developed Drupal 11 website to also be used as a PWA so that chapter members can easily pay their dues and receive updates."
            ]
        },
        {
            company: "NY State Government",
            role: "Drupal Developer (IT Specialist 2)",
            period: "09/2013 – 06/2016",
            details: [
                "Developed themes and modules for Drupal, WordPress, and Joomla! using PHP, Javascript, HTML5, & CSS3.",
                "Conducted technical walkthroughs for various user groups on multiple Content Management Systems."
            ]
        }
    ];

    return (
        <section id="about" className="section about-section" ref={targetRef}>
            <div className="container about-container">
                {/* Left Column: Sticky Profile & Skills */}
                <div className="about-left">
                    <motion.div
                        className="sticky-wrapper"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <h2 className="section-title text-left">About Me</h2>
                        <div className="profile-card card">
                            <div className="section-header">
                                <User size={24} className="accent-text" />
                                <h3>Who I Am</h3>
                            </div>
                            <p className="bio-text">
                                I'm <span className="highlight">Anthony Phillips</span>, a Senior Full-Stack Engineer with 10+ years of experience.
                                Based in NYC, I specialize in architecting complex **Drupal** ecosystems and building high-performance **React** applications.
                                <br /><br />
                                I blend technical expertise in **PHP 8, JavaScript, and Cloud Ops** with a passion for **Financial Analysis**.
                            </p>
                        </div>

                        <div className="skills-card card">
                            <div className="section-header">
                                <Code size={24} className="accent-text" />
                                <h3>Tech Stack</h3>
                            </div>
                            <div className="tags-cloud">
                                {['Drupal 10', 'React.js', 'PHP 8', 'Node.js', 'AWS', 'Docker', 'Next.js', 'TypeScript', 'SQL'].map(skill => (
                                    <span key={skill} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Scrollable Timeline */}
                <div className="about-right">
                    <motion.div
                        className="timeline-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Briefcase size={28} className="accent-text" />
                        <h3>Professional Journey</h3>
                    </motion.div>

                    <div className="timeline-wrapper">
                        {/* Vertical Line */}
                        <motion.div
                            className="timeline-line"
                            style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
                        />

                        {workExperience.map((job, index) => (
                            <TimelineItem key={index} job={job} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
