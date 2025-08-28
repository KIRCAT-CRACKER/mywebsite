-- Initialize Cybersecurity Portfolio Database

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT[], -- Array of technologies
    image_url VARCHAR(500),
    project_url VARCHAR(500),
    github_url VARCHAR(500),
    category VARCHAR(100) DEFAULT 'cybersecurity',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    image_url VARCHAR(500),
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample projects
INSERT INTO projects (title, description, technologies, category, featured) VALUES
('Network Security Analysis', 'Comprehensive network security assessment and vulnerability analysis', ARRAY['Wireshark', 'Nmap', 'Metasploit'], 'cybersecurity', true),
('Penetration Testing Framework', 'Automated penetration testing framework for web applications', ARRAY['Python', 'Django', 'SQLite'], 'cybersecurity', true),
('Security Incident Response', 'Real-time security incident detection and response system', ARRAY['Node.js', 'MongoDB', 'Redis'], 'cybersecurity', false)
ON CONFLICT DO NOTHING;

-- Insert sample blog posts
INSERT INTO blogs (title, content, excerpt, image_url, published) VALUES
('Introduction to Cybersecurity', 'This is a comprehensive introduction to cybersecurity fundamentals...', 'Learn the basics of cybersecurity and why it matters in today digital world.', 'https://via.placeholder.com/800x400/1f2937/06b6d4?text=Cybersecurity', true),
('Web Application Security', 'Understanding web application security vulnerabilities and best practices...', 'Explore common web application security threats and how to prevent them.', 'https://via.placeholder.com/800x400/1f2937/06b6d4?text=Web+Security', true),
('Network Security Best Practices', 'Essential network security practices for organizations...', 'Discover the key practices to secure your network infrastructure.', 'https://via.placeholder.com/800x400/1f2937/06b6d4?text=Network+Security', true)
ON CONFLICT DO NOTHING;
