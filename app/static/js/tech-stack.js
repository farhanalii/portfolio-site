// Enhanced Portfolio JavaScript with improved animations and functionality
document.addEventListener('DOMContentLoaded', function () {
    // Cache DOM elements for better performance
    const tabButtons = document.querySelectorAll('.tab-button');
    const skillsGrid = document.querySelector('.skills-grid');
    const skillCards = document.querySelectorAll('.skill-card');
    const statCards = document.querySelectorAll('.stat-card');
    const statNumbers = document.querySelectorAll('.stat-number');

    console.log("🚀 Portfolio initialized");
    console.log(`Found ${skillCards.length} skill cards`);
    console.log(`Found ${tabButtons.length} tab buttons`);
    console.log(`Found ${statCards.length} stat cards`);

    // Enhanced filtering with smooth animations
    function filterSkills(category) {
        console.log(`🎯 Filtering for category: ${category}`);

        let visibleCount = 0;
        const animationDelay = 50; // Stagger delay in ms

        // First, hide all cards with fade out
        skillCards.forEach((card, index) => {
            const cardCategory = card.dataset.categories;
            const shouldShow = category === 'all' || cardCategory === category;

            if (shouldShow) {
                // Show card with staggered animation
                setTimeout(() => {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.9)';

                    // Trigger reflow
                    card.offsetHeight;

                    // Animate in
                    card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';

                    visibleCount++;
                }, index * animationDelay);
            } else {
                // Hide card with fade out
                card.style.transition = 'all 0.3s ease-out';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-10px) scale(0.95)';

                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        console.log(`✅ Will show ${visibleCount} cards`);

        // Update URL hash for better UX (optional)
        if (category !== 'all') {
            window.history.replaceState(null, null, `#tech-${category}`);
        } else {
            window.history.replaceState(null, null, '#tech');
        }
    }

    // Initialize with all skills visible
    filterSkills('all');

    // Set initial active button
    tabButtons.forEach(btn => btn.classList.remove('active'));
    const allButton = document.querySelector('[data-category="all"]');
    if (allButton) {
        allButton.classList.add('active');
    }

    // Enhanced tab button handlers with loading states
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const category = button.dataset.category;

            console.log(`🔄 Tab clicked: ${category}`);

            // Prevent multiple rapid clicks
            if (button.classList.contains('loading')) return;

            // Add loading state
            button.classList.add('loading');

            // Remove active class from all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.pointerEvents = 'none';
            });

            // Add active class to clicked button
            button.classList.add('active');

            // Filter skills
            filterSkills(category);

            // Re-enable buttons after animation
            setTimeout(() => {
                tabButtons.forEach(btn => {
                    btn.classList.remove('loading');
                    btn.style.pointerEvents = 'auto';
                });
            }, 800);
        });

        // Add keyboard support
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // Enhanced counter animation with better easing
    function animateCounter(element, target) {
        if (!element || !target) return;

        const card = element.closest('.stat-card');
        card?.classList.add('counting');

        let current = 0;
        const suffix = target >= 5 ? '+' : '';
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Use easeOutCubic for smooth deceleration
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            current = Math.floor(easeProgress * target);

            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
                card?.classList.remove('counting');
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statCard = entry.target;
                const statNumber = statCard.querySelector('.stat-number');

                // Animate card entrance
                setTimeout(() => {
                    statCard.classList.add('animate-in');
                }, 100);

                // Start counter animation
                if (statNumber && !statNumber.hasAttribute('data-animated')) {
                    const target = parseInt(statNumber.dataset.target);
                    if (target && !isNaN(target)) {
                        setTimeout(() => {
                            animateCounter(statNumber, target);
                            statNumber.setAttribute('data-animated', 'true');
                        }, 500);
                    }
                }

                // Stop observing this element
                statsObserver.unobserve(statCard);
            }
        });
    }, observerOptions);

    // Observe all stat cards
    statCards.forEach(card => {
        statsObserver.observe(card);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 100; // Account for fixed header
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced skill card interactions
    skillCards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function (e) {
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
        card.addEventListener('mouseenter', function () {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function () {
            this.style.zIndex = '1';
        });
    });

    // Performance optimization: Throttle scroll events
    let scrollTimeout;
    function throttleScroll(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Add scroll-based animations for skill cards
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                skillsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    });

    // Observe skill cards for scroll animations
    skillCards.forEach(card => {
        skillsObserver.observe(card);
    });

    // Error handling for missing elements
    function handleMissingElements() {
        if (tabButtons.length === 0) {
            console.warn('⚠️ No tab buttons found');
        }
        if (skillCards.length === 0) {
            console.warn('⚠️ No skill cards found');
        }
        if (statCards.length === 0) {
            console.warn('⚠️ No stat cards found');
        }
    }

    handleMissingElements();

    // Initialize tooltips for skill cards (if needed)
    function initializeTooltips() {
        skillCards.forEach(card => {
            const skillName = card.querySelector('.skill-name')?.textContent;
            if (skillName) {
                card.setAttribute('title', `Click to learn more about ${skillName}`);
            }
        });
    }

    initializeTooltips();

    // Keyboard navigation for tabs
    let currentTabIndex = 0;
    document.addEventListener('keydown', function (e) {
        if (e.target.classList.contains('tab-button')) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const direction = e.key === 'ArrowRight' ? 1 : -1;
                currentTabIndex = (currentTabIndex + direction + tabButtons.length) % tabButtons.length;
                tabButtons[currentTabIndex].focus();
            }
        }
    });

    // Add loading states and transitions
    function showLoading(element) {
        element.style.opacity = '0.7';
        element.style.pointerEvents = 'none';
    }

    function hideLoading(element) {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }

    // Initialize category from URL hash
    function initializeFromHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#tech-')) {
            const category = hash.replace('#tech-', '');
            const button = document.querySelector(`[data-category="${category}"]`);
            if (button) {
                button.click();
            }
        }
    }

    // Initialize from hash after a short delay
    setTimeout(initializeFromHash, 100);

    // Performance monitoring
    if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark('portfolio-js-end');
        performance.measure('portfolio-js-init', 'portfolio-js-start', 'portfolio-js-end');
    }

    console.log('✅ Portfolio JavaScript initialization complete');
});

// Mark performance start
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('portfolio-js-start');
}

// Add global error handling
window.addEventListener('error', function (e) {
    console.error('Portfolio JavaScript Error:', e.error);
});

// Add global styles for dynamic elements
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .skill-card.animate-in {
        animation: skillCardEnter 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    @keyframes skillCardEnter {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .tab-button.loading {
        position: relative;
        overflow: hidden;
    }
    
    .tab-button.loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: loading-shimmer 1s infinite;
    }
    
    @keyframes loading-shimmer {
        to {
            left: 100%;
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .skill-card,
        .stat-card,
        .tab-button {
            animation: none !important;
            transition: none !important;
        }
        
        .floating-animation,
        .skill-card:nth-child(6n+1),
        .skill-card:nth-child(6n+2),
        .skill-card:nth-child(6n+3),
        .skill-card:nth-child(6n+4),
        .skill-card:nth-child(6n+5),
        .skill-card:nth-child(6n) {
            animation: none !important;
        }
    }
`;

document.head.appendChild(dynamicStyles);