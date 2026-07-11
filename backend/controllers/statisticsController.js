const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

/**
 * GET /api/college/statistics
 * College dashboard - real stats from MongoDB.
 */
async function getCollegeStatistics(req, res) {
  try {
    const [totalStudents, totalCompanies, totalOpportunities, totalApplications] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'company' }),
      Opportunity.countDocuments(),
      Application.countDocuments(),
    ]);

    const jobs = await Opportunity.countDocuments({ type: 'job' });
    const internships = await Opportunity.countDocuments({ type: 'internship' });

    const apps = await Application.find({}, 'status');
    const accepted = apps.filter((a) => a.status === 'accepted').length;
    const placementRate = apps.length ? Math.round((accepted / apps.length) * 100) : 0;

    const students = await User.find({ role: 'student', cgpa: { $ne: '' } }, 'cgpa');
    let totalCgpa = 0;
    let cgpaCount = 0;
    for (const s of students) {
      const c = parseFloat(s.cgpa);
      if (!isNaN(c)) { totalCgpa += c; cgpaCount++; }
    }
    const avgCgpa = cgpaCount ? (totalCgpa / cgpaCount).toFixed(1) : 'N/A';

    res.json({
      success: true,
      data: {
        totalStudents,
        totalApplications,
        totalCompanies,
        totalJobs: jobs,
        totalInternships: internships,
        totalOpportunities,
        placementRate,
        avgCgpa,
        acceptedHires: accepted,
      },
    });
  } catch (error) {
    console.error('College statistics error:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

/**
 * GET /api/company/statistics
 * Company dashboard - real stats from MongoDB for the logged-in company.
 */
async function getCompanyStatistics(req, res) {
  try {
    const companyId = req.user._id;

    const myOpps = await Opportunity.find({ organizerId: companyId });
    const oppIds = myOpps.map((o) => o._id);

    const jobsPosted = myOpps.filter((o) => o.type === 'job').length;
    const internshipsPosted = myOpps.filter((o) => o.type === 'internship').length;

    const apps = await Application.find({ opportunityId: { $in: oppIds } });
    const totalApplicants = apps.length;
    const shortlisted = apps.filter((a) => a.status === 'reviewed' || a.status === 'accepted').length;
    const hired = apps.filter((a) => a.status === 'accepted').length;

    res.json({
      success: true,
      data: {
        jobsPosted,
        internshipsPosted,
        totalOpportunities: myOpps.length,
        totalApplicants,
        shortlisted,
        hired,
      },
    });
  } catch (error) {
    console.error('Company statistics error:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = {
  getCollegeStatistics,
  getCompanyStatistics,
};
