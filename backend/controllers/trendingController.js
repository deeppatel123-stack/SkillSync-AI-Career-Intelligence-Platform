const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

const SKILL_KEYWORDS = {
  'React': ['react', 'react.js', 'reactjs'],
  'Node.js': ['node', 'node.js', 'nodejs', 'express', 'express.js'],
  'Python': ['python'],
  'JavaScript': ['javascript', 'js', 'typescript'],
  'MongoDB': ['mongodb', 'mongo'],
  'SQL': ['sql', 'mysql', 'postgresql', 'postgres'],
  'Docker': ['docker', 'container'],
  'AWS': ['aws', 'amazon web services'],
  'Machine Learning': ['machine learning', 'ml', 'tensorflow', 'pytorch'],
  'Git': ['git', 'github'],
  'Django': ['django'],
  'Flask': ['flask'],
  'Java': ['java'],
  'C++': ['c++', 'cpp'],
  'HTML/CSS': ['html', 'css'],
  'TypeScript': ['typescript', 'ts'],
  'Next.js': ['next.js', 'nextjs', 'next'],
  'Vue.js': ['vue', 'vue.js', 'vuejs'],
  'Angular': ['angular'],
  'Firebase': ['firebase'],
  'REST API': ['rest', 'rest api', 'restapi', 'api'],
  'GraphQL': ['graphql'],
  'Docker': ['docker'],
  'Kubernetes': ['kubernetes', 'k8s'],
  'Azure': ['azure'],
  'Linux': ['linux', 'unix'],
  'Bootstrap': ['bootstrap'],
  'Tailwind CSS': ['tailwind', 'tailwind css'],
  'Figma': ['figma'],
  'Flutter': ['flutter'],
  'React Native': ['react native'],
  'Cyber Security': ['cyber security', 'security', 'cybersecurity'],
  'DevOps': ['devops', 'ci/cd', 'jenkins'],
  'Data Analysis': ['data analysis', 'data analytics', 'tableau', 'power bi'],
  'PHP': ['php'],
  'Laravel': ['laravel'],
  'Redis': ['redis'],
  'Swift': ['swift'],
  'Kotlin': ['kotlin'],
  'Go': ['golang', 'go'],
  'Rust': ['rust'],
  'Deep Learning': ['deep learning', 'neural network'],
  'NLP': ['nlp', 'natural language processing'],
  'Blockchain': ['blockchain', 'solidity', 'web3'],
};

const CATEGORIES = {
  'Web Development': ['React', 'Node.js', 'JavaScript', 'HTML/CSS', 'TypeScript', 'Next.js', 'Vue.js', 'Angular', 'Bootstrap', 'Tailwind CSS'],
  'AI / ML': ['Machine Learning', 'Deep Learning', 'Python', 'NLP', 'Data Analysis'],
  'Cloud Computing': ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Linux'],
  'DevOps': ['DevOps', 'Docker', 'Kubernetes', 'Git', 'Linux', 'AWS'],
  'Cyber Security': ['Cyber Security', 'Linux', 'Python'],
  'Mobile Development': ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Java'],
  'UI / UX': ['Figma', 'HTML/CSS', 'JavaScript', 'React'],
};

const SKILL_ROADMAP = {
  'HTML': ['CSS', 'JavaScript', 'Bootstrap'],
  'CSS': ['JavaScript', 'Tailwind CSS', 'React'],
  'JavaScript': ['React', 'Node.js', 'TypeScript'],
  'TypeScript': ['React', 'Next.js', 'Angular'],
  'Python': ['Django', 'Flask', 'Machine Learning', 'Data Analysis'],
  'Java': ['Spring Boot', 'Android', 'Kotlin'],
  'C++': ['Unreal Engine', 'System Programming'],
  'React': ['Next.js', 'Node.js', 'TypeScript', 'GraphQL'],
  'Node.js': ['MongoDB', 'Express.js', 'Docker', 'AWS'],
  'SQL': ['MongoDB', 'Node.js', 'Python', 'AWS'],
  'MongoDB': ['Node.js', 'Express.js', 'React'],
  'Django': ['Python', 'REST API', 'PostgreSQL'],
  'Flask': ['Python', 'REST API', 'Docker'],
  'Docker': ['Kubernetes', 'AWS', 'DevOps'],
  'Git': ['GitHub', 'DevOps', 'Docker'],
  'Machine Learning': ['Deep Learning', 'TensorFlow', 'NLP', 'Python'],
  'Data Analysis': ['Machine Learning', 'Python', 'Tableau', 'SQL'],
};

function countSkillMentions(text, keywords) {
  if (!text) return 0;
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw)) ? 1 : 0;
}

function getDemandScore(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

function getGrowth(count, total) {
  const base = total > 0 ? (count / total) * 100 : 0;
  return Math.min(30, Math.max(-5, Math.round(base * 0.15 - 2)));
}

/**
 * GET /api/trending-skills
 * Calculate skill demand from all job/internship opportunities.
 */
async function getTrendingSkills(req, res) {
  try {
    const opps = await Opportunity.find({
      type: { $in: ['job', 'internship'] },
      reviewStatus: 'approved',
      status: { $ne: 'closed' },
    });

    const total = opps.length || 1;
    const skillCounts = {};
    const allSkills = Object.keys(SKILL_KEYWORDS);

    for (const opp of opps) {
      const text = `${opp.title} ${opp.description} ${opp.requirements}`.toLowerCase();
      for (const skill of allSkills) {
        const kw = SKILL_KEYWORDS[skill];
        if (countSkillMentions(text, kw) > 0) {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        }
      }
    }

    const trending = allSkills
      .filter((s) => skillCounts[s] > 0)
      .map((skill) => ({
        name: skill,
        demand: getDemandScore(skillCounts[s], total),
        growth: getGrowth(skillCounts[s], total),
        count: skillCounts[s],
      }))
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 15);

    if (!trending.length) {
      const fallback = [
        { name: 'React', demand: 92, growth: 18, count: 0 },
        { name: 'Python', demand: 88, growth: 22, count: 0 },
        { name: 'JavaScript', demand: 85, growth: 10, count: 0 },
        { name: 'Node.js', demand: 80, growth: 15, count: 0 },
        { name: 'TypeScript', demand: 78, growth: 25, count: 0 },
        { name: 'MongoDB', demand: 72, growth: 12, count: 0 },
        { name: 'Docker', demand: 70, growth: 20, count: 0 },
        { name: 'AWS', demand: 68, growth: 16, count: 0 },
        { name: 'Machine Learning', demand: 65, growth: 30, count: 0 },
        { name: 'SQL', demand: 74, growth: 8, count: 0 },
        { name: 'Git', demand: 82, growth: 5, count: 0 },
        { name: 'HTML/CSS', demand: 76, growth: 3, count: 0 },
        { name: 'Next.js', demand: 60, growth: 28, count: 0 },
        { name: 'Tailwind CSS', demand: 55, growth: 35, count: 0 },
        { name: 'Flutter', demand: 50, growth: 40, count: 0 },
      ];
      return res.json({ success: true, data: fallback });
    }

    res.json({ success: true, data: trending });
  } catch (error) {
    console.error('Trending skills error:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

/**
 * GET /api/trending-categories
 * Group trending skills by category.
 */
async function getTrendingCategories(req, res) {
  try {
    const opps = await Opportunity.find({
      type: { $in: ['job', 'internship'] },
      reviewStatus: 'approved',
      status: { $ne: 'closed' },
    });

    const total = opps.length || 1;
    const skillCounts = {};

    for (const opp of opps) {
      const text = `${opp.title} ${opp.description} ${opp.requirements}`.toLowerCase();
      for (const skill of Object.keys(SKILL_KEYWORDS)) {
        if (countSkillMentions(text, SKILL_KEYWORDS[skill]) > 0) {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        }
      }
    }

    let categories = Object.entries(CATEGORIES).map(([name, skills]) => {
      const categorySkills = skills
        .filter((s) => skillCounts[s] > 0)
        .map((s) => ({
          name: s,
          demand: getDemandScore(skillCounts[s], total),
        }))
        .sort((a, b) => b.demand - a.demand);
      return { name, skills: categorySkills };
    });

    const hasAnySkills = categories.some((c) => c.skills.length > 0);
    if (!hasAnySkills) {
      categories = [
        { name: 'Web Development', skills: ['React', 'JavaScript', 'TypeScript', 'Next.js', 'HTML/CSS', 'Tailwind CSS'].map((s) => ({ name: s })) },
        { name: 'AI / ML', skills: ['Python', 'Machine Learning', 'Deep Learning', 'NLP', 'Data Analysis'].map((s) => ({ name: s })) },
        { name: 'Cloud Computing', skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Linux'].map((s) => ({ name: s })) },
        { name: 'DevOps', skills: ['Docker', 'Kubernetes', 'Git', 'Linux', 'AWS'].map((s) => ({ name: s })) },
        { name: 'Cyber Security', skills: ['Cyber Security', 'Linux', 'Python'].map((s) => ({ name: s })) },
        { name: 'Mobile Development', skills: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Java'].map((s) => ({ name: s })) },
        { name: 'UI / UX', skills: ['Figma', 'HTML/CSS', 'React'].map((s) => ({ name: s })) },
      ];
    }

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Trending categories error:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

/**
 * POST /api/recommended-skills
 * Given the user's current skills, recommend next skills to learn.
 */
async function getRecommendedSkills(req, res) {
  try {
    let userSkills = req.body.skills || [];

    if (!userSkills.length && req.user) {
      const user = await User.findById(req.user._id);
      userSkills = user?.skills || [];
    }

    const recommended = new Set();
    for (const skill of userSkills) {
      const next = SKILL_ROADMAP[skill];
      if (next) {
        next.forEach((s) => {
          if (!userSkills.includes(s)) recommended.add(s);
        });
      }
    }

    // Get trending data to score recommendations
    const opps = await Opportunity.find({
      type: { $in: ['job', 'internship'] },
      reviewStatus: 'approved',
      status: { $ne: 'closed' },
    });
    const total = opps.length || 1;
    const skillCounts = {};
    for (const opp of opps) {
      const text = `${opp.title} ${opp.description} ${opp.requirements}`.toLowerCase();
      for (const skill of Object.keys(SKILL_KEYWORDS)) {
        if (countSkillMentions(text, SKILL_KEYWORDS[skill]) > 0) {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        }
      }
    }

    const result = [...recommended]
      .map((skill) => ({
        name: skill,
        demandScore: skillCounts[skill] ? getDemandScore(skillCounts[skill], total) : 0,
      }))
      .sort((a, b) => b.demandScore - a.demandScore);

    res.json({ success: true, data: { userSkills, recommended: result } });
  } catch (error) {
    console.error('Recommended skills error:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = {
  getTrendingSkills,
  getTrendingCategories,
  getRecommendedSkills,
};
