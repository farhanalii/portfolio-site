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

    let currentFilter = 'all';
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