// Contact Section Animations
class ContactAnimations {
  constructor() {
    this.contactSection = null;
    this.contactCards = [];
    this.hasAnimated = false;
    
    this.init();
  }

  init() {
    this.contactSection = document.querySelector('#contact');
    if (!this.contactSection) return;
    
    this.contactCards = Array.from(this.contactSection.querySelectorAll('.contact-card-animate'));
    
    // Add contact-section class for CSS targeting
    this.contactSection.classList.add('contact-section');
    
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animateContactCards();
          this.hasAnimated = true;
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(this.contactSection);
    
    // Fallback: If Intersection Observer doesn't work, animate after 2 seconds
    setTimeout(() => {
      if (!this.hasAnimated) {
        console.log('Contact animations fallback triggered');
        this.animateContactCards();
        this.hasAnimated = true;
      }
    }, 2000);
  }

  animateContactCards() {
    // Animate each card with staggered delay
    this.contactCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in');
      }, index * 100);
    });

    // Add some interactive animations after cards are visible
    setTimeout(() => {
      this.addInteractiveAnimations();
    }, this.contactCards.length * 100 + 500);
  }

  addInteractiveAnimations() {
    // Add click animations to contact cards
    this.contactCards.forEach(card => {
      card.addEventListener('click', () => {
        this.triggerClickAnimation(card);
      });
    });

    // Add hover sound effects (optional)
    this.contactCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.triggerHoverEffect(card);
      });
    });
  }

  triggerClickAnimation(card) {
    // Add a quick scale animation on click
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);
  }

  triggerHoverEffect(card) {
    // Add a subtle glow effect on hover
    card.style.boxShadow = '0 20px 40px -15px rgba(12, 112, 242, 0.3)';
    setTimeout(() => {
      card.style.boxShadow = '';
    }, 300);
  }

  // Method to reset animations (useful for testing)
  resetAnimations() {
    this.hasAnimated = false;
    this.contactCards.forEach(card => {
      card.classList.remove('animate-in');
    });
  }
}

// Initialize contact animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ContactAnimations();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContactAnimations;
} 