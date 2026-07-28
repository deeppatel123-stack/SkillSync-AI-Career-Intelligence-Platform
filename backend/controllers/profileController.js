const User = require('../models/User');

const ALLOWED_FIELDS = [
  'name', 'phone', 'bio', 'location', 'website',
  'profilePhoto', 'dateOfBirth', 'gender', 'address',
  'city', 'state', 'country',
  'collegeName', 'degree', 'branch', 'semester', 'passingYear', 'cgpa',
  'skills', 'certifications', 'projects', 'internships',
  'languages', 'resume', 'github', 'linkedin', 'portfolio',
];

async function getStudentProfile(req, res) {
  try {
    res.json({ success: true, data: req.user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

async function updateStudentProfile(req, res) {
  try {
    const updates = {};
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({ success: true, message: 'Profile updated successfully.', data: updatedUser.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = { getStudentProfile, updateStudentProfile };
