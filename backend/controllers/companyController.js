const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Interview = require('../models/Interview');

async function getCompanyDashboardStats(req, res) {
  try {
    const companyId = req.user._id;
    const myOpps = await Opportunity.find({ organizerId: companyId });
    const oppIds = myOpps.map(o => o._id);
    const apps = await Application.find({ opportunityId: { $in: oppIds } });

    const totalApplicants = apps.length;
    const underReview = apps.filter(a => a.status === 'reviewed' || a.status === 'pending').length;
    const shortlisted = apps.filter(a => a.status === 'shortlisted').length;
    const inInterview = apps.filter(a => a.status === 'interview').length;
    const offersMade = apps.filter(a => a.status === 'accepted').length;
    const rejected = apps.filter(a => a.status === 'rejected').length;

    const interviews = await Interview.find({ companyId });
    const upcomingInterviews = interviews.filter(i => i.status === 'scheduled');

    // Funnel stats
    const funnel = {
      applied: totalApplicants,
      reviewed: underReview + shortlisted + inInterview + offersMade + rejected,
      shortlisted: shortlisted + inInterview + offersMade,
      interview: inInterview + offersMade,
      selected: offersMade,
      rejected: rejected,
    };

    // Calculate applicant skill frequency
    const skillCount = {};
    apps.forEach(a => {
      const skills = a.applicantDetails?.skills || [];
      skills.forEach(s => {
        const clean = s.trim();
        if (clean) skillCount[clean] = (skillCount[clean] || 0) + 1;
      });
    });
    const topApplicantSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, count }));

    res.json({
      success: true,
      stats: {
        activeJobs: myOpps.filter(o => o.type === 'job' && o.status === 'open').length,
        activeInternships: myOpps.filter(o => o.type === 'internship' && o.status === 'open').length,
        totalOpportunities: myOpps.length,
        totalApplicants,
        underReview,
        shortlisted,
        inInterview,
        offersMade,
        scheduledInterviews: upcomingInterviews.length,
        funnel,
        topApplicantSkills,
      },
      recentApplications: apps.slice(-5).reverse().map(a => a.toPublicJSON()),
      upcomingInterviews: upcomingInterviews.slice(0, 5).map(i => i.toPublicJSON()),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function searchCandidates(req, res) {
  try {
    const { skills, minCgpa, branch, search, limit = 20 } = req.query;
    const filter = { role: 'student' };

    if (branch && branch !== 'all') filter.branch = new RegExp(branch, 'i');

    let students = await User.find(filter).select('-password').sort({ createdAt: -1 });

    if (skills) {
      const reqSkills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim().toLowerCase());
      students = students.filter(s => {
        const sSkills = (s.skills || []).map(sk => sk.toLowerCase());
        return reqSkills.some(rs => sSkills.some(sk => sk.includes(rs)));
      });
    }

    if (minCgpa) {
      const minVal = parseFloat(minCgpa);
      if (!isNaN(minVal)) {
        students = students.filter(s => parseFloat(s.cgpa || '0') >= minVal);
      }
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      students = students.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.branch || '').toLowerCase().includes(q) ||
        (s.bio || '').toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      candidates: students.slice(0, Number(limit)).map(s => s.toPublicJSON()),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function addRecruiterNote(req, res) {
  try {
    const { applicationId } = req.params;
    const { note } = req.body;
    if (!note || !note.trim()) return res.status(400).json({ success: false, message: 'Note content is required' });

    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

    // Verify company owns the opportunity
    const opp = await Opportunity.findById(app.opportunityId);
    if (!opp || (opp.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'superadmin')) {
      return res.status(403).json({ success: false, message: 'Not authorized to add note to this application' });
    }

    if (!app.recruiterNotes) app.recruiterNotes = [];
    app.recruiterNotes.push({
      note,
      addedBy: req.user.name,
      createdAt: new Date(),
    });
    await app.save();

    res.json({ success: true, message: 'Recruiter note added', application: app.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateCompanyProfile(req, res) {
  try {
    const { industry, companySize, companyBenefits, logoUrl, bio, location, website, name, phone } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (industry !== undefined) user.industry = industry;
    if (companySize !== undefined) user.companySize = companySize;
    if (companyBenefits !== undefined) user.companyBenefits = companyBenefits;
    if (logoUrl !== undefined) user.logoUrl = logoUrl;

    await user.save();
    res.json({ success: true, message: 'Company profile updated successfully', user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getCompanyDashboardStats,
  searchCandidates,
  addRecruiterNote,
  updateCompanyProfile,
};
