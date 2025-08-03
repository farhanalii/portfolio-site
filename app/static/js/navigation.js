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
    
    // Mobile menu toggle (using existing variables)
    
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
            console.log('📋 Mobile menu position:', mobileMenu.getBoundingClientRect());
            
            if (isOpen) {
                mobileMenu.style.display = 'none';
                mobileMenu.classList.add('hidden');
                console.log('🔒 Closing mobile menu');
            } else {
                mobileMenu.style.display = 'block';
                mobileMenu.classList.remove('hidden');
                console.log('🔓 Opening mobile menu');
                
                // Force some styles to ensure visibility
                mobileMenu.style.position = 'fixed';
                mobileMenu.style.top = '80px';
                mobileMenu.style.left = '0';
                mobileMenu.style.right = '0';
                mobileMenu.style.width = '100%';
                mobileMenu.style.minHeight = '200px';
                mobileMenu.style.zIndex = '9999';
                mobileMenu.style.backgroundColor = '#f0f0f0';
                mobileMenu.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                
                // Debug: Check if menu links are visible
                const menuLinks = mobileMenu.querySelectorAll('a');
                console.log('🔍 Menu links found:', menuLinks.length);
                menuLinks.forEach((link, index) => {
                    console.log(`Link ${index + 1}:`, link.textContent.trim(), link.href);
                });
                
                // Debug: Check menu dimensions
                setTimeout(() => {
                    const rect = mobileMenu.getBoundingClientRect();
                    console.log('📏 Menu dimensions:', {
                        width: rect.width,
                        height: rect.height,
                        top: rect.top,
                        left: rect.left,
                        visible: rect.width > 0 && rect.height > 0
                    });
                }, 100);
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
            mobileMenu.style.position = 'fixed';
            mobileMenu.style.top = '80px';
            mobileMenu.style.left = '0';
            mobileMenu.style.right = '0';
            mobileMenu.style.width = '100%';
            mobileMenu.style.minHeight = '200px';
            mobileMenu.style.zIndex = '9999';
            mobileMenu.style.backgroundColor = '#f0f0f0';
            console.log('🧪 Mobile menu should now be visible');
            console.log('🧪 Mobile menu display:', mobileMenu.style.display);
            console.log('🧪 Mobile menu position:', mobileMenu.getBoundingClientRect());
        };
        
        // Log the test function
        console.log('🧪 Test function available: window.testMobileMenu()');
        
        // Add contact section test function
        window.testContactSection = function() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                console.log('📞 Contact section found:', contactSection);
                console.log('📞 Contact section display:', contactSection.style.display);
                console.log('📞 Contact section visibility:', contactSection.style.visibility);
                console.log('📞 Contact section position:', contactSection.getBoundingClientRect());
                
                // Force show contact section
                contactSection.style.display = 'block !important';
                contactSection.style.visibility = 'visible !important';
                contactSection.style.opacity = '1 !important';
                
                console.log('📞 Contact section should now be visible');
            } else {
                console.log('❌ Contact section not found');
            }
        };
        
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