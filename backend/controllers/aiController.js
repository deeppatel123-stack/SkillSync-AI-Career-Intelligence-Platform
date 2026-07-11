/**
 * AI Controller – handles AI feature requests.
 * Communicates with Django backend for ML predictions.
 */

const djangoApi = require('../config/djangoApi');
const Prediction = require('../models/Prediction');
const CareerRecommendation = require('../models/CareerRecommendation');
const User = require('../models/User');
const Application = require('../models/Application');

// ================================================================
// Placement Prediction
// ================================================================

/**
 * POST /api/ai/predict-placement
 * Accepts arrays for skills, certifications, projects, internships.
 * Converts them to counts before sending to Django ML backend.
 */
async function predictPlacement(req, res) {
  try {
    const { cgpa, skills, certifications, projects, internships,
            aptitudeScore, communicationScore } = req.body;

    // Validate input
    if (cgpa === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide cgpa.'
      });
    }

    // Convert arrays to counts for Django ML model
    const skillsCount = Array.isArray(skills) ? skills.length : Number(skills || 0);
    const certificationsCount = Array.isArray(certifications) ? certifications.length : Number(certifications || 0);
    const projectsCount = Array.isArray(projects) ? projects.length : Number(projects || 0);
    const internshipCount = Array.isArray(internships) ? internships.length : Number(internships || 0);

    // Call Django AI backend with numeric counts
    const result = await djangoApi.post('/api/predict-placement/', {
      cgpa: Number(cgpa),
      skills_count: skillsCount,
      internship_count: internshipCount,
      projects_count: projectsCount,
      certifications_count: certificationsCount,
      aptitude_score: Number(aptitudeScore || 0),
      communication_score: Number(communicationScore || 0),
    });

    // Store prediction in database if user is logged in
    if (req.user) {
      await Prediction.create({
        studentId: req.user._id,
        type: 'placement',
        result: result,
        inputData: { cgpa, skills, certifications, projects, internships, aptitudeScore, communicationScore },
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Placement prediction error:', error.message);
    res.status(503).json({
      success: false,
      message: 'AI service unavailable. Please ensure the Django server is running.',
    });
  }
}

// ================================================================
// Career Recommendation
// ================================================================

/**
 * POST /api/ai/recommend-career
 * Accepts a skills array, maps them to ML feature scores and sends to Django.
 */
async function recommendCareer(req, res) {
  try {
    const { skills } = req.body;

    // Map selected skills to ML feature scores (0 or 1)
    const skillScores = {
      html_css: 0, javascript: 0, react: 0, python: 0, database: 0,
      cloud: 0, networking: 0, security: 0, devops: 0, data_science: 0, ai_ml: 0, dsa: 0,
    };

    if (Array.isArray(skills)) {
      const skillsLower = skills.map((s) => s.toLowerCase());

      // Map each skill to its corresponding ML feature
      if (skillsLower.some((s) => ['html', 'css'].some((kw) => s.includes(kw)))) {
        skillScores.html_css = 1;
      }
      if (skillsLower.some((s) => ['javascript', 'js', 'typescript'].some((kw) => s.includes(kw)))) {
        skillScores.javascript = 1;
      }
      if (skillsLower.some((s) => ['react', 'next.js', 'vue', 'angular'].some((kw) => s.includes(kw)))) {
        skillScores.react = 1;
      }
      if (skillsLower.some((s) => ['python'].some((kw) => s === kw))) {
        skillScores.python = 1;
      }
      if (skillsLower.some((s) => ['sql', 'mongodb', 'mysql', 'postgresql', 'database', 'firebase'].some((kw) => s.includes(kw)))) {
        skillScores.database = 1;
      }
      if (skillsLower.some((s) => ['aws', 'azure', 'cloud', 'gcp'].some((kw) => s.includes(kw)))) {
        skillScores.cloud = 1;
      }
      if (skillsLower.some((s) => ['networking', 'network'].some((kw) => s.includes(kw)))) {
        skillScores.networking = 1;
      }
      if (skillsLower.some((s) => ['security', 'cyber security', 'ceh'].some((kw) => s.includes(kw)))) {
        skillScores.security = 1;
      }
      if (skillsLower.some((s) => ['devops', 'docker', 'kubernetes', 'jenkins', 'ci/cd'].some((kw) => s.includes(kw)))) {
        skillScores.devops = 1;
      }
      if (skillsLower.some((s) => ['data analysis', 'data visualization', 'tableau', 'powerbi', 'pandas', 'numpy'].some((kw) => s.includes(kw)))) {
        skillScores.data_science = 1;
      }
      if (skillsLower.some((s) => ['machine learning', 'deep learning', 'tensorflow', 'ai', 'artificial intelligence'].some((kw) => s.includes(kw)))) {
        skillScores.ai_ml = 1;
      }
      if (skillsLower.some((s) => ['dsa', 'data structures', 'algorithms', 'java'].some((kw) => s.includes(kw)))) {
        skillScores.dsa = 1;
      }
    }

    // Call Django AI backend
    const result = await djangoApi.post('/api/recommend-career/', skillScores);

    // Store recommendation in database if user is logged in
    if (req.user && result.top_recommendation) {
      await CareerRecommendation.create({
        studentId: req.user._id,
        topRecommendation: result.top_recommendation,
        recommendations: result.recommendations || [],
        confidence: result.confidence || 0,
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Career recommendation error:', error.message);
    res.status(503).json({
      success: false,
      message: 'AI service unavailable. Please ensure the Django server is running.',
    });
  }
}

// ================================================================
// Learning Roadmap
// ================================================================

/**
 * POST /api/ai/learning-roadmap
 * Generate a learning roadmap for a target career.
 */
async function generateLearningRoadmap(req, res) {
  try {
    const { career, skills } = req.body;

    if (!career) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a career name.'
      });
    }

    const result = await djangoApi.post('/api/learning-roadmap/', {
      career: career,
      skills: skills || [],
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Learning roadmap error:', error.message);
    res.status(503).json({
      success: false,
      message: 'AI service unavailable.',
    });
  }
}

// ================================================================
// Available Careers
// ================================================================

/**
 * GET /api/ai/careers
 * Get list of available career paths.
 */
async function getCareers(req, res) {
  try {
    const result = await djangoApi.get('/api/careers/');
    res.json({ success: true, data: result.careers });
  } catch (error) {
    // Fallback list if Django is unavailable
    res.json({
      success: true,
      data: [
        'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
        'AI Engineer', 'Data Analyst', 'DevOps', 'Cloud Engineer', 'Cyber Security'
      ],
    });
  }
}

// ================================================================
// Placement Statistics (real data from MongoDB)
// ================================================================

/**
 * GET /api/ai/placement-statistics
 * Get placement statistics from real registered students.
 */
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
      if (s.skills?.length) {
        studentsWithSkills++;
        totalSkills += s.skills.length;
      }
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

// ================================================================
// Student Prediction History
// ================================================================

/**
 * GET /api/ai/predictions
 * Get prediction history for the logged-in student.
 */
async function getPredictionHistory(req, res) {
  try {
    const predictions = await Prediction.find({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const recommendations = await CareerRecommendation.find({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        predictions: predictions,
        careerRecommendations: recommendations,
      },
    });
  } catch (error) {
    console.error('Prediction history error:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = {
  predictPlacement,
  recommendCareer,
  generateLearningRoadmap,
  getCareers,
  getPlacementStatistics,
  getPredictionHistory,
};
