// Main JavaScript for Kiran's Portfolio Website

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initNavigation();
  initScrollEffects();
  initIntersectionObserver();
  initProgressBar();
  initFAQFunctionality();
      
  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Navigation functionality
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
      
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
          
      // Toggle icon
      const icon = mobileMenuBtn.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // Close mobile menu when clicking on a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
  }

  // Add active class to current page navigation link
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('nav a');
      
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('text-cyan-400');
      link.classList.remove('text-white');
    }
  });
}

// Scroll effects
function initScrollEffects() {
  let lastScrollTop = 0;
  const nav = document.querySelector('nav');
      
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
    // Hide/show navigation on scroll
    if (nav) {
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        nav.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up
        nav.style.transform = 'translateY(0)';
      }
    }
        
    lastScrollTop = scrollTop;
        
    // Update progress bar
    updateProgressBar();
  });
}

// Intersection Observer for fade-in animations
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  // Observe all sections for fade-in effect
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
  });

  // Observe project cards
  document.querySelectorAll('.card-hover').forEach(card => {
    card.classList.add('fade-in-section');
    observer.observe(card);
  });
}

// Progress bar functionality
function initProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  document.body.appendChild(progressBar);
}

function updateProgressBar() {
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }
}

// FAQ functionality
function initFAQFunctionality() {
  // FAQ toggle function will be available globally
  window.toggleFAQ = function(index) {
    const content = document.getElementById(`faq-content-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
        
    if (content && icon) {
      content.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');
    }
  };
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Smooth scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Add scroll to top button
function addScrollToTopButton() {
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  scrollBtn.className = 'fixed bottom-8 right-8 bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:bg-cyan-600 transition-all z-50 opacity-0 pointer-events-none';
  scrollBtn.id = 'scroll-to-top';
      
  scrollBtn.addEventListener('click', scrollToTop);
  document.body.appendChild(scrollBtn);
      
  // Show/hide scroll to top button
  window.addEventListener('scroll', debounce(function() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (window.pageYOffset > 300) {
      scrollBtn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      scrollBtn.classList.add('opacity-0', 'pointer-events-none');
    }
  }, 100));
}

// Initialize scroll to top button
addScrollToTopButton();

// Typing animation for hero text
function initTypingAnimation() {
  const typingElements = document.querySelectorAll('.typing-text');
      
  typingElements.forEach(element => {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid #06b6d4';
        
    let i = 0;
    const typeInterval = setInterval(() => {
      element.textContent += text[i];
      i++;
          
      if (i === text.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          element.style.borderRight = 'none';
        }, 1000);
      }
    }, 100);
  });
}

// Add loading animation
function showPageLoading() {
  const loader = document.createElement('div');
  loader.className = 'fixed inset-0 bg-gray-900 flex items-center justify-center z-50';
  loader.innerHTML = `
    <div class="text-center">
      <div class="loading-spinner mx-auto mb-4"></div>
      <p class="text-cyan-400">Loading...</p>
    </div>
  `;
  loader.id = 'page-loader';
      
  document.body.appendChild(loader);
      
  // Hide loader when page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
      }, 500);
    }, 500);
  });
}

// Initialize page loading animation
if (document.readyState === 'loading') {
  showPageLoading();
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
  // ESC key to close mobile menu
  if (e.key === 'Escape') {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      const icon = mobileMenuBtn.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  }
});

// Add focus management for accessibility
function manageFocus() {
  // Skip link functionality
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cyan-500 text-white px-4 py-2 rounded z-50';
      
  document.body.insertBefore(skipLink, document.body.firstChild);
      
  // Add main content id if not exists
  const mainContent = document.querySelector('main') || document.querySelector('section');
  if (mainContent && !mainContent.id) {
    mainContent.id = 'main-content';
    mainContent.tabIndex = -1;
  }
}

// Initialize accessibility features
manageFocus();

// Error handling for images
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.style.display = 'none';
    console.warn('Failed to load image:', this.src);
  });
});

// Console message for developers
console.log(`
🔐 Kiran Damai - Cybersecurity Portfolio
    
Thanks for checking out the code! 
This portfolio showcases cybersecurity projects and skills.
    
Built with: HTML5, CSS3, JavaScript, Node.js, MongoDB
    
Connect with me:
📧 kiran.damai@example.com
🔗 github.com/kirandamai
💼 linkedin.com/in/kirandamai
`);