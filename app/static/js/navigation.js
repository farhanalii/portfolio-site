// Simple Navigation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Navigation script loaded');
    
    // Debug: Check if mobile menu elements exist
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    console.log('Mobile menu elements:', {
        mobileBtn: mobileBtn ? 'Found' : 'Not found',
        mobileMenu: mobileMenu ? 'Found' : 'Not found'
    });
    
    // Debug: Check mobile menu structure
    if (mobileMenu) {
        const menuLinks = mobileMenu.querySelectorAll('a');
        console.log('🔍 Mobile menu structure:', {
            totalLinks: menuLinks.length,
            menuHTML: mobileMenu.innerHTML.substring(0, 200) + '...'
        });
    }
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
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileBtn && mobileMenu) {
        console.log('✅ Mobile menu elements found:', { mobileBtn, mobileMenu });
        
        // Add click event listener
        mobileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 Mobile menu button clicked');
            
            const isOpen = mobileMenu.style.display === 'block';
            console.log('📊 Menu is open:', isOpen);
            console.log('📋 Mobile menu style display:', mobileMenu.style.display);
            console.log('📋 Mobile menu classes:', mobileMenu.className);
            
            if (isOpen) {
                mobileMenu.style.display = 'none';
                mobileMenu.classList.add('hidden');
                console.log('🔒 Closing mobile menu');
            } else {
                mobileMenu.style.display = 'block';
                mobileMenu.classList.remove('hidden');
                console.log('🔓 Opening mobile menu');
                
                // Debug: Check if menu links are visible
                const menuLinks = mobileMenu.querySelectorAll('a');
                console.log('🔍 Menu links found:', menuLinks.length);
                menuLinks.forEach((link, index) => {
                    console.log(`Link ${index + 1}:`, link.textContent.trim(), link.href);
                });
            }
        });
        
        // Test click functionality
        console.log('🎯 Mobile menu button is clickable');
        mobileBtn.style.cursor = 'pointer';
        
        // Add a test function to manually show menu
        window.testMobileMenu = function() {
            console.log('🧪 Testing mobile menu manually');
            mobileMenu.style.display = 'block';
            mobileMenu.classList.remove('hidden');
            console.log('🧪 Mobile menu should now be visible');
            console.log('🧪 Mobile menu display:', mobileMenu.style.display);
        };
        
        // Log the test function
        console.log('🧪 Test function available: window.testMobileMenu()');
        
        // Close mobile menu when clicking links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Mobile link clicked, closing menu');
                mobileMenu.classList.add('hidden');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    } else {
        console.log('Mobile menu elements not found:', { mobileBtn, mobileMenu });
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