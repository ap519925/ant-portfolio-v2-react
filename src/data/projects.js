export const projects = [
    {
        id: 'capframe',
        title: 'CapFrame',
        category: 'Desktop App / AI',
        color: '#FF4757', // Bright Red
        description: 'An electron based Desktop application that can record your screen, perform AI edits and allows for sharing clips to multiple platforms.',
        link: '#',
        image: '/assets/stock-2.jpg',
        gallery: [], // No specific gallery images defined yet
        bg: 'linear-gradient(135deg, #FF4757 0%, #2f3542 100%)',
        tags: ['Electron', 'React', 'AI', 'FFmpeg'],
        content: {
            subtitle: 'Next-Gen Screen Recording & Editing',
            overview: 'CapFrame is a powerful desktop application designed for creators. It combines high-performance screen recording with AI-powered editing features, allowing users to capture, refine, and share content seamlessly.',
            contributions: [
                'Built electron-based recorder engine',
                'Integrated AI video processing',
                'Implemented multi-platform sharing API'
            ],
            technologies: ['Electron', 'React', 'Node.js', 'FFmpeg', 'OpenAI API']
        }
    },
    {
        id: 'ibew-union',
        title: 'IBEW Union Local 90',
        category: 'Web Development',
        color: '#0056b3', // Union Blue
        description: 'A modern, accessible Drupal 11 website for the International Brotherhood of Electrical Workers.',
        link: 'https://ibewlocal90.org',
        image: '/assets/stock-1.jpg',
        gallery: [],
        bg: 'linear-gradient(135deg, #0056b3 0%, #002a80 100%)',
        tags: ['Drupal 11', 'Gov/Non-Profit', 'Accessibility'],
        content: {
            subtitle: 'Digital Transformation for Labor Union',
            overview: 'Redesigned and developed a robust Drupal 11 platform to serve union members with news, events, and resources. Focused on accessibility and ease of content management for staff.',
            contributions: [
                'Full-stack Drupal 11 development',
                'Custom theme creation using Twig/SASS',
                'Member portal integration'
            ],
            technologies: ['Drupal 11', 'PHP 8.2', 'MySQL', 'Bootstrap 5', 'SASS']
        }
    },
    {
        id: 'prk-nyc',
        title: 'PRK: NYC Parking Simplified',
        category: 'Mobile App',
        color: '#e67e22', // Orange
        description: 'A mobile application designed to simplify the parking experience in New York City.',
        link: '#',
        image: '/assets/stock-3.jpg',
        gallery: [],
        bg: 'linear-gradient(135deg, #e67e22 0%, #2f3542 100%)',
        tags: ['React Native', 'Google Maps', 'Node.js'],
        content: {
            subtitle: 'Find Parking Faster',
            overview: 'PRK is a mobile solution that helps NYC drivers find available street parking and garages. It uses real-time data and crowd-sourcing to save time and reduce congestion.',
            contributions: [
                'Developed cross-platform mobile app with React Native',
                'Integrated Google Maps and custom layer overlays',
                'Implemented real-time parking availability algorithm'
            ],
            technologies: ['React Native', 'Redux', 'Google Maps API', 'Firebase', 'Node.js']
        }
    },
    {
        id: 'intrepid-museum',
        title: 'Intrepid Museum',
        category: 'Web Development',
        color: '#1c1e3a', // Dark Navy
        description: 'A comprehensive web solution for the Intrepid Sea, Air & Space Museum.',
        link: 'https://mtanthony.com/work/web/intrepid',
        image: '/assets/portfolio/intrepidmuseum.jpg',
        gallery: [
            '/assets/portfolio/intrepid1.jpg',
            '/assets/portfolio/intrepid2.jpg',
            '/assets/portfolio/intrepid3.jpg',
            '/assets/portfolio/intrepid4.jpg',
            '/assets/portfolio/intrepid5.jpg'
        ],
        bg: 'linear-gradient(135deg, #1c1e3a 0%, #10101a 100%)',
        tags: ['Drupal', 'PHP', 'Frontend'],
        content: {
            subtitle: 'Drupal Website support and feature development',
            overview: "As a Drupal Developer for the Intrepid Museum, I helped maintain and enhance their digital presence, focusing on user experience and content accessibility.",
            contributions: [
                "Maintained and updated the main museum website",
                "Implemented new features for exhibition displays",
                "Optimized performance for high-traffic events"
            ],
            technologies: ["Drupal", "PHP", "SASS", "JavaScript", "jQuery"]
        }
    },
    {
        id: 'massport',
        title: 'Massport',
        category: 'Web Development',
        color: '#2a1f2d', // Deep Purple/Brown
        description: 'Corporate website for the Massachusetts Port Authority.',
        link: 'https://mtanthony.com/work/web/massport',
        image: '/assets/portfolio/massport_front.jpg',
        gallery: [
            '/assets/portfolio/massport_1.png',
            '/assets/portfolio/massport_2.png',
            '/assets/portfolio/massport_4.jpg',
            '/assets/portfolio/massport_5.jpg'
        ],
        bg: 'linear-gradient(135deg, #2a1f2d 0%, #10101a 100%)',
        tags: ['Development', 'Public Sector'],
        content: {
            subtitle: "Drupal Website support and feature development",
            link: "http://www.massport.com",
            overview: "As a Drupal Developer at Jacobs Solutions (Massport), I led the development and optimization of multiple Drupal 10 web properties, ensuring high performance, security, and user engagement.",
            contributions: [
                "React Application Development: Reworked a React-based flight tracker application, implementing complex logic to display real-time flight status updates (e.g., arriving early, delayed, canceled).",
                "Theming and style updates: Updated various sections of website’s theme and implemented a responsive design where needed, using Twig & PatternLab.",
                "API Integration: Rewrote a React bus locator application, integrating real-time data from multiple APIs/proxy servers, reducing API requests by 60% and generating significant cost savings.",
                "Performance Optimization: Utilized tools like Datadog, Imperva, and Google Analytics to monitor and optimize website performance, reducing unnecessary page visits and improving efficiency.",
                "Workflow Streamlining: Implemented a GitHub-based ticketing system for bug/feature requests, streamlining workflows and enabling seamless collaboration with cross-functional teams.",
                "Deployment & Maintenance: Automated deployment workflows across local, dev, staging, and production environments using GitHub Actions and Acquia Cloud."
            ],
            technologies: ["Drupal 10", "React.js", "PHP", "JavaScript", "Acquia Cloud", "GitHub", "Datadog", "Google Analytics", "Webpack", "Gulp", "SASS", "Twig", "SQL", "JSX"]
        }
    },
    {
        id: 'bearish-bulls',
        title: 'Bearish Bulls App',
        category: 'Web App',
        color: '#1f2d3a', // Slate Blue
        description: 'A trading group web application for financial analysis and community.',
        link: 'https://mtanthony.com/work/web/bearishbulls',
        image: '/assets/stock-4.jpg',
        gallery: [
            '/assets/portfolio/bbnet2.webp',
            '/assets/portfolio/bbnet3.webp',
            '/assets/portfolio/bbnet4.webp',
            '/assets/portfolio/bbnet7.webp',
            '/assets/portfolio/bbnet9.webp'
        ],
        bg: 'linear-gradient(135deg, #1f2d3a 0%, #10101a 100%)',
        tags: ['React', 'Finance', 'Dashboard'],
        content: {
            subtitle: 'Financial Community Platform',
            overview: "Built a comprehensive platform for traders to track markets, share analysis, and communicate.",
            contributions: [
                "Developed real-time charting interfaces",
                "Implemented user authentication and subscription management",
                "Integrated multiple financial data APIs"
            ],
            technologies: ["React", "Node.js", "Firebase", "TradingView API"]
        }
    },
    {
        id: 'design-works',
        title: 'Design Works',
        category: 'Design',
        color: '#3a1c36', // Moody Purple
        description: 'A collection of my creative design projects and UI/UX explorations.',
        link: 'https://mtanthony.com/work/design/design',
        image: '/assets/designimg/IM.png',
        gallery: [
            '/assets/designimg/IM.png',
            '/assets/designimg/PHILLIPS.png',
            '/assets/designimg/advertkl.png',
            '/assets/designimg/bearishbulls.png',
            '/assets/designimg/dcrump.png',
            '/assets/designimg/klshop.png'
        ],
        bg: 'linear-gradient(135deg, #3a1c36 0%, #10101a 100%)',
        tags: ['UI/UX', 'Graphics', 'Creative'],
        content: {
            subtitle: 'Creative Design Portfolio',
            overview: "A showcase of various design projects spanning web, mobile, and print media.",
            contributions: [
                "UI/UX Design for web applications",
                "Brand identity creation",
                "Marketing material design"
            ],
            technologies: ["Figma", "Adobe CC", "Sketch", "Prototyping"]
        }
    },
    {
        id: 'unaoc',
        title: 'UNAOC',
        category: 'Web Development',
        color: '#1c3a38', // Deep Teal
        description: 'App and Website for the United Nations Alliance of Civilizations.',
        link: 'https://mtanthony.com/work/web/unaoc',
        image: '/assets/unaocapp.webp',
        gallery: [
            '/assets/portfolio/unaocdes1.png',
            '/assets/portfolio/unaocweb2.png',
            '/assets/portfolio/unaocweb3.png',
            '/assets/portfolio/unaocdes3.png',
            '/assets/portfolio/unaocweb4.png',
            '/assets/portfolio/unaocdes5.png'
        ],
        bg: 'linear-gradient(135deg, #1c3a38 0%, #10101a 100%)',
        tags: ['International', 'App', 'Web'],
        content: {
            subtitle: 'United Nations Alliance of Civilizations',
            overview: "Developed digital solutions for UNAOC initiatives.",
            contributions: [
                "Website maintenance and feature updates",
                "Mobile application support",
                "Multilingual content management"
            ],
            technologies: ["Drupal", "Mobile Frameworks", "PHP", "MySQL"]
        }
    },
    {
        id: 'unbank-world',
        title: 'Unbank.world',
        category: 'Crypto',
        color: '#3a2e1c', // Bronze/Gold
        description: 'Bitcoin ATM locator and cryptocurrency information platform.',
        link: 'https://mtanthony.com/work/web/unbankworld',
        image: '/assets/stock-3.jpg',
        gallery: [
            '/assets/unbank.png',
            '/assets/unbank2.png'
        ],
        bg: 'linear-gradient(135deg, #3a2e1c 0%, #10101a 100%)',
        tags: ['Crypto', 'Bitcoin', 'Maps'],
        content: {
            subtitle: 'Crypto ATM Locator',
            overview: "A map-based application for finding Bitcoin ATMs worldwide.",
            contributions: [
                "Google Maps API integration",
                "Location based services",
                "Cryptocurrency data aggregation"
            ],
            technologies: ["Google Maps API", "React", "Node.js", "MongoDB"]
        }
    },
    {
        id: 'ieee-comsoc',
        title: 'IEEE/ComSoc',
        category: 'Web Development',
        color: '#00629B', // IEEE Blue
        description: 'Development and maintenance of the IEEE Communications Society website and related microsites.',
        link: 'https://www.comsoc.org',
        image: '/assets/ieee-comsoc.png',
        gallery: ['/assets/ieee-comsoc.png'],
        bg: 'linear-gradient(135deg, #00629B 0%, #10101a 100%)',
        tags: ['Drupal', 'PHP', 'Solr', 'SASS'],
        content: {
            subtitle: 'IEEE Communications Society',
            overview: "Lead developer for the IEEE Communications Society, managing their high-traffic Drupal ecosystem. Responsible for feature development, security updates, and performance optimization.",
            contributions: [
                "Full stack Drupal development",
                "Solr search configuration and customization",
                "Microsite architecture and deployment",
                "Custom module development"
            ],
            technologies: ["Drupal 9/10", "PHP", "Solr", "Redis", "Pantheon", "Git"]
        }
    },
    {
        id: 'my-english-name',
        title: 'My English Name',
        category: 'Web App',
        color: '#FF512F', // Vivid Orange
        description: 'A web app that gives international students English names based on their traits.',
        link: 'http://www.myengname.com',
        image: '/assets/myengname.webp',
        gallery: [
            '/assets/portfolio/myengname.png',
            '/assets/portfolio/myengname2.png',
            '/assets/portfolio/myengnamemobile.webp'
        ],
        bg: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
        tags: ['PHP', 'Web App', 'Bootstrap'],
        content: {
            subtitle: 'Name Generator Web Application',
            overview: "Designed and developed a web app that uses JS and PHP to take user information such as: name, DOB, country of interest & traits in order to give them an english name based on the information they entered and questions they answered.",
            contributions: [
                "Developed the name generation algorithm in PHP",
                "Implemented responsive design with Bootstrap",
                "Integrated large names database"
            ],
            technologies: ["PHP", "JavaScript", "CSS3", "HTML5", "Bootstrap"]
        }
    },
    {
        id: 'newschool-libraries',
        title: 'Newschool Libraries',
        category: 'Web Development',
        color: '#C33764', // Pink/Red
        description: 'Designed and developed Drupal website for Newschool Libraries.',
        link: 'https://library.newschool.edu/',
        image: '/assets/newschoollogo.png',
        gallery: [
            '/assets/portfolio/newschool1.jpg',
            '/assets/portfolio/newschool2.jpg',
            '/assets/portfolio/newschool3.jpg',
            '/assets/portfolio/newschool4.jpg'
        ],
        bg: 'linear-gradient(135deg, #C33764 0%, #1D2671 100%)',
        tags: ['Drupal', 'Education', 'Library Systems'],
        content: {
            subtitle: 'Library Content Management System',
            overview: "As the Web Services Manager at The New School libraries, I led the development, design, and maintenance of a brand new drupal website.",
            contributions: [
                "Developed custom Drupal 8 themes and modules",
                "Managed Red Hat virtual server instances",
                "Created workflow documentation for staff"
            ],
            technologies: ["Drupal 8", "Redhat", "PHP", "JavaScript", "SASS", "Twig"]
        }
    },
    {
        id: 'pottery-place',
        title: 'The Pottery Place',
        category: 'Web Development',
        color: '#11998e', // Green
        description: 'Designed WP website for a family-run pottery studio.',
        link: 'http://www.thepotteryplace.com',
        image: '/assets/potteryplace.png',
        gallery: [
            '/assets/portfolio/potteryplace2.webp',
            '/assets/portfolio/potteryplace4.webp',
            '/assets/portfolio/potteryplace6.webp',
            '/assets/portfolio/potteryplace8.webp'
        ],
        bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        tags: ['WordPress', 'Small Business', 'Design'],
        content: {
            subtitle: 'Studio Website Redesign',
            overview: "Redesigned the website for a family-owned paint your own pottery studio in Albany NY, focusing on ease of use and visual appeal.",
            contributions: [
                "Custom WordPress theme implementation",
                "Content strategy and layout",
                "Hosting migration and setup"
            ],
            technologies: ["WordPress", "CSS3", "HTML5", "PHP"]
        }
    },
    {
        id: 'choices-counseling',
        title: 'Choices Counseling',
        category: 'Web Development',
        color: '#f12711', // Bright Orange/Red
        description: 'Custom WordPress theme and plugin development.',
        link: 'https://choicesconsulting.com/',
        image: '/assets/choicesconsulting.webp',
        gallery: [
            '/assets/choicesconsulting.webp',
            '/assets/choiceslogo.webp'
        ],
        bg: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
        tags: ['WordPress', 'Plugin Dev', 'Consulting'],
        content: {
            subtitle: 'Professional Services Website',
            overview: "Ongoing contract work entailing development and design of custom WordPress themes and plugins, along with content updates and maintenance.",
            contributions: [
                "Developing custom WordPress themes & Plugins",
                "Updating website content",
                "Technical support and training"
            ],
            technologies: ["WordPress", "PHP", "JavaScript", "HTML5", "CSS3"]
        }
    }
];
