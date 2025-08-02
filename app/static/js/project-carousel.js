// Project Carousel JavaScript
class ProjectCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = [];
    this.indicators = [];
    this.isAutoPlaying = true;
    this.autoPlayInterval = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }

  init() {
    this.carouselTrack = document.getElementById('carouselTrack');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.indicatorsContainer = document.getElementById('carouselIndicators');
    
    if (!this.carouselTrack) return;
    
    this.slides = Array.from(this.carouselTrack.querySelectorAll('.carousel-slide'));
    this.totalSlides = this.slides.length;
    
    if (this.totalSlides === 0) return;
    
    this.createIndicators();
    this.setupEventListeners();
    this.updateSlides();
    this.startAutoPlay();
  }

  createIndicators() {
    this.indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < this.totalSlides; i++) {
      const indicator = document.createElement('div');
      indicator.className = 'carousel-indicator';
      indicator.addEventListener('click', () => this.goToSlide(i));
      this.indicators.push(indicator);
      this.indicatorsContainer.appendChild(indicator);
    }
  }

  setupEventListeners() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });

    // Touch/swipe support
    this.carouselTrack.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    });

    this.carouselTrack.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });

    // Pause auto-play on hover
    this.carouselTrack.addEventListener('mouseenter', () => {
      this.pauseAutoPlay();
    });

    this.carouselTrack.addEventListener('mouseleave', () => {
      this.startAutoPlay();
    });

    // Intersection Observer for auto-play when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startAutoPlay();
        } else {
          this.pauseAutoPlay();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(this.carouselTrack);
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  updateSlides() {
    this.slides.forEach((slide, index) => {
      slide.classList.remove('active', 'prev', 'next');
      
      if (index === this.currentSlide) {
        slide.classList.add('active');
      } else if (index === this.getPrevIndex()) {
        slide.classList.add('prev');
      } else if (index === this.getNextIndex()) {
        slide.classList.add('next');
      }
    });

    this.updateIndicators();
    this.updateButtons();
  }

  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentSlide);
    });
  }

  updateButtons() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentSlide === 0;
    }
    
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }
  }

  getPrevIndex() {
    return this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
  }

  getNextIndex() {
    return this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
  }

  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;
    
    // Add sliding animation classes
    const currentSlide = this.slides[this.currentSlide];
    const targetSlide = this.slides[index];
    
    if (index > this.currentSlide) {
      currentSlide.classList.add('sliding-out');
      targetSlide.classList.add('sliding-in');
    } else if (index < this.currentSlide) {
      currentSlide.classList.add('sliding-out');
      targetSlide.classList.add('sliding-in');
    }
    
    this.currentSlide = index;
    
    // Remove animation classes after animation completes
    setTimeout(() => {
      currentSlide.classList.remove('sliding-out');
      targetSlide.classList.remove('sliding-in');
      this.updateSlides();
    }, 500);
  }

  nextSlide() {
    this.goToSlide(this.getNextIndex());
  }

  prevSlide() {
    this.goToSlide(this.getPrevIndex());
  }

  startAutoPlay() {
    if (this.autoPlayInterval) return;
    
    this.autoPlayInterval = setInterval(() => {
      if (this.isAutoPlaying) {
        this.nextSlide();
      }
    }, 5000); // Change slide every 5 seconds
  }

  pauseAutoPlay() {
    this.isAutoPlaying = false;
  }

  resumeAutoPlay() {
    this.isAutoPlaying = true;
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProjectCarousel();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProjectCarousel;
} 