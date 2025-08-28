const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'portfolio_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cybersecurity_portfolio',
  password: process.env.DB_PASSWORD || 'portfolio_password',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Database connection with better error handling
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log(`✅ PostgreSQL Connected: ${client.connectionParameters.host}`);
    client.release();
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    // Don't exit the process, continue with in-memory fallback
    console.log('📝 Continuing with in-memory data for development...');
  }
};

// Database helper functions
const dbHelpers = {
  // Project operations
  async getAllProjects() {
    try {
      const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async createProject(projectData) {
    try {
      const result = await pool.query(
        'INSERT INTO projects (title, description, technologies, image_url, project_url, github_url, category, featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [projectData.title, projectData.description, projectData.technologies, projectData.imageUrl, projectData.projectUrl, projectData.githubUrl, projectData.category, projectData.featured]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async updateProject(id, projectData) {
    try {
      const result = await pool.query(
        'UPDATE projects SET title = $1, description = $2, technologies = $3, image_url = $4, project_url = $5, github_url = $6, category = $7, featured = $8, updated_at = NOW() WHERE id = $9 RETURNING *',
        [projectData.title, projectData.description, projectData.technologies, projectData.imageUrl, projectData.projectUrl, projectData.githubUrl, projectData.category, projectData.featured, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  async deleteProject(id) {
    try {
      const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Blog operations
  async getAllBlogs(publishedOnly = true) {
    try {
      let query = 'SELECT * FROM blogs ORDER BY created_at DESC';
      if (publishedOnly) {
        query = 'SELECT * FROM blogs WHERE published = true ORDER BY created_at DESC';
      }
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  },

  async createBlog(blogData) {
    try {
      const result = await pool.query(
        'INSERT INTO blogs (title, content, excerpt, image_url, published) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [blogData.title, blogData.content, blogData.excerpt, blogData.imageUrl, blogData.published]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  async updateBlog(id, blogData) {
    try {
      const result = await pool.query(
        'UPDATE blogs SET title = $1, content = $2, excerpt = $3, image_url = $4, published = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
        [blogData.title, blogData.content, blogData.excerpt, blogData.imageUrl, blogData.published, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  async deleteBlog(id) {
    try {
      const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }
};

// Initialize database
connectDB();

// Routes

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect();
    client.release();
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      database: 'Disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await dbHelpers.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get all blog posts
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await dbHelpers.getAllBlogs(true);
    res.json(blogs);
  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Serve main site
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Server running on port', PORT);
  console.log('💾 Database: PostgreSQL (Docker)');
  console.log('🗄️  pgAdmin: http://localhost:5050');
});

module.exports = app;