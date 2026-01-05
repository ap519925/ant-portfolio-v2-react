import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { BookOpen, Code, Terminal, User, Briefcase, Award, ChevronDown, ChevronUp } from 'lucide-react';
import './About.css';

const calculateDuration = (period) => {
    if (!period) return "";
    // Handle simple year-only cases or existing strings
    if (!period.includes('–')) return "";

    const [startStr, endStr] = period.split(' – ');
    if (!startStr) return "";

    const parseDate = (str) => {
        const s = str.trim();
        if (s.toLowerCase() === 'present') return new Date();
        // Handle "MM/YYYY" or just "YYYY"
        if (s.includes('/')) {
            const [month, year] = s.split('/');
            return new Date(parseInt(year), parseInt(month) - 1);
        }
        return new Date(parseInt(s), 0); // Jan of that year
    };

    try {
        const start = parseDate(startStr);
        const end = parseDate(endStr || 'Present');

        let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        months += 1; // Inclusive count

        if (months < 0) return "";

        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let duration = "";
        if (years > 0) duration += `${years} yr${years > 1 ? 's' : ''} `;
        if (remainingMonths > 0) duration += `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;

        return duration.trim();
    } catch (e) {
        return "";
    }
};

const TimelineItem = ({ job, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    const duration = calculateDuration(job.period);

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
                    <div className="timeline-date">
                        {job.period}
                        {duration && <span style={{ opacity: 0.7, fontSize: '0.85em', marginLeft: '10px', fontStyle: 'italic' }}>• {duration}</span>}
                    </div>
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
                        {job.skills && (
                            <div className="timeline-skills" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {job.skills.map((skill, i) => (
                                    <span key={i} style={{
                                        fontSize: '0.75rem',
                                        padding: '4px 10px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: '#e2e8f0',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
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
            period: "07/2025 – Present",
            details: [
                "Lead architect for 30+ Drupal 10 microsites using shared multisite architecture.",
                "Automated user provisioning with custom modules, syncing Groups and Domain Access.",
                "Implemented rigorous CI/CD on Acquia Cloud; enhanced backup/recovery schedules.",
                "Leveraged AI (Gemini) for code reviews and developed custom SEO modules."
            ],
            skills: ["Drupal 10", "Multisite", "CI/CD", "Gemini AI", "SEO"]
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
            ],
            skills: ["PHP 8", "WordPress", "Drupal 11", "VPS", "CiviCRM"]
        },
        {
            company: "Jacobs Solutions (Massport)",
            role: "Sr. Software Engineer (Drupal)",
            period: "02/2024 – 05/2025",
            details: [
                "Engineered complex React flight tracker with real-time API integration for flight status updates.",
                "Reduced API overhead by 60% by rewriting legacy bus locator apps in React/Drupal.",
                "Standardized GitHub workflows and implemented Playwright automated testing (40% bug reduction).",
                "Optimized performance using Datadog/Imperva; streamlined deployments via GitHub Actions and Acquia Cloud."
            ],
            skills: ["React.js", "Drupal", "Playwright", "GitHub Actions", "APIs"]
        },
        {
            company: "The Intrepid Museum",
            role: "Front-end Developer (Drupal)",
            period: "01/2023 – 01/2024",
            details: [
                "Led frontend development for a brand-new Drupal 10 site, ensuring sub-second load times.",
                "Built React apps for ticket purchasing and interactive maps.",
                "Seamlessly migrated legacy Drupal 7 content to D10 using custom Migrate API scripts."
            ],
            skills: ["Drupal 10", "React.js", "Migrate API", "Frontend"]
        },
        {
            company: "Bearishbulls Trading Group",
            role: "Full-Stack Developer",
            period: "09/2019 – 01/2023",
            details: [
                "Built a PWA for real-time market data and trade signals using WordPress/AngularJS.",
                "Integrated AWS Lambda for asynchronous financial API processing."
            ],
            skills: ["WordPress", "AngularJS", "AWS Lambda", "PWA"]
        },
        {
            company: "United Nations (DESA)",
            role: "Drupal Consultant",
            period: "02/2019 – 09/2019",
            details: [
                "Developed Drupal 8 sites for global forums."
            ],
            skills: ["Drupal 8"]
        },
        {
            company: "United Nations (UNAOC)",
            role: "Full-Stack Consultant (WordPress & React Native)",
            period: "04/2018 – 12/2018",
            details: [
                "Developed custom WordPress themes & Plugins using: PHP, JS, HTML5, CSS3, & SASS for the global forum.",
                "Designed & assisted in development of a native mobile application for UNAOC’s 8th global forum.",
                "Used the Adobe Creative Suite to design 8th Global Forum promo material for both print and digital usage.",
                "Implemented AWS SES for dashboard notifications."
            ],
            skills: ["WordPress", "React Native", "PHP", "SASS", "Adobe Creative Suite", "Google Analytics", "SEO", "Linux"]
        },
        {
            company: "The New School",
            role: "Manager (Library Web Services - Drupal Developer)",
            period: "08/2016 – 03/2018",
            details: [
                "Served as the main developer on The New Schools Drupal 8 project.",
                "Developed themes & modules for: Drupal 8 using PHP, JS, HTML5, CSS3, TWIG and SASS.",
                "Set up multiple redhat virtual server instances per project requirements.",
                "Created development (Github/git) and publishing workflows for Drupal8.",
                "Used Drupal Console and Drush to manage all instances both VM and local."
            ],
            skills: ["Drupal 8", "PHP", "Git", "SASS", "Linux", "Red Hat", "Drush"]
        },
        {
            company: "NYS Office of the State Comptroller",
            role: "IT Specialist II - Drupal Developer",
            period: "03/2015 – 06/2016",
            details: [
                "Developed themes & modules for Drupal, WordPress, and Joomla! using PHP, JS, HTML5, CSS3 & SASS.",
                "Maintained CSS styling, content, and functionality (PHP, JS) of web pages per request.",
                "Created and ran scans using Hi Software’s Compliance Sheriff.",
                "Conducted technical walkthroughs for user groups on different Content Management Systems.",
                "Collaborated with users/analysts to gather requirements for functional design.",
                "Created statistic reports using Google Analytics and Tag Manager."
            ],
            skills: ["PHP", "Google Analytics", "Compliance Sheriff", "SASS", "Drupal", "WordPress", "Joomla"]
        },
        {
            company: "NYS Statewide Financial System",
            role: "IT Specialist I - QA Analyst",
            period: "11/2014 – 03/2015",
            details: [
                "Assisted testing team with planning, executing and documenting test scenarios.",
                "Used Oracle UPK to create training materials for all modules within SFS.",
                "Debugged SQL Queries using Oracle Developer in order to post Budgets.",
                "Attended daily ‘Live-Help Desk’ meetings to answer help desk tickets in real time.",
                "Created documentation for various processes and updated outdated documentation.",
                "Validated Test Scripts to ensure that all recorded results were accurate."
            ],
            skills: ["SQL", "Oracle UPK", "QA Testing", "Documentation"]
        },
        {
            company: "NYS Dept of Civil Service",
            role: "Web Development Intern",
            period: "09/2013 – 05/2014",
            details: [
                "Assisted in the design of the new homepage and subsequent web pages.",
                "Used HTML, CSS, JavaScript, ColdFusion, and jQuery.",
                "Helped launch the new civil service website in a timely manner."
            ],
            skills: ["ColdFusion", "PHP", "jQuery", "HTML5", "CSS3"]
        },
        {
            company: "University at Albany",
            role: "Teaching Assistant",
            period: "01/2012 – 05/2014",
            details: [
                "Teaching assistant for classes: IINF100X (two times), ICSI300Z.",
                "Graded homework, exams, and projects; held weekly office hours.",
                "Aided professor in organization and curriculum creation."
            ],
            skills: ["Front-End Development", "Curriculum"]
        },
        {
            company: "Kaplan",
            role: "Campus Representative",
            period: "01/2010 – 12/2013",
            details: [
                "Promoted free practice exams/classes for Graduate school examinations (GRE, MCAT, LSAT).",
                "Organized and proctored practice grad school exams at convention centers."
            ],
            skills: ["Event Management"]
        },
        {
            company: "Ask Applications",
            role: "IT Intern",
            period: "06/2013 – 08/2013",
            details: [
                "IT Intern position at White Plains, NY office."
            ],
            skills: ["IT Support"]
        },
        {
            company: "SPORTIME Clubs",
            role: "Tennis Instructor",
            period: "06/2011 – 09/2011",
            details: [
                "Tennis Instructor."
            ],
            skills: ["Instruction"]
        }
    ];

    // Calculate Total Experience span
    const earliestStart = workExperience.reduce((earliest, job) => {
        if (!job.period || !job.period.includes('–')) return earliest;
        const [startStr] = job.period.split(' – ');
        try {
            const [month, year] = startStr.split('/');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return date < earliest ? date : earliest;
        } catch (e) { return earliest; }
    }, new Date());

    const now = new Date();
    let totalMonths = (now.getFullYear() - earliestStart.getFullYear()) * 12 + (now.getMonth() - earliestStart.getMonth());
    totalMonths += 1;
    const totalYears = Math.floor(totalMonths / 12);
    const totalRemMonths = totalMonths % 12;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const startMonthStr = monthNames[earliestStart.getMonth()];
    const dateRangeStr = `${startMonthStr} ${earliestStart.getFullYear()} – Present`;
    const totalExpString = `${totalYears} yrs ${totalRemMonths} mos`;

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

                        <div className="skills-card card">
                            <div className="section-header">
                                <BookOpen size={24} className="accent-text" />
                                <h3>Education</h3>
                            </div>
                            <div className="education-timeline">
                                {[
                                    {
                                        company: "University at Albany, SUNY",
                                        role: "Graduate Coursework",
                                        period: "2014 – 2015",
                                        details: [
                                            "Major: Information Science (IT Management concentration)",
                                            "Advanced database systems and information architecture",
                                            "Project management and systems analysis"
                                        ]
                                    },
                                    {
                                        company: "University at Albany, SUNY",
                                        role: "Bachelor of Arts Computer Science",
                                        period: "2014",
                                        details: [
                                            "Major: Information & Computer Science",
                                            "Minor: Informatics",
                                            "Focus on software development, database management, and UI design"
                                        ]
                                    }
                                ].map((edu, index) => (
                                    <TimelineItem key={index} job={edu} index={index} />
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
                        style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Briefcase size={28} className="accent-text" />
                            <h3 style={{ margin: 0 }}>Professional Journey</h3>
                        </div>
                        <div style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '5px 10px',
                            borderRadius: '15px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {dateRangeStr} • <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{totalExpString}</span>
                        </div>
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
