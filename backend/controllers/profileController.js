/**
 * Profile Controller – handles student profile CRUD operations.
 */

const User = require('../models/User');

/**
 * GET /api/users/profile/student
 * Get the logged-in student's full profile.
 */
async function getStudentProfile(req, res) {
  try {
    // User is already loaded by requireAuth middleware
    res.json({
      success: true,
      data: req.user.toPublicJSON(),
    });
  } catch (error) {
    console.error('Get student profile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

/**
 * PUT /api/users/profile/student
 * Update the logged-in student's full profile.
 * Accepts all student profile fields.
 */
async function updateStudentProfile(req, res) {
  try {
    // Fields that can be updated (student profile fields)
    const allowedFields = [
      'name', 'phone', 'bio', 'location', 'website',
      'profilePhoto', 'dateOfBirth', 'gender', 'address',
      'city', 'state', 'country',
      'collegeName', 'degree', 'branch', 'semester', 'passingYear', 'cgpa',
      'skills', 'certifications', 'projects', 'internships',
      'languages', 'resume',
      'github', 'linkedin', 'portfolio',
    ];

    // Build update object from request body
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedUser.toPublicJSON(),
    });
  } catch (error) {
    console.error('Update student profile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = {
  getStudentProfile,
  updateStudentProfile,
};
