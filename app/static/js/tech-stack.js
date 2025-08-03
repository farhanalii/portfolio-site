// Enhanced Tech Stack with Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Tech Stack script loading...');

    // Initialize animated tech stack
    initializeAnimatedTechStack();

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

    // Flag to prevent automatic hash changes
    let isManualNavigation = false;

    // Enhanced filtering with smooth animations
    function filterSkills(category, updateHash = false) {
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

        // Only update URL hash when explicitly requested (user clicks tab)
        if (updateHash && !isManualNavigation) {
            if (category !== 'all') {
                window.history.replaceState(null, null, `#tech-${category}`);
            } else {
                // Remove hash instead of setting to #tech
                window.history.replaceState(null, null, window.location.pathname);
            }
        }
    }

    // Initialize with languages skills visible (don't update hash on load)
    filterSkills('languages', false);

    // Set initial active button
    tabButtons.forEach(btn => btn.classList.remove('active'));
    const languagesButton = document.querySelector('[data-category="languages"]');
    if (languagesButton) {
        languagesButton.classList.add('active');
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

            // Filter skills and update hash
            filterSkills(category, true);

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

    // Navigation is now handled by navigation.js
    // This prevents conflicts with the tech stack functionality

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

    // Modified: Only initialize from hash if it's specifically a tech filter
    function initializeFromHash() {
        const hash = window.location.hash;

        // Only handle tech-specific hashes, ignore general navigation hashes
        if (hash.startsWith('#tech-')) {
            const category = hash.replace('#tech-', '');
            const button = document.querySelector(`[data-category="${category}"]`);
            if (button) {
                // Don't auto-click, just update the display
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterSkills(category, false);
            }
        }
        // Don't auto-navigate to #tech section on load
    }

    // Initialize from hash after a short delay, but only for tech filters
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

// Initialize Animated Tech Stack
function initializeAnimatedTechStack() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        // Add click effect
        item.addEventListener('click', function() {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Add pulse effect
            this.style.animation = 'techItemPulse 0.3s ease-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
            
            console.log('Tech item clicked:', this.textContent);
        });
        
        // Add hover tooltip
        item.addEventListener('mouseenter', function() {
            const tech = this.getAttribute('data-tech');
            const tooltip = document.createElement('div');
            tooltip.className = 'tech-tooltip';
            tooltip.textContent = `Click to learn more about ${tech}`;
            tooltip.style.cssText = `
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: var(--dark-blue);
                color: white;
                padding: 0.5rem 0.75rem;
                border-radius: var(--border-radius-sm);
                font-size: 0.75rem;
                white-space: nowrap;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            `;
            
            this.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);
        });
        
        item.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.tech-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    // Add CSS for ripple animation
    if (!document.querySelector('#tech-stack-styles')) {
        const style = document.createElement('style');
        style.id = 'tech-stack-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes techItemPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}