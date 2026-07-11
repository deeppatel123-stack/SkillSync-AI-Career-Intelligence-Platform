const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const { sendEmail } = require('../config/email');

/**
 * GET /api/applications
 * Query: status, forStudent, forOrganizer
 */
async function getApplications(req, res) {
  try {
    const { status } = req.query;
    let filter = {};

    if (req.user.role === 'student') {
      filter.studentId = req.user._id;
    } else if (req.user.role === 'college' || req.user.role === 'company') {
      const myOpps = await Opportunity.find({ organizerId: req.user._id }).select('_id');
      filter.opportunityId = { $in: myOpps.map((o) => o._id) };
    }
    // superadmin sees all – no extra filter

    if (status && status !== 'all') {
      filter.status = status;
    }

    const applications = await Application.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      applications: applications.map((a) => a.toPublicJSON()),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * GET /api/applications/:id
 */
async function getApplicationById(req, res) {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, application: app.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/applications – student applies (multipart with resume optional)
 */
async function createApplication(req, res) {
  try {
    const { opportunityId, fullName, email, phone, university, course, year, coverLetter, linkedin } =
      req.body;

    const opp = await Opportunity.findById(opportunityId);
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    if (opp.reviewStatus !== 'approved' || opp.status === 'closed') {
      return res.status(400).json({ success: false, message: 'This opportunity is not open for applications' });
    }

    if (new Date(opp.deadline) < new Date()) {
      return res.status(400).json({ success: false, message: 'Application deadline has passed' });
    }

    const existing = await Application.findOne({
      opportunityId,
      studentId: req.user._id,
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied to this opportunity' });
    }

    const resumeFile = req.file ? req.file.filename : '';

    const application = await Application.create({
      opportunityId,
      studentId: req.user._id,
      status: 'applied',
      applicantDetails: {
        fullName: fullName || req.user.name,
        email: email || req.user.email,
        phone: phone || req.user.phone || '',
        university: university || '',
        course: course || '',
        year: year || '',
        resume: resumeFile,
        coverLetter: coverLetter || '',
        linkedin: linkedin || '',
      },
    });

    // Notify organizer by email (if configured)
    const organizer = await User.findById(opp.organizerId);
    if (organizer?.email) {
      await sendEmail({
        to: organizer.email,
        subject: `New application: ${opp.title}`,
        text: `${req.user.name} applied to ${opp.title}.`,
        html: `<p><strong>${req.user.name}</strong> applied to <strong>${opp.title}</strong>.</p>`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: application.toPublicJSON(),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Already applied' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * PATCH /api/applications/:id/status – organizer or admin updates status
 * Body: { status: 'reviewed' | 'accepted' | 'rejected' | 'applied' }
 */
async function updateApplicationStatus(req, res) {
  try {
    const { status } = req.body;
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Organizers can only update apps for their opportunities
    if (req.user.role === 'college' || req.user.role === 'company') {
      const opp = await Opportunity.findById(app.opportunityId);
      if (!opp || opp.organizerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not allowed' });
      }
    }

    app.status = status;
    await app.save();

    // Email student about status change
    const student = await User.findById(app.studentId);
    if (student?.email) {
      await sendEmail({
        to: student.email,
        subject: 'Application status updated',
        text: `Your application status is now: ${status}`,
        html: `<p>Your application status was updated to: <strong>${status}</strong></p>`,
      });
    }

    res.json({
      success: true,
      message: 'Application status updated',
      application: app.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * DELETE /api/applications/:id
 */
async function deleteApplication(req, res) {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const isStudentOwner = app.studentId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'superadmin';

    if (!isStudentOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }

    await app.deleteOne();
    res.json({ success: true, message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
};
