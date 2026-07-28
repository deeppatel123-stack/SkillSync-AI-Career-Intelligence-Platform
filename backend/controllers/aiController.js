/**
 * AI Controller – handles AI feature requests.
 * Communicates with Django backend for ML predictions.
 */

const djangoApi = require('../config/djangoApi');
const User = require('../models/User');

const SOFT_SKILL_KEYWORDS = [
  'communication', 'teamwork', 'leadership', 'problem solving',
  'problem-solving', 'time management', 'critical thinking',
  'presentation', 'collaboration', 'adaptability', 'creativity',
  'public speaking', 'decision making', 'analytical', 'negotiation',
  'conflict resolution', 'interpersonal', 'mentoring', 'listening',
  'emotional intelligence', 'work ethic', 'self motivation',
  'self-motivation', 'team player', 'management',
];

// ================================================================
// Resume Analysis
// ================================================================

async function analyzeResume(req, res) {
  try {
    const student = await User.findById(req.user._id);
    const pSkills = student?.skills || [];
    const pProjects = student?.projects || [];
    if (pSkills.length === 0 && pProjects.length === 0 && (student?.internships || []).length === 0 && (student?.certifications || []).length === 0) {
      return res.status(400).json({ success: false, message: 'Please complete your profile with skills, projects, internships, or certifications before using Resume Analysis.' });
    }

    const { skills, projects, internships, certifications,
            educationLevel, hasPortfolio, hasGithub, hasLinkedin,
            languages } = req.body;

    const allSkills = Array.isArray(skills) ? skills : (Array.isArray(pSkills) ? pSkills : []);
    const technicalSkills = allSkills.filter(
      (s) => !SOFT_SKILL_KEYWORDS.some((kw) => s.toLowerCase().includes(kw))
    );
    const softSkills = allSkills.filter(
      (s) => SOFT_SKILL_KEYWORDS.some((kw) => s.toLowerCase().includes(kw))
    );

    const cgpaVal = parseFloat(student?.cgpa) || 0;

    const result = await djangoApi.post('/api/profile-analysis/', {
      technical_skills: technicalSkills.length,
      projects: Array.isArray(projects) ? projects.length : Number(projects || 0),
      internships: Array.isArray(internships) ? internships.length : Number(internships || 0),
      certifications: Array.isArray(certifications) ? certifications.length : Number(certifications || 0),
      cgpa: cgpaVal,
      has_github: hasGithub ? 1 : 0,
      has_linkedin: hasLinkedin ? 1 : 0,
      has_portfolio: hasPortfolio ? 1 : 0,
      languages_known: Array.isArray(languages) ? languages.length : Number(languages || 1),
      soft_skills: softSkills.length,
      workshops: 0,
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
    const student = await User.findById(req.user._id);
    if (!student?.skills || student.skills.length === 0) {
      return res.status(400).json({ success: false, message: 'Please add at least one skill to your profile before using Career Recommendation.' });
    }

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
      skills_list: Array.isArray(skills) ? skills : [],
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

module.exports = {
  analyzeResume,
  recommendCareerRole,
  analyzeSkillGap,
  generateLearningRoadmap,
  getCareers,
};
