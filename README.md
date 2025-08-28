# Cybersecurity Portfolio

A professional cybersecurity portfolio website showcasing skills, projects, and certifications.

## 🚀 Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Server:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Access the Application:**
   - Main Website: http://localhost:3000

## 🔧 Configuration

The `.env` file contains all necessary configuration:

```env
# Database Configuration
DB_USER=portfolio_user
DB_HOST=localhost
DB_NAME=cybersecurity_portfolio
DB_PASSWORD=portfolio_password
DB_PORT=5432

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🆘 Troubleshooting

### Network Error Issues

If you're experiencing network errors:

1. **Check if the server is running:**
   ```bash
   npm start
   ```

2. **Verify the server is accessible:**
   - Open http://localhost:3000/api/health
   - You should see a JSON response with server status

3. **Check for port conflicts:**
   - If port 3000 is busy, change the PORT in `.env` file
   - Or kill the process using port 3000

4. **CORS Issues:**
   - The server is configured to accept requests from multiple localhost ports
   - If you're running on a different port, add it to the CORS configuration in `server.js`

### Database Issues

1. **PostgreSQL Setup:**
   - The app uses PostgreSQL for data storage
   - Use Docker Compose for easy setup:
   ```bash
   docker-compose up -d
   ```

2. **Manual PostgreSQL Setup:**
   ```bash
   # Install PostgreSQL locally
   # Create database: cybersecurity_portfolio
   # Run init.sql to create tables
   ```

## 📁 Project Structure

```
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
├── .env.example      # Environment template
├── README.md         # This file
├── vercel.json       # Deployment configuration
├── init.sql          # Database initialization
├── docker-compose.yml # Docker setup
├── client/           # Frontend files
│   ├── index.html    # Main website
│   ├── about.html    # About page
│   ├── projects.html # Projects page
│   ├── certifications.html # Certifications page
│   ├── contact.html  # Contact page
│   ├── style.css     # Main styles
│   └── script.js     # Main JavaScript
├── public/           # Static files
└── server/           # Server-side code
    ├── index.js      # Express server
    ├── routes/       # API routes
    ├── models/       # Database models
    └── config/       # Configuration
```

## 🔒 Security Features

- CORS protection
- Environment-based configuration
- Input validation
- Secure database connections

## 🌐 API Endpoints

### Projects
- `GET /api/projects` - Get all projects

### Blogs
- `GET /api/blogs` - Get published blogs

### System
- `GET /api/health` - Server health check

## 🚀 Deployment

The project is configured for Vercel deployment with `vercel.json`. 

For other platforms:
1. Set environment variables
2. Ensure PostgreSQL connection is correct
3. Update CORS origins for production domain

## 📞 Support

If you continue to experience issues:

1. Check the browser console for errors
2. Check the server logs in the terminal
3. Verify all environment variables are set correctly
4. Ensure no firewall or antivirus is blocking the connection

## 💡 Tips

- Use the health check endpoint (`/api/health`) to verify server status
- The portfolio showcases cybersecurity projects and skills
- All data is stored in PostgreSQL database
- The server will work with Docker Compose for easy setup

## 🔄 Development Workflow

1. Make changes to server code
2. Server automatically restarts (if using `npm run dev`)
3. Refresh browser to see changes
4. Use browser developer tools to debug issues

---

**Need help?** Check the server logs in your terminal for detailed error messages.