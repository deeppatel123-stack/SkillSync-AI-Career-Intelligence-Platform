const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail } = require('../config/email');

async function scheduleInterview(req, res) {
  try {
    const { applicationId, opportunityId, studentId, scheduledAt, interviewType, meetingLink, interviewerName, notes } = req.body;

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student candidate not found' });

    let jobTitle = 'Position';
    let opp = null;
    if (opportunityId) {
      opp = await Opportunity.findById(opportunityId);
      if (opp) jobTitle = opp.title;
    }

    let app = null;
    if (applicationId) {
      app = await Application.findById(applicationId);
      if (app) {
        app.status = 'interview';
        await app.save();
      }
    }

    const interview = await Interview.create({
      opportunityId: opportunityId || null,
      applicationId: applicationId || null,
      studentId: student._id,
      companyId: req.user._id,
      companyName: req.user.name,
      studentName: student.name,
      jobTitle,
      scheduledAt: new Date(scheduledAt),
      interviewType: interviewType || 'technical',
      meetingLink: meetingLink || '',
      interviewerName: interviewerName || req.user.name,
      notes: notes || '',
      status: 'scheduled',
    });

    // Notify student
    await Notification.create({
      recipientId: student._id,
      type: 'interview',
      title: 'Interview Scheduled!',
      message: `${req.user.name} scheduled a ${interviewType || 'technical'} interview for ${jobTitle} on ${new Date(scheduledAt).toLocaleString()}`,
      link: '/student/interviews',
    });

    if (student.email) {
      await sendEmail({
        to: student.email,
        subject: `Interview Scheduled with ${req.user.name}`,
        text: `Hi ${student.name}, your ${interviewType} interview for ${jobTitle} with ${req.user.name} is scheduled on ${new Date(scheduledAt).toLocaleString()}. Meeting link: ${meetingLink || 'Will be shared soon'}.`,
        html: `<p>Hi <strong>${student.name}</strong>,</p><p>Your <strong>${interviewType}</strong> interview for <strong>${jobTitle}</strong> with <strong>${req.user.name}</strong> has been scheduled.</p><p><strong>Date & Time:</strong> ${new Date(scheduledAt).toLocaleString()}</p><p><strong>Meeting Link:</strong> <a href="${meetingLink || '#'}">${meetingLink || 'To be shared'}</a></p>`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      interview: interview.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getInterviews(req, res) {
  try {
    const filter = {};
    if (req.user.role === 'student') {
      filter.studentId = req.user._id;
    } else if (req.user.role === 'company') {
      filter.companyId = req.user._id;
    } else if (req.user.role === 'college') {
      // Find interviews involving students belonging to college
      const collegeStudents = await User.find({ role: 'student', collegeName: new RegExp(req.user.name, 'i') }).select('_id');
      filter.studentId = { $in: collegeStudents.map(s => s._id) };
    }

    const interviews = await Interview.find(filter).sort({ scheduledAt: 1 });
    res.json({
      success: true,
      interviews: interviews.map(i => i.toPublicJSON()),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateInterviewStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, meetingLink, notes, scheduledAt } = req.body;

    const interview = await Interview.findById(id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });

    if (interview.companyId.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this interview' });
    }

    if (status) interview.status = status;
    if (meetingLink !== undefined) interview.meetingLink = meetingLink;
    if (notes !== undefined) interview.notes = notes;
    if (scheduledAt) interview.scheduledAt = new Date(scheduledAt);

    await interview.save();

    // Notify student of update
    await Notification.create({
      recipientId: interview.studentId,
      type: 'interview',
      title: 'Interview Status Update',
      message: `Your interview with ${interview.companyName} for ${interview.jobTitle} is now ${interview.status}`,
      link: '/student/interviews',
    });

    res.json({ success: true, message: 'Interview updated', interview: interview.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteInterview(req, res) {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });

    if (interview.companyId.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await interview.deleteOne();
    res.json({ success: true, message: 'Interview deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  scheduleInterview,
  getInterviews,
  updateInterviewStatus,
  deleteInterview,
};
