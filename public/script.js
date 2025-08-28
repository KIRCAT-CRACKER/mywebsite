class Portfolio {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadDynamicContent();
    this.initScrollAnimations();
  }

  bindEvents() {
    // Mobile navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }

        // Close mobile menu
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactForm(e.target);
      });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', this.handleNavbarScroll);
  }

  async loadDynamicContent() {
    await Promise.all([
      this.loadSkills(),
      this.loadEducation(),
      this.loadCertificates()
    ]);
  }

  async loadSkills() {
    try {
      const response = await fetch('/api/skills');
      const skills = await response.json();
      this.renderSkills(skills);
    } catch (error) {
      console.error('Error loading skills:', error);
      this.renderFallbackSkills();
    }
  }

  renderSkills(skills) {
    const container = document.getElementById('skills-container');
    
    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    container.innerHTML = Object.entries(groupedSkills).map(([category, categorySkills]) => `
      <div class="skill-category">
        <h3>${category}</h3>
        ${categorySkills.map(skill => `
          <div class="skill-item">
            <div class="skill-name">
              <span>${skill.name}</span>
              <span>${skill.level}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-progress" data-width="${skill.level}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');

    // Animate skill bars
    this.animateSkillBars();
  }

  renderFallbackSkills() {
    const fallbackSkills = [
      { name: 'Network Security', level: 90, category: 'Security' },
      { name: 'Penetration Testing', level: 85, category: 'Security' },
      { name: 'Incident Response', level: 88, category: 'Security' },
      { name: 'Python', level: 85, category: 'Programming' },
      { name: 'JavaScript', level: 80, category: 'Programming' },
      { name: 'Wireshark', level: 90, category: 'Tools' },
      { name: 'Metasploit', level: 85, category: 'Tools' }
    ];
    this.renderSkills(fallbackSkills);
  }

  async loadEducation() {
    try {
      const response = await fetch('/api/education');
      const education = await response.json();
      this.renderEducation(education);
    } catch (error) {
      console.error('Error loading education:', error);
      this.renderFallbackEducation();
    }
  }

  renderEducation(education) {
    const container = document.getElementById('education-container');
    
    container.innerHTML = education.map((edu, index) => `
      <div class="timeline-item">
        <div class="timeline-content">
          <h3>${edu.degree}</h3>
          <h4>${edu.institution}</h4>
          <div class="year">${edu.year}</div>
          ${edu.description ? `<p>${edu.description}</p>` : ''}
        </div>
      </div>
    `).join('');
  }

  renderFallbackEducation() {
    const fallbackEducation = [
      {
        degree: 'Master of Science in Cybersecurity',
        institution: 'University of Technology',
        year: '2020-2022',
        description: 'Specialized in advanced cybersecurity concepts, threat analysis, and security architecture.'
      },
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'State University',
        year: '2016-2020',
        description: 'Foundation in computer science with focus on network security and programming.'
      }
    ];
    this.renderEducation(fallbackEducation);
  }

  async loadCertificates() {
    try {
      const response = await fetch('/api/certificates');
      const certificates = await response.json();
      this.renderCertificates(certificates);
    } catch (error) {
      console.error('Error loading certificates:', error);
      this.renderFallbackCertificates();
    }
  }

  renderCertificates(certificates) {
    const container = document.getElementById('certificates-container');
    
    container.innerHTML = certificates.map(cert => `
      <div class="certificate-card">
        ${cert.image ? `<img src="${cert.image}" alt="${cert.name}" style="max-width: 100%; height: auto; margin-bottom: 1rem;">` : ''}
        <h3>${cert.name}</h3>
        <p><strong>Issuer:</strong> ${cert.issuer}</p>
        <p class="certificate-date">${cert.date}</p>
      </div>
    `).join('');
  }

  renderFallbackCertificates() {
    const fallbackCertificates = [
      {
        name: 'Certified Ethical Hacker (CEH)',
        issuer: 'EC-Council',
        date: '2023'
      },
      {
        name: 'CompTIA Security+',
        issuer: 'CompTIA',
        date: '2022'
      },
      {
        name: 'CISSP',
        issuer: '(ISC)²',
        date: '2023'
      },
      {
        name: 'CISM',
        issuer: 'ISACA',
        date: '2023'
      }
    ];
    this.renderCertificates(fallbackCertificates);
  }

  animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute('data-width');
          entry.target.style.width = width;
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
      observer.observe(bar);
    });
  }

  initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.timeline-item, .certificate-card, .skill-category');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = 'none';
    }
  }

  handleContactForm(form) {
    const formData = new FormData(form);
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;

    // Simulate form submission
    const submitBtn = form.querySelector('button');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      alert(`Thank you ${name}! Your message has been received. We'll get back to you soon.`);
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Portfolio();
});

// Add active navbar link highlighting
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});