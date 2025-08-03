// Enhanced Projects Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const showMoreBtn = document.getElementById('showMoreBtn');
    const projectsGrid = document.getElementById('projectsGrid');

    console.log('🚀 Projects section initialized');
    console.log(`Found ${projectCards.length} project cards`);
    console.log(`Found ${projectFilterBtns.length} filter buttons`);

    let currentFilter = 'enterprise'; // Default to enterprise
    let showingAll = false;

    // Project filtering functionality - Smooth like tech-stack
    function filterProjects(category) {
        console.log(`🎯 Filtering projects for category: ${category}`);
        
        currentFilter = category;
        showingAll = false; // Reset show more state when filtering
        
        // Update filter button states
        projectFilterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });

        let visibleCount = 0;
        const animationDelay = 80; // Increased delay for smoother animation

        // First, fade out all cards smoothly
        projectCards.forEach((card) => {
            card.style.transition = 'all 0.3s ease-out';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-10px) scale(0.95)';
        });

        // Wait for fade out, then show filtered cards
        setTimeout(() => {
            projectCards.forEach((card, index) => {
                const cardCategories = card.dataset.categories;
                const shouldShow = category === 'all' || cardCategories === category;
                
                if (shouldShow) {
                    // Show card with staggered animation
                    setTimeout(() => {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px) scale(0.9)';

                        // Trigger reflow
                        card.offsetHeight;

                        // Animate in smoothly
                        card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';

                        visibleCount++;
                        
                        // Hide cards that should be hidden by "show more" logic
                        if (!showingAll && card.classList.contains('hidden')) {
                            card.style.display = 'none';
                        }
                    }, index * animationDelay);
                } else {
                    // Keep card hidden
                    card.style.display = 'none';
                }
            });
        }, 300); // Wait for fade out to complete

        console.log(`✅ Will show ${visibleCount} cards`);

        // Update show more button
        updateShowMoreButton();
    }

    // Show more/less functionality
    function toggleShowMore() {
        const hiddenCards = document.querySelectorAll('.project-card.hidden');
        
        if (showingAll) {
            // Hide additional cards
            hiddenCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('show');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }, index * 50);
            });
            
            showMoreBtn.innerHTML = `
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                Show More Projects
            `;
            showMoreBtn.classList.remove('showing-less');
        } else {
            // Show additional cards
            hiddenCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.display = 'block';
                    card.classList.add('show');
                }, index * 100);
            });
            
            showMoreBtn.innerHTML = `
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                Show Less
            `;
            showMoreBtn.classList.add('showing-less');
        }
        
        showingAll = !showingAll;
    }

    // Update show more button visibility
    function updateShowMoreButton() {
        const visibleCards = document.querySelectorAll('.project-card:not(.filtered-out)');
        const hiddenCards = document.querySelectorAll('.project-card.hidden:not(.filtered-out)');
        
        if (hiddenCards.length > 0) {
            showMoreBtn.style.display = 'inline-flex';
        } else {
            showMoreBtn.style.display = 'none';
        }
        
        // Reset show more state when filtering
        if (!showingAll) {
            showMoreBtn.innerHTML = `
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                Show More Projects
            `;
            showMoreBtn.classList.remove('showing-less');
        }
    }

    // Event listeners for filter buttons - Enhanced like tech-stack
    projectFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const category = btn.dataset.category;
            
            console.log(`🔄 Filter button clicked: ${category}`);

            // Prevent multiple rapid clicks
            if (btn.classList.contains('loading')) return;

            // Add loading state
            btn.classList.add('loading');

            // Remove active class from all buttons
            projectFilterBtns.forEach(btn => {
                btn.classList.remove('active');
                btn.style.pointerEvents = 'none';
            });

            // Add active class to clicked button
            btn.classList.add('active');

            // Filter projects
            filterProjects(category);

            // Re-enable buttons after animation
            setTimeout(() => {
                projectFilterBtns.forEach(btn => {
                    btn.classList.remove('loading');
                    btn.style.pointerEvents = 'auto';
                });
            }, 800);
        });

        // Add keyboard support
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });

    // Event listener for show more button
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add loading state
            showMoreBtn.classList.add('loading');
            
            // Toggle show more
            toggleShowMore();
            
            // Remove loading state
            setTimeout(() => {
                showMoreBtn.classList.remove('loading');
            }, 500);
        });
    }

    // Enhanced project card interactions
    projectCards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on links
            if (e.target.closest('.project-link')) return;
            
            const ripple = document.createElement('div');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(12, 112, 242, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                pointer-events: none;
                z-index: 1;
            `;

            card.style.position = 'relative';
            card.appendChild(ripple);

            // Animate ripple
            ripple.animate([
                { transform: 'scale(0)', opacity: 1 },
                { transform: 'scale(1)', opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => ripple.remove();
        });

        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // Intersection Observer for scroll animations
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                projectObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    });

    // Observe project cards for scroll animations
    projectCards.forEach(card => {
        projectObserver.observe(card);
    });

    // Initialize with all projects visible (don't update hash on load)
    filterProjects('all');

    // Set initial active button
    projectFilterBtns.forEach(btn => btn.classList.remove('active'));
    const allButton = document.querySelector('[data-category="all"]');
    if (allButton) {
        allButton.classList.add('active');
    }

    // Error handling
    function handleMissingElements() {
        if (projectFilterBtns.length === 0) {
            console.warn('⚠️ No project filter buttons found');
        }
        if (projectCards.length === 0) {
            console.warn('⚠️ No project cards found');
        }
        if (!showMoreBtn) {
            console.warn('⚠️ Show more button not found');
        }
    }

    handleMissingElements();

    // Performance monitoring
    if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark('projects-js-end');
        performance.measure('projects-js-init', 'projects-js-start', 'projects-js-end');
    }

    console.log('✅ Projects JavaScript initialization complete');
});

// Mark performance start
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('projects-js-start');
}

// Add global error handling
window.addEventListener('error', function(e) {
    console.error('Projects JavaScript Error:', e.error);
});

// Global function for toggling project descriptions
window.toggleProjectDescription = function(button) {
    const descriptionContainer = button.parentElement;
    const summary = descriptionContainer.querySelector('.project-summary');
    const fullDescription = descriptionContainer.querySelector('.project-full-description');
    
    if (fullDescription.classList.contains('hidden')) {
        // Show full description
        summary.classList.add('hidden');
        fullDescription.classList.remove('hidden');
        button.textContent = 'Read Less';
    } else {
        // Show summary
        summary.classList.remove('hidden');
        fullDescription.classList.add('hidden');
        button.textContent = 'Read More';
    }
};

// Project Detail Modal Data
const projectDetails = {
    'ecommerce-platform': {
        title: 'E-commerce Platform',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ8UAGSK8oi0nOFp2FptBhbXO1aqGSjxIdOAOPQQwwhQibZsGE5b6WX4d6AwA6qXAo6SG_Oe2hc7nUdS2aowd46Rbnld4HSxZHgBtttKJDFK0inEogi-uoYHuRT1Poiuim3nyfgpBFTc2Go0N10F-U4WVXlzv0weZUZDswZKJNzrLBc-LzBTVFXyyx5BPQc2p-mhWOxUrHby4bisRZkvUaKmd9dEnneXPLl7Lvj4et0vYNsK_Vl-q1faqHtBVXQO2NnksoSNEbu_1B',
        description: 'Developed a comprehensive e-commerce platform using Odoo ERP system, featuring advanced payment gateway integrations (Stripe, PayPal), automated inventory management with real-time stock tracking, customer relationship management (CRM), order processing automation, and detailed analytics dashboard.',
        features: [
            'Multi-currency support with real-time exchange rates',
            'Advanced payment gateway integrations (Stripe, PayPal)',
            'Automated inventory management with real-time tracking',
            'Customer relationship management (CRM) system',
            'Order processing automation with status tracking',
            'Detailed analytics dashboard with sales insights',
            'Tax calculation automation',
            'Third-party shipping and logistics integrations'
        ],
        tech: ['Odoo', 'Python', 'PostgreSQL', 'JavaScript', 'HTML/CSS'],
        challenges: 'The main challenge was integrating multiple payment gateways while maintaining security standards and ensuring seamless user experience. Implemented robust error handling and fallback mechanisms to ensure 99.9% uptime.',
        results: 'The platform now handles 10,000+ daily transactions with 99.9% uptime. Reduced order processing time by 60% and improved customer satisfaction scores by 40%.',
        demo: '#',
        code: '#'
    },
    'mobile-api': {
        title: 'Mobile App API',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYmpMQHBbMcH4l_PBXxe0VkGyv3hx9n1z8igSG53n3aq_OrHXm3Ms2VdpWRcnffV2ZIH9peozosFbl8KJlqABENziLpNKG7uubD-f9oiTfnr3D1uC8h0l6PwUTorIVc2Ngmy1TYsdAimBcvQtYSzvzcetOpiqIRNqG7eMrGnpZvXMKPnlOc8nGT8yFxIOa1xVu3ZQdvdBRpxp1O0cBqleLhYrdvwi2K9FVaovq_yU3w1W6_5UQ0K76eXvRkSYRf2RUjz3eITNlI8GM',
        description: 'Built a high-performance RESTful API using Flask to support a mobile application, focusing on security, scalability, and optimal response times.',
        features: [
            'RESTful API design with comprehensive documentation',
            'JWT-based authentication and authorization',
            'Rate limiting and request throttling',
            'Real-time data synchronization',
            'Push notification system',
            'File upload and media handling',
            'Comprehensive error handling and logging',
            'API versioning and backward compatibility'
        ],
        tech: ['Flask', 'Python', 'JWT', 'PostgreSQL', 'Redis'],
        challenges: 'Implementing secure authentication while maintaining fast response times was challenging. Used JWT tokens with refresh mechanisms and implemented caching strategies to achieve sub-200ms response times.',
        results: 'API now serves 50,000+ requests per minute with average response time of 150ms. Successfully scaled to support 100,000+ concurrent users.',
        demo: '#',
        code: '#'
    },
    'data-pipeline': {
        title: 'Data Pipeline System',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwWhh5SNVPtzwzvf1w_fhNQbDEDAvuTXyjo6-wQccMfteLggRvhfX3UPZmaItbQb9q27SN1JCL_M-Cx_jGhs3rejVu0x0a84WcDXfgbyJb-xe6Fixxrnee0Kej96rpF4u3h8uCKGJhu6Wuxh8Fdwf8LFg21WlIJKqfdMIrJLXdtoVx9ZLgS_Ycxsz3A-mWGPuOiX8WGZSk-CJROGRFAEltZK1VvnlHDa3JZAJJpIjmY7i_bxpj_Bxc367yQXKvF3WGd0fjj7eeEjPP',
        description: 'Designed and implemented a robust data pipeline with FastAPI to process and analyze large datasets in real-time, deployed on AWS infrastructure.',
        features: [
            'Real-time data processing and streaming',
            'Automated data validation and quality checks',
            'Scalable microservices architecture',
            'Real-time analytics and reporting',
            'Data transformation and ETL processes',
            'Error handling and retry mechanisms',
            'Monitoring and alerting system',
            'Data backup and recovery procedures'
        ],
        tech: ['FastAPI', 'Docker', 'AWS', 'Apache Kafka', 'PostgreSQL'],
        challenges: 'Handling large-scale data processing while maintaining real-time performance was complex. Implemented streaming architecture with Apache Kafka and used containerization for scalability.',
        results: 'Pipeline processes 1TB+ of data daily with 99.5% accuracy. Reduced processing time by 70% and enabled real-time analytics for business decisions.',
        demo: '#',
        code: '#'
    },
    'hr-automation': {
        title: 'HR Process Automation',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        description: 'Automated complete HR workflows including recruitment, onboarding, and performance management using Odoo and custom Python scripts.',
        features: [
            'Automated recruitment workflow management',
            'Employee onboarding automation',
            'Performance review system',
            'Leave management automation',
            'Payroll integration',
            'Employee self-service portal',
            'Compliance tracking and reporting',
            'Integration with external HR tools'
        ],
        tech: ['Odoo', 'Python', 'Automation', 'PostgreSQL', 'REST APIs'],
        challenges: 'Integrating multiple HR systems while maintaining data consistency was challenging. Built custom connectors and implemented data validation to ensure accuracy.',
        results: 'Reduced HR administrative workload by 80% and improved employee satisfaction by 60%. Automated 95% of routine HR tasks.',
        demo: '#',
        code: '#'
    },
    'microservices': {
        title: 'Microservices Architecture',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        description: 'Designed and implemented a microservices-based system using FastAPI, Docker, and Kubernetes for scalable application deployment.',
        features: [
            'Service discovery and load balancing',
            'Container orchestration with Kubernetes',
            'API gateway implementation',
            'Distributed logging and monitoring',
            'Circuit breaker pattern implementation',
            'Health checks and auto-scaling',
            'Blue-green deployment strategy',
            'Centralized configuration management'
        ],
        tech: ['FastAPI', 'Docker', 'Kubernetes', 'Redis', 'PostgreSQL'],
        challenges: 'Managing service communication and ensuring fault tolerance across multiple services was complex. Implemented circuit breakers and distributed tracing.',
        results: 'Achieved 99.9% uptime with ability to handle 10x traffic spikes. Reduced deployment time from hours to minutes.',
        demo: '#',
        code: '#'
    },
    'analytics-dashboard': {
        title: 'Business Analytics Dashboard',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
        description: 'Built a comprehensive analytics dashboard using Flask, PostgreSQL, and modern frontend technologies for real-time business insights.',
        features: [
            'Real-time data visualization',
            'Interactive charts and graphs',
            'Custom report generation',
            'Data export functionality',
            'User role-based access control',
            'Automated data refresh',
            'Mobile-responsive design',
            'Integration with multiple data sources'
        ],
        tech: ['Flask', 'PostgreSQL', 'Chart.js', 'JavaScript', 'HTML/CSS'],
        challenges: 'Creating real-time visualizations while maintaining performance with large datasets was challenging. Implemented data aggregation and caching strategies.',
        results: 'Dashboard serves 500+ daily users with sub-second load times. Improved decision-making speed by 50% for business stakeholders.',
        demo: '#',
        code: '#'
    },
    'ml-processing': {
        title: 'ML Data Processing',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        description: 'Developed a machine learning pipeline for processing and analyzing large datasets using Python, Pandas, and scikit-learn.',
        features: [
            'Data preprocessing and cleaning',
            'Feature engineering automation',
            'Model training and validation',
            'Hyperparameter optimization',
            'Model deployment and monitoring',
            'A/B testing framework',
            'Performance metrics tracking',
            'Automated retraining pipelines'
        ],
        tech: ['Python', 'Pandas', 'scikit-learn', 'NumPy', 'Matplotlib'],
        challenges: 'Processing large datasets efficiently while maintaining model accuracy was challenging. Implemented data streaming and parallel processing.',
        results: 'Improved model accuracy by 25% and reduced training time by 60%. Successfully deployed 10+ production models.',
        demo: '#',
        code: '#'
    },
    'cicd-pipeline': {
        title: 'CI/CD Pipeline',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        description: 'Implemented automated CI/CD pipelines using GitHub Actions, Docker, and AWS for seamless deployment and testing.',
        features: [
            'Automated testing and quality checks',
            'Docker containerization',
            'Multi-environment deployment',
            'Rollback mechanisms',
            'Security scanning integration',
            'Performance testing automation',
            'Deployment notifications',
            'Infrastructure as Code (IaC)'
        ],
        tech: ['GitHub Actions', 'Docker', 'AWS', 'Terraform', 'Jenkins'],
        challenges: 'Ensuring consistent deployments across multiple environments while maintaining security was complex. Implemented comprehensive testing and security scanning.',
        results: 'Reduced deployment time from 2 hours to 15 minutes. Achieved 99.5% deployment success rate with zero-downtime deployments.',
        demo: '#',
        code: '#'
    }
};

// Global function for opening project details
window.openProjectDetail = function(projectId) {
    const project = projectDetails[projectId];
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }
    
    // Populate modal content
    document.getElementById('modalProjectTitle').textContent = project.title;
    document.getElementById('modalProjectImage').src = project.image;
    document.getElementById('modalProjectImage').alt = project.title;
    document.getElementById('modalProjectDescription').textContent = project.description;
    
    // Populate features
    const featuresList = document.getElementById('modalProjectFeatures');
    featuresList.innerHTML = '';
    project.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    // Populate tech stack
    const techContainer = document.getElementById('modalProjectTech');
    techContainer.innerHTML = '';
    project.tech.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = tech;
        techContainer.appendChild(tag);
    });
    
    // Populate challenges and results
    document.getElementById('modalProjectChallenges').textContent = project.challenges;
    document.getElementById('modalProjectResults').textContent = project.results;
    
    // Set links
    document.getElementById('modalProjectDemo').href = project.demo;
    document.getElementById('modalProjectCode').href = project.code;
    
    // Show modal
    const modal = document.getElementById('projectDetailModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    console.log('Project detail opened:', projectId);
};

// Global function for closing project details
window.closeProjectDetail = function() {
    const modal = document.getElementById('projectDetailModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    console.log('Project detail closed');
};

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProjectDetail();
    }
});

// Add global styles for dynamic elements
const projectStyles = document.createElement('style');
projectStyles.textContent = `
    .project-card.animate-in {
        animation: projectCardEnter 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    @keyframes projectCardEnter {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .project-filter-btn.loading {
        position: relative;
        overflow: hidden;
    }
    
    .project-filter-btn.loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: loading-shimmer 1s infinite;
    }
    
    #showMoreBtn.loading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    @keyframes loading-shimmer {
        to {
            left: 100%;
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .project-card,
        .project-filter-btn,
        #showMoreBtn {
            animation: none !important;
            transition: none !important;
        }
    }
`;

document.head.appendChild(projectStyles); 