const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

async function getCollegeStatistics(req, res) {
  try {
    const [totalStudents, totalCompanies, totalOpportunities, totalApplications] = await Promise.all([
      User.countDocuments({ role: 'student' }), User.countDocuments({ role: 'company' }),
      Opportunity.countDocuments(), Application.countDocuments(),
    ]);

    const jobs = await Opportunity.countDocuments({ type: 'job' });
    const internships = await Opportunity.countDocuments({ type: 'internship' });

    const apps = await Application.find({}, 'status');
    const accepted = apps.filter(a => a.status === 'accepted').length;
    const placementRate = apps.length ? Math.round((accepted / apps.length) * 100) : 0;

    const students = await User.find({ role: 'student', cgpa: { $ne: '' } }, 'cgpa');
    let totalCgpa = 0, cgpaCount = 0;
    students.forEach(s => { const c = parseFloat(s.cgpa); if (!isNaN(c)) { totalCgpa += c; cgpaCount++; } });
    const avgCgpa = cgpaCount ? (totalCgpa / cgpaCount).toFixed(1) : 'N/A';

    res.json({ success: true, data: { totalStudents, totalApplications, totalCompanies, totalJobs: jobs, totalInternships: internships, totalOpportunities, placementRate, avgCgpa, acceptedHires: accepted } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

async function getCompanyStatistics(req, res) {
  try {
    const myOpps = await Opportunity.find({ organizerId: req.user._id });
    const oppIds = myOpps.map(o => o._id);
    const apps = await Application.find({ opportunityId: { $in: oppIds } });

    res.json({ success: true, data: {
      jobsPosted: myOpps.filter(o => o.type === 'job').length,
      internshipsPosted: myOpps.filter(o => o.type === 'internship').length,
      totalOpportunities: myOpps.length,
      totalApplicants: apps.length,
      shortlisted: apps.filter(a => a.status === 'reviewed' || a.status === 'accepted').length,
      hired: apps.filter(a => a.status === 'accepted').length,
    }});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = { getCollegeStatistics, getCompanyStatistics };
