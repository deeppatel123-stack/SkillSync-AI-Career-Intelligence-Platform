/**
 * AI Controller – handles AI feature requests.
 * Communicates with Django backend for ML predictions.
 */

const djangoApi = require('../config/djangoApi');
const User = require('../models/User');
const Application = require('../models/Application');

// ================================================================
// Resume Analysis
// ================================================================

async function analyzeResume(req, res) {
  try {
    const { skills, projects, internships, certifications,
            educationLevel, hasPortfolio, hasGithub, hasLinkedin,
            languages } = req.body;

    const result = await djangoApi.post('/api/resume-analysis/', {
      skills_count: Array.isArray(skills) ? skills.length : Number(skills || 0),
      projects_count: Array.isArray(projects) ? projects.length : Number(projects || 0),
      internship_count: Array.isArray(internships) ? internships.length : Number(internships || 0),
      certification_count: Array.isArray(certifications) ? certifications.length : Number(certifications || 0),
      education_level: Number(educationLevel || 0),
      has_portfolio: hasPortfolio ? 1 : 0,
      has_github: hasGithub ? 1 : 0,
      has_linkedin: hasLinkedin ? 1 : 0,
      languages_known: Array.isArray(languages) ? languages.length : Number(languages || 1),
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Resume analysis error:', error.message);
    res.status(503).json({
      success: false,
      message: 'AI service unavailable. Please ensure the Django server is running.',
    });
  }
}

// ================================================================
// Career Role Recommendation
// ================================================================

async function recommendCareerRole(req, res) {
  try {
    const { skills, projectsCount, internshipCount, certificationCount,
            interestedDomain } = req.body;

    const skillMap = {
      python: 0, java: 0, javascript: 0, react: 0, node: 0,
      express: 0, mongodb: 0, sql: 0, html: 0, css: 0,
      git: 0, dsa: 0, communication: 0, problem_solving: 0,
    };

    if (Array.isArray(skills)) {
      const lower = skills.map((s) => s.toLowerCase());
      if (lower.some((s) => s.includes('python'))) skillMap.python = 1;
      if (lower.some((s) => s.includes('java'))) skillMap.java = 1;
      if (lower.some((s) => ['javascript', 'js', 'typescript'].some((kw) => s.includes(kw)))) skillMap.javascript = 1;
      if (lower.some((s) => ['react', 'reactjs', 'react.js'].some((kw) => s.includes(kw)))) skillMap.react = 1;
      if (lower.some((s) => ['node', 'nodejs', 'node.js'].some((kw) => s.includes(kw)))) skillMap.node = 1;
      if (lower.some((s) => ['express', 'expressjs', 'express.js'].some((kw) => s.includes(kw)))) skillMap.express = 1;
      if (lower.some((s) => ['mongodb', 'mongo'].some((kw) => s.includes(kw)))) skillMap.mongodb = 1;
      if (lower.some((s) => ['sql', 'mysql', 'postgresql', 'postgres'].some((kw) => s.includes(kw)))) skillMap.sql = 1;
      if (lower.some((s) => ['html5', 'html'].some((kw) => s === kw || s.includes(kw)))) skillMap.html = 1;
      if (lower.some((s) => ['css3', 'css'].some((kw) => s === kw || s.includes(kw)))) skillMap.css = 1;
      if (lower.some((s) => ['git', 'github', 'git/github'].some((kw) => s.includes(kw)))) skillMap.git = 1;
      if (lower.some((s) => ['dsa', 'data structures', 'algorithms'].some((kw) => s.includes(kw)))) skillMap.dsa = 1;
      if (lower.some((s) => ['communication', 'presentation'].some((kw) => s.includes(kw)))) skillMap.communication = 1;
      if (lower.some((s) => ['problem solving', 'problem-solving', 'logical'].some((kw) => s.includes(kw)))) skillMap.problem_solving = 1;
    }

    const result = await djangoApi.post('/api/career-role/', {
      ...skillMap,
      projects_count: Number(projectsCount || 0),
      internship_count: Number(internshipCount || 0),
      certification_count: Number(certificationCount || 0),
      interested_domain: Number(interestedDomain || 0),
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Career role error:', error.message);
    res.status(503).json({
      success: false,
      message: 'AI service unavailable.',
    });
  }
}

// ================================================================
// Skill Gap Analysis (rule-based)
// ================================================================

async function analyzeSkillGap(req, res) {
  try {
    const { skills, targetRole } = req.body;

    const result = await djangoApi.post('/api/skill-gap/', {
      skills: skills || [],
      target_role: targetRole || '',
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Skill gap error:', error.message);
    res.status(503).json({
      success: false,
      message: 'AI service unavailable.',
    });
  }
}

// ================================================================
// Learning Roadmap
// ================================================================

async function generateLearningRoadmap(req, res) {
  try {
    const { career, skills } = req.body;

    if (!career) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a career name.',
      });
    }

    const result = await djangoApi.post('/api/learning-roadmap/', {
      career: career,
      skills: skills || [],
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Learning roadmap error:', error.message);
    res.status(503).json({ success: false, message: 'AI service unavailable.' });
  }
}

// ================================================================
// Available Careers
// ================================================================

async function getCareers(req, res) {
  try {
    const result = await djangoApi.get('/api/careers/');
    res.json({ success: true, data: result.careers });
  } catch (error) {
    res.json({
      success: true,
      data: [
        'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
        'Data Analyst', 'Data Scientist', 'AI/ML Engineer',
        'DevOps Engineer', 'QA Engineer', 'UI/UX Designer',
        'Cyber Security Analyst',
      ],
    });
  }
}

// ================================================================
// Placement Statistics (real data from MongoDB)
// ================================================================

async function getPlacementStatistics(req, res) {
  try {
    const students = await User.find({ role: 'student' });
    const totalStudents = students.length;
    let totalCgpa = 0;
    let cgpaCount = 0;
    let studentsWithSkills = 0;
    let totalSkills = 0;
    const apps = await Application.find({});
    const placed = apps.filter((a) => a.status === 'accepted').length;
    const placedStudentIds = [...new Set(apps.filter((a) => a.status === 'accepted').map((a) => a.studentId.toString()))];

    for (const s of students) {
      if (s.skills?.length) { studentsWithSkills++; totalSkills += s.skills.length; }
      const c = parseFloat(s.cgpa);
      if (!isNaN(c)) { totalCgpa += c; cgpaCount++; }
    }

    res.json({
      success: true,
      data: {
        total_students: totalStudents,
        placed_students: placed,
        not_placed: totalStudents - placed,
        placement_percentage: totalStudents ? Math.round((placed / totalStudents) * 100) : 0,
        avg_cgpa: cgpaCount ? (totalCgpa / cgpaCount).toFixed(2) : 'N/A',
        total_applications: apps.length,
        unique_placed_students: placedStudentIds.length,
        avg_skills_per_student: studentsWithSkills ? (totalSkills / studentsWithSkills).toFixed(1) : 0,
      },
    });
  } catch (error) {
    console.error('Placement statistics error:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = {
  analyzeResume,
  recommendCareerRole,
  analyzeSkillGap,
  generateLearningRoadmap,
  getCareers,
  getPlacementStatistics,
};
