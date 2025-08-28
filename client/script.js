// Portfolio JavaScript with API Integration
class Portfolio {
  constructor() {
    this.apiBase = '/api';
    this.initializeNavigation();
    this.initializeContactForm();
    this.loadPortfolioData();
  }

  initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton?.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Close mobile menu if open
          mobileMenu.classList.add('hidden');
        }
      });
    });

    // Active section highlighting
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('text-cyan-500', 'bg-gray-800');
            link.classList.add('text-gray-300', 'hover:text-white');
          });

          const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
          if (activeLink) {
            activeLink.classList.remove('text-gray-300', 'hover:text-white');
            activeLink.classList.add('text-cyan-500', 'bg-gray-800');
          }
        }
      });
    });
  }

  async loadPortfolioData() {
    try {
      // Load all data in parallel
      const [certifications, skills, education, projects] = await Promise.all([
        this.fetchData('/certifications'),
        this.fetchData('/skills'),
        this.fetchData('/education'),
        this.fetchData('/projects')
      ]);

      // Update counters
      this.updateCounters(certifications, projects);

      // Render sections
      this.renderEducation(education);
      this.renderSkills(skills);
      this.renderCertifications(certifications);
      this.renderProjects(projects);

    } catch (error) {
      console.error('Error loading portfolio data:', error);
      this.showErrorMessage('Failed to load portfolio data');
    }
  }

  async fetchData(endpoint) {
    const response = await fetch(`${this.apiBase}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }
    return response.json();
  }

  updateCounters(certifications, projects) {
    const certCountElement = document.getElementById('certCount');
    const projectCountElement = document.getElementById('projectCount');

    if (certCountElement) {
      this.animateCounter(certCountElement, certifications.length);
    }

    if (projectCountElement) {
      this.animateCounter(projectCountElement, projects.length);
    }
  }

  animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + '+';
    }, 50);
  }

  renderEducation(education) {
    const container = document.getElementById('educationList');
    if (!container) return;

    if (education.length === 0) {
      container.innerHTML = '<p class="text-gray-400 text-sm">No education data available</p>';
      return;
    }

    container.innerHTML = education.map(edu => `
      <div class="border-l-2 border-cyan-500 pl-4">
        <h5 class="font-semibold text-white">${edu.degree}</h5>
        <p class="text-sm text-gray-400">${edu.institution}</p>
        <p class="text-xs text-gray-500">${edu.period}</p>
        ${edu.gpa ? `<p class="text-xs text-cyan-400">GPA: ${edu.gpa}</p>` : ''}
        ${edu.description ? `<p class="text-sm text-gray-300 mt-1">${edu.description}</p>` : ''}
      </div>
    `).join('');
  }

  renderSkills(skills) {
    const container = document.getElementById('skillsContainer');
    if (!container) return;

    if (skills.length === 0) {
      container.innerHTML = '<p class="text-gray-400 col-span-full text-center">No skills data available</p>';
      return;
    }

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    container.innerHTML = Object.entries(groupedSkills).map(([category, categorySkills]) => `
      <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-cyan-500 transition duration-300">
        <h3 class="text-lg font-semibold mb-4 text-cyan-400 capitalize">${category}</h3>
        <div class="space-y-4">
          ${categorySkills.map(skill => `
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-white">${skill.name}</span>
                <span class="text-sm text-gray-400">${skill.level}%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                     style="width: ${skill.level}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  renderCertifications(certifications) {
    const container = document.getElementById('certificationsContainer');
    if (!container) return;

    if (certifications.length === 0) {
      container.innerHTML = '<p class="text-gray-400 col-span-full text-center">No certifications data available</p>';
      return;
    }

    container.innerHTML = certifications.map(cert => `
      <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-cyan-500 transition duration-300 transform hover:scale-105">
        <div class="flex items-center mb-4">
          <i class="fas fa-certificate text-2xl text-cyan-500 mr-3"></i>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white">${cert.title}</h3>
            <p class="text-sm text-gray-400">${cert.issuer}</p>
          </div>
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center text-sm text-gray-300">
            <i class="fas fa-calendar text-cyan-500 mr-2"></i>
            <span>${cert.date}</span>
          </div>
          
          ${cert.credentialId ? `
            <div class="flex items-center text-sm text-gray-300">
              <i class="fas fa-id-card text-cyan-500 mr-2"></i>
              <span>ID: ${cert.credentialId}</span>
            </div>
          ` : ''}
          
          ${cert.verificationUrl ? `
            <div class="mt-4">
              <a href="${cert.verificationUrl}" target="_blank" 
                 class="inline-flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition duration-300">
                <i class="fas fa-external-link-alt mr-1"></i>
                Verify Certificate
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  renderProjects(projects) {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    if (projects.length === 0) {
      container.innerHTML = '<p class="text-gray-400 col-span-full text-center">No projects data available</p>';
      return;
    }

    container.innerHTML = projects.map(project => `
      <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-cyan-500 transition duration-300 transform hover:scale-105">
        <div class="mb-4">
          <h3 class="text-xl font-semibold text-white mb-2">${project.title}</h3>
          <p class="text-gray-400 mb-4">${project.description}</p>
          
          ${project.technologies ? `
            <div class="flex flex-wrap gap-2 mb-4">
              ${project.technologies.split(',').map(tech => 
                `<span class="px-2 py-1 bg-cyan-600 text-xs rounded text-white">${tech.trim()}</span>`
              ).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="flex space-x-4">
          ${project.github ? `
            <a href="${project.github}" target="_blank" 
               class="flex items-center text-sm text-gray-300 hover:text-cyan-400 transition duration-300">
              <i class="fab fa-github mr-1"></i>
              Code
            </a>
          ` : ''}
          
          ${project.demo ? `
            <a href="${project.demo}" target="_blank" 
               class="flex items-center text-sm text-gray-300 hover:text-green-400 transition duration-300">
              <i class="fas fa-external-link-alt mr-1"></i>
              Live Demo
            </a>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const messageDiv = document.getElementById('contactMessage');

    contactForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      };

      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
      submitButton.disabled = true;

      try {
        const response = await fetch(`${this.apiBase}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          this.showContactMessage(result.message, 'success');
          contactForm.reset();
        } else {
          this.showContactMessage(result.message || 'Failed to send message', 'error');
        }

      } catch (error) {
        console.error('Contact form error:', error);
        this.showContactMessage('Network error. Please try again.', 'error');
      } finally {
        // Restore button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }
    });
  }

  showContactMessage(message, type) {
    const messageDiv = document.getElementById('contactMessage');
    if (!messageDiv) return;

    messageDiv.textContent = message;
    messageDiv.className = `mt-4 p-3 rounded-lg ${
      type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`;
    messageDiv.classList.remove('hidden');

    setTimeout(() => {
      messageDiv.classList.add('hidden');
    }, 5000);
  }

  showErrorMessage(message) {
    console.error(message);
    // You could add a global error notification here
  }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Portfolio();
});

// Add some loading animations
window.addEventListener('load', () => {
  // Animate skill bars
  document.querySelectorAll('.bg-gradient-to-r').forEach((bar, index) => {
    setTimeout(() => {
      bar.style.transform = 'scaleX(1)';
    }, index * 200);
  });
});