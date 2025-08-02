// Simple Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    
    // Add click handlers
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            if (!href) return;
            
            // Handle "back to top" links
            if (href === '#') {
                // Force page reload to top
                window.location.reload();
                return;
            }
            
            const targetId = href.substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                // Try multiple scroll methods
                try {
                    // Method 1: scrollIntoView
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Method 2: Manual scroll with offset
                    setTimeout(() => {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }, 100);
                    
                } catch (error) {
                    console.warn('Scroll error:', error);
                    // Fallback: instant scroll
                    window.scrollTo(0, targetPosition);
                }
                
                window.history.pushState(null, null, href);
            } else {
                console.warn('Target not found:', targetId);
            }
        });
    });
    
    // Mobile menu toggle
    const mobileBtn = document.querySelector('button.md\\:hidden');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', function() {
            const isOpen = mobileMenu.classList.contains('translate-y-0');
            
            if (isOpen) {
                mobileMenu.classList.remove('translate-y-0');
                mobileMenu.classList.add('-translate-y-full');
            } else {
                mobileMenu.classList.remove('-translate-y-full');
                mobileMenu.classList.add('translate-y-0');
            }
        });
        
        // Close mobile menu when clicking links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('translate-y-0');
                mobileMenu.classList.add('-translate-y-full');
            });
        });
    }
    
    // Special handler for MF logo link - SIMPLE RELOAD
    const mfLogo = document.querySelector('a[href="#"]');
    if (mfLogo && mfLogo.textContent.trim() === 'MF') {
        
        // Remove any existing click handlers
        mfLogo.removeEventListener('click', mfLogoClickHandler);
        
        // Add new click handler
        mfLogo.addEventListener('click', mfLogoClickHandler);
        
        function mfLogoClickHandler(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Force page reload to go back to top
            window.location.reload();
        }
    }
}); 