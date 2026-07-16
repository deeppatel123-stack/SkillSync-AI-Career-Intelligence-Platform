def _normalize_career_name(name, roadmaps):
    if not name:
        return ''
    if name in roadmaps:
        return name
    for key in roadmaps:
        if key.lower() == name.lower():
            return key
    for key in roadmaps:
        if key.lower() in name.lower() or name.lower() in key.lower():
            return key
    return name


def generate_roadmap(career_name, student_skills=None):
    roadmaps = {
        'Frontend Developer': {
            'title': 'Frontend Developer Learning Roadmap',
            'description': 'Master the art of building beautiful and responsive user interfaces.',
            'duration': '6-8 months',
            'phase1': {'title': 'Phase 1: Fundamentals (Month 1-2)', 'topics': [
                'HTML5 - Semantic HTML, Forms, Accessibility',
                'CSS3 - Flexbox, Grid, Animations, Responsive Design',
                'JavaScript - ES6+, DOM Manipulation, Async/Await',
                'Git & GitHub - Version Control Basics',
                'Basic Project: Build a personal portfolio website'
            ]},
            'phase2': {'title': 'Phase 2: Core Frontend (Month 3-4)', 'topics': [
                'React.js - Components, State, Props, Hooks',
                'React Router - Navigation and Routing',
                'State Management - Context API, Redux Basics',
                'CSS Frameworks - Tailwind CSS or Bootstrap',
                'REST APIs - Fetching and displaying data',
                'Project: Build a task management app'
            ]},
            'phase3': {'title': 'Phase 3: Advanced (Month 5-6)', 'topics': [
                'TypeScript - Static typing for JavaScript',
                'Testing - Jest, React Testing Library',
                'Performance Optimization - Lazy Loading, Code Splitting',
                'Webpack/Vite - Build tools and bundlers',
                'Project: Build an e-commerce frontend'
            ]},
            'phase4': {'title': 'Phase 4: Specialization (Month 7-8)', 'topics': [
                'Next.js - Server-side rendering and SSG',
                'GraphQL - API query language',
                'Progressive Web Apps (PWAs)',
                'Build a full portfolio with 3+ projects',
                'Start applying for frontend developer roles'
            ]}
        },
        'Backend Developer': {
            'title': 'Backend Developer Learning Roadmap',
            'description': 'Build scalable server-side applications and APIs.',
            'duration': '6-8 months',
            'phase1': {'title': 'Phase 1: Fundamentals (Month 1-2)', 'topics': [
                'Programming Fundamentals - Python or JavaScript',
                'Data Structures & Algorithms',
                'Git & GitHub - Version Control',
                'Basic Project: Build a CLI application'
            ]},
            'phase2': {'title': 'Phase 2: Backend Core (Month 3-4)', 'topics': [
                'Node.js with Express.js or Django REST Framework',
                'REST API Design and Development',
                'SQL Databases - PostgreSQL or MySQL',
                'NoSQL Databases - MongoDB',
                'Authentication - JWT, OAuth',
                'Project: Build a blog API'
            ]},
            'phase3': {'title': 'Phase 3: Advanced Topics (Month 5-6)', 'topics': [
                'Docker - Containerization',
                'Redis - Caching',
                'Message Queues - RabbitMQ, Kafka',
                'Testing - Unit Tests, Integration Tests',
                'Project: Build a real-time chat backend'
            ]},
            'phase4': {'title': 'Phase 4: Production Ready (Month 7-8)', 'topics': [
                'AWS/Azure/GCP - Cloud Deployment',
                'CI/CD - GitHub Actions, Jenkins',
                'Microservices Architecture',
                'System Design Basics',
                'Deploy a production-ready API'
            ]}
        },
        'Full Stack Developer': {
            'title': 'Full Stack Developer Learning Roadmap',
            'description': 'Become proficient in both frontend and backend technologies.',
            'duration': '8-12 months',
            'phase1': {'title': 'Phase 1: Web Fundamentals (Month 1-2)', 'topics': [
                'HTML5 & CSS3', 'JavaScript - ES6+, DOM, Async Programming',
                'Git & GitHub', 'Basic Project: Portfolio website'
            ]},
            'phase2': {'title': 'Phase 2: Frontend Development (Month 3-4)', 'topics': [
                'React.js - Components, Hooks, State Management',
                'Tailwind CSS or Bootstrap', 'REST APIs integration',
                'Project: Build a dashboard UI'
            ]},
            'phase3': {'title': 'Phase 3: Backend Development (Month 5-7)', 'topics': [
                'Node.js + Express.js', 'MongoDB - Database Design, CRUD Operations',
                'SQL Databases - PostgreSQL', 'Authentication & Authorization',
                'Project: Build a full stack task manager'
            ]},
            'phase4': {'title': 'Phase 4: Advanced Full Stack (Month 8-12)', 'topics': [
                'TypeScript', 'Docker & Deployment',
                'Testing (Frontend + Backend)', 'Cloud Services (AWS)',
                'Final Project: Build a complete web application'
            ]}
        },
        'AI Engineer': {
            'title': 'AI Engineer Learning Roadmap',
            'description': 'Master artificial intelligence and machine learning.',
            'duration': '10-14 months',
            'phase1': {'title': 'Phase 1: Mathematics & Programming (Month 1-3)', 'topics': [
                'Python Programming - Advanced concepts',
                'Linear Algebra - Vectors, Matrices, Eigenvalues',
                'Calculus - Derivatives, Gradients',
                'Probability & Statistics', 'NumPy & Pandas for data manipulation'
            ]},
            'phase2': {'title': 'Phase 2: Machine Learning (Month 4-6)', 'topics': [
                'Supervised Learning - Regression, Classification',
                'Unsupervised Learning - Clustering, PCA',
                'Scikit-learn - ML library', 'Model Evaluation & Validation',
                'Feature Engineering', 'Project: Build a prediction model'
            ]},
            'phase3': {'title': 'Phase 3: Deep Learning (Month 7-9)', 'topics': [
                'Neural Networks - Basics, Architecture',
                'TensorFlow or PyTorch', 'CNN - Convolutional Neural Networks',
                'RNN/LSTM - Recurrent Neural Networks',
                'NLP - Natural Language Processing',
                'Project: Image classification or text analysis'
            ]},
            'phase4': {'title': 'Phase 4: Specialization (Month 10-14)', 'topics': [
                'Computer Vision or NLP Specialization',
                'MLOps - Model Deployment',
                'Docker, Flask/FastAPI for serving models',
                'Transformer Models (BERT, GPT)',
                'Capstone Project: End-to-end AI solution'
            ]}
        },
        'Data Analyst': {
            'title': 'Data Analyst Learning Roadmap',
            'description': 'Turn data into actionable insights.',
            'duration': '4-6 months',
            'phase1': {'title': 'Phase 1: Foundations (Month 1)', 'topics': [
                'Excel - Advanced functions, Pivot Tables',
                'SQL - Queries, Joins, Aggregations',
                'Statistics Fundamentals', 'Python Basics'
            ]},
            'phase2': {'title': 'Phase 2: Data Analysis Tools (Month 2-3)', 'topics': [
                'Python - Pandas, NumPy for data analysis',
                'Data Visualization - Matplotlib, Seaborn',
                'Tableau or PowerBI', 'Project: Analyze a public dataset'
            ]},
            'phase3': {'title': 'Phase 3: Advanced Analytics (Month 4-5)', 'topics': [
                'Statistical Analysis - Hypothesis Testing', 'A/B Testing',
                'Web Scraping - BeautifulSoup, Scrapy',
                'Project: End-to-end data analysis report'
            ]},
            'phase4': {'title': 'Phase 4: Portfolio & Job Ready (Month 6)', 'topics': [
                'Build a portfolio with 3+ analysis projects',
                'SQL advanced queries and optimization',
                'Dashboard creation in Tableau/PowerBI',
                'Start applying for data analyst roles'
            ]}
        },
        'DevOps': {
            'title': 'DevOps Learning Roadmap',
            'description': 'Bridge the gap between development and operations.',
            'duration': '6-8 months',
            'phase1': {'title': 'Phase 1: Foundations (Month 1-2)', 'topics': [
                'Linux Command Line & Shell Scripting',
                'Git & GitHub - Advanced branching, workflows',
                'Networking Basics', 'Python or Go Programming'
            ]},
            'phase2': {'title': 'Phase 2: Core DevOps (Month 3-4)', 'topics': [
                'Docker - Containers, Docker Compose',
                'CI/CD - Jenkins, GitHub Actions',
                'Configuration Management - Ansible',
                'Project: CI/CD pipeline for a web app'
            ]},
            'phase3': {'title': 'Phase 3: Container Orchestration (Month 5-6)', 'topics': [
                'Kubernetes - Pods, Services, Deployments',
                'Helm - Package Manager for K8s',
                'Monitoring - Prometheus, Grafana',
                'Project: Deploy microservices on Kubernetes'
            ]},
            'phase4': {'title': 'Phase 4: Cloud & Advanced (Month 7-8)', 'topics': [
                'AWS/Azure/GCP - Cloud Services',
                'Infrastructure as Code - Terraform',
                'Security Best Practices',
                'Design and implement a complete DevOps pipeline'
            ]}
        },
        'Cloud Engineer': {
            'title': 'Cloud Engineer Learning Roadmap',
            'description': 'Design and manage cloud infrastructure.',
            'duration': '6-8 months',
            'phase1': {'title': 'Phase 1: Foundations (Month 1-2)', 'topics': [
                'Linux Administration', 'Networking - TCP/IP, DNS, Load Balancing',
                'Scripting - Python, Bash', 'Git & Version Control'
            ]},
            'phase2': {'title': 'Phase 2: Cloud Platform (Month 3-4)', 'topics': [
                'AWS - EC2, S3, RDS, Lambda, VPC',
                'Or Azure or GCP equivalent services',
                'Cloud Security - IAM, Security Groups',
                'Project: Deploy a web app on cloud'
            ]},
            'phase3': {'title': 'Phase 3: Advanced Cloud (Month 5-6)', 'topics': [
                'Terraform - Infrastructure as Code',
                'Docker & Kubernetes on Cloud',
                'Cloud Monitoring & Cost Optimization',
                'Project: Multi-tier architecture on cloud'
            ]},
            'phase4': {'title': 'Phase 4: Specialization (Month 7-8)', 'topics': [
                'AWS Solutions Architect concepts',
                'Disaster Recovery & High Availability',
                'Cloud Migration Strategies',
                'Prepare for AWS/Azure certification'
            ]}
        },
        'Cyber Security': {
            'title': 'Cyber Security Learning Roadmap',
            'description': 'Protect systems and data from cyber threats.',
            'duration': '8-12 months',
            'phase1': {'title': 'Phase 1: Foundations (Month 1-2)', 'topics': [
                'Computer Networks - OSI Model, Protocols',
                'Operating Systems - Linux, Windows Security',
                'Programming - Python, Bash Scripting',
                'Cryptography Basics'
            ]},
            'phase2': {'title': 'Phase 2: Security Fundamentals (Month 3-5)', 'topics': [
                'Network Security - Firewalls, IDS/IPS',
                'Web Application Security - OWASP Top 10',
                'Ethical Hacking & Penetration Testing',
                'Project: Capture The Flag (CTF) challenges'
            ]},
            'phase3': {'title': 'Phase 3: Advanced Security (Month 6-8)', 'topics': [
                'Incident Response & Forensics', 'Malware Analysis',
                'Cloud Security', 'Security Auditing & Compliance',
                'Project: Security audit of a web app'
            ]},
            'phase4': {'title': 'Phase 4: Specialization (Month 9-12)', 'topics': [
                'Bug Bounty Hunting', 'Certifications - CEH, OSCP',
                'Red Teaming vs Blue Teaming',
                'Build a security portfolio',
                'Start applying for security roles'
            ]}
        }
    }

    career_name = _normalize_career_name(career_name, roadmaps)
    roadmap = roadmaps.get(career_name)

    if roadmap is None:
        return {
            'error': f'Career "{career_name}" not found.',
            'available_careers': list(roadmaps.keys())
        }

    return {
        'career': career_name,
        'title': roadmap['title'],
        'description': roadmap['description'],
        'duration': roadmap['duration'],
        'phases': [
            {'name': roadmap['phase1']['title'], 'topics': roadmap['phase1']['topics']},
            {'name': roadmap['phase2']['title'], 'topics': roadmap['phase2']['topics']},
            {'name': roadmap['phase3']['title'], 'topics': roadmap['phase3']['topics']},
            {'name': roadmap['phase4']['title'], 'topics': roadmap['phase4']['topics']}
        ]
    }
