const express = require('express');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const Project = require('../models/Project');

const router = express.Router();

// Get all skills
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, name: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get education
router.get('/education', async (req, res) => {
  try {
    const education = await Education.find().sort({ order: 1, startDate: -1 });
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get certifications
router.get('/certifications', async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ order: 1, issueDate: -1 });
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;