const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Skill = require('./models/Skill');
const Education = require('./models/Education');
const Certification = require('./models/Certification');
const Project = require('./models/Project');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kiran-portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.log('MongoDB connection error:', err));

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Education.deleteMany({});
    await Certification.deleteMany({});
    await Project.deleteMany({});

    // Create admin user
    const adminUser = new User({
      name: 'Kiran Damai',
      email: 'admin@kiran.com',
      password: 'admin123',
      role: 'admin',
      profileImage: 'https://via.placeholder.com/200x200?text=Kiran+Damai',
      tagline: 'Cybersecurity Enthusiast | Ethical Hacker | Cloud Security Learner',
      bio: 'Passionate cybersecurity student at Softwarica College affiliated with Coventry University. Dedicated to learning ethical hacking, penetration testing, and cloud security. Always eager to explore new security technologies and contribute to making the digital world safer.'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Seed Skills
    const skills = [
      { name: 'Python', category: 'Programming', level: 'Advanced', icon: 'fab fa-python', description: 'Python for security scripting and automation' },
      { name: 'JavaScript', category: 'Programming', level: 'Intermediate', icon: 'fab fa-js-square', description: 'Frontend and backend development' },
      { name: 'Linux', category: 'Operating Systems', level: 'Advanced', icon: 'fab fa-linux', description: 'Linux system administration and security' },
      { name: 'Windows', category: 'Operating Systems', level: 'Intermediate', icon: 'fab fa-windows', description: 'Windows security and administration' },
      { name: 'Kali Linux', category: 'Security Tools', level: 'Advanced', icon: 'fas fa-terminal', description: 'Penetration testing distribution' },
      { name: 'Wireshark', category: 'Security Tools', level: 'Intermediate', icon: 'fas fa-network-wired', description: 'Network protocol analyzer' },
      { name: 'Nmap', category: 'Security Tools', level: 'Advanced', icon: 'fas fa-search', description: 'Network discovery and security auditing' },
      { name: 'Metasploit', category: 'Security Tools', level: 'Intermediate', icon: 'fas fa-bug', description: 'Penetration testing framework' },
      { name: 'Burp Suite', category: 'Security Tools', level: 'Intermediate', icon: 'fas fa-shield-alt', description: 'Web application security testing' },
      { name: 'AWS', category: 'Cloud', level: 'Beginner', icon: 'fab fa-aws', description: 'Amazon Web Services cloud platform' },
      { name: 'Docker', category: 'Other', level: 'Intermediate', icon: 'fab fa-docker', description: 'Containerization and deployment' },
      { name: 'Git', category: 'Other', level: 'Intermediate', icon: 'fab fa-git-alt', description: 'Version control system' }
    ];

    for (const skill of skills) {
      await new Skill(skill).save();
    }
    console.log('Skills seeded');

    // Seed Education
    const education = [
      {
        institution: 'Softwarica College of IT & E-Commerce',
        degree: 'Bachelor of Science (Hons) Computing',
        field: 'Cybersecurity and Ethical Hacking',
        startDate: new Date('2022-01-01'),
        current: true,
        location: 'Kathmandu, Nepal',
        description: 'Studying cybersecurity fundamentals, ethical hacking techniques, network security, and digital forensics. Affiliated with Coventry University, UK.',
        order: 1
      },
      {
        institution: 'Trinity International College',
        degree: '+2 Science',
        field: 'Computer Science',
        startDate: new Date('2019-06-01'),
        endDate: new Date('2021-05-31'),
        grade: 'A Grade',
        location: 'Kathmandu, Nepal',
        description: 'Completed higher secondary education with focus on mathematics, physics, and computer science.',
        order: 2
      }
    ];

    for (const edu of education) {
      await new Education(edu).save();
    }
    console.log('Education seeded');

    // Seed Certifications
    const certifications = [
      {
        title: 'Certified Ethical Hacker (CEH)',
        issuer: 'EC-Council',
        issueDate: new Date('2023-08-15'),
        expiryDate: new Date('2026-08-15'),
        credentialId: 'CEH-2023-KD-001',
        category: 'Security',
        description: 'Comprehensive certification covering ethical hacking methodologies and tools',
        skills: ['Penetration Testing', 'Vulnerability Assessment', 'Network Security'],
        order: 1
      },
      {
        title: 'CompTIA Security+',
        issuer: 'CompTIA',
        issueDate: new Date('2023-06-10'),
        expiryDate: new Date('2026-06-10'),
        credentialId: 'COMP001021234567',
        category: 'Security',
        description: 'Foundation-level cybersecurity certification covering core security concepts',
        skills: ['Network Security', 'Risk Management', 'Cryptography'],
        order: 2
      },
      {
        title: 'Cisco Certified Network Associate (CCNA)',
        issuer: 'Cisco',
        issueDate: new Date('2023-03-20'),
        expiryDate: new Date('2026-03-20'),
        category: 'Networking',
        description: 'Networking fundamentals and security implementation',
        skills: ['Network Configuration', 'Routing', 'Switching', 'Network Security'],
        order: 3
      }
    ];

    for (const cert of certifications) {
      await new Certification(cert).save();
    }
    console.log('Certifications seeded');

    // Seed Projects
    const projects = [
      {
        title: 'Network Vulnerability Scanner',
        description: 'A Python-based network vulnerability scanner that identifies open ports, running services, and potential security vulnerabilities in network devices.',
        technologies: ['Python', 'Nmap', 'Socket Programming', 'Threading'],
        githubUrl: 'https://github.com/kirandamai/network-vuln-scanner',
        category: 'Security',
        status: 'Completed',
        featured: true,
        order: 1
      },
      {
        title: 'Password Strength Analyzer',
        description: 'Web application that analyzes password strength and suggests improvements. Includes entropy calculation and common password detection.',
        technologies: ['JavaScript', 'HTML', 'CSS', 'Bootstrap'],
        githubUrl: 'https://github.com/kirandamai/password-analyzer',
        liveUrl: 'https://password-analyzer-kd.netlify.app',
        category: 'Security',
        status: 'Completed',
        order: 2
      },
      {
        title: 'Phishing Email Detector',
        description: 'Machine learning model to detect phishing emails using natural language processing and suspicious link analysis.',
        technologies: ['Python', 'Scikit-learn', 'NLTK', 'Pandas'],
        githubUrl: 'https://github.com/kirandamai/phishing-detector',
        category: 'Security',
        status: 'In Progress',
        order: 3
      },
      {
        title: 'Encrypted Chat Application',
        description: 'Secure messaging application with end-to-end encryption using AES and RSA algorithms.',
        technologies: ['Python', 'Tkinter', 'Cryptography', 'Socket'],
        githubUrl: 'https://github.com/kirandamai/secure-chat',
        category: 'Security',
        status: 'Completed',
        order: 4
      },
      {
        title: 'Web Application Penetration Testing Report',
        description: 'Comprehensive penetration testing report of a dummy e-commerce application, identifying OWASP Top 10 vulnerabilities.',
        technologies: ['Burp Suite', 'OWASP ZAP', 'Nikto', 'SQLMap'],
        category: 'Security',
        status: 'Completed',
        order: 5
      },
      {
        title: 'Security Awareness Training Portal',
        description: 'Interactive web portal for cybersecurity awareness training with quizzes and progress tracking.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        githubUrl: 'https://github.com/kirandamai/security-training',
        category: 'Web Development',
        status: 'In Progress',
        order: 6
      }
    ];

    for (const project of projects) {
      await new Project(project).save();
    }
    console.log('Projects seeded');

    console.log('Database seeded successfully!');
    console.log('Admin Login Credentials:');
    console.log('Email: admin@kiran.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();