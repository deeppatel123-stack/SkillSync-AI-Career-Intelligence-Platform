const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

async function getAllUsers(req, res) {
  try {
    const users = await User.find({ role: { $ne: 'superadmin' } }).select('-password');
    res.json({ success: true, users: users.map(u => ({ id: u._id.toString(), name: u.name, email: u.email, role: u.role, isActive: u.isActive })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getPlatformStats(req, res) {
  try {
    const [totalUsers, totalOpportunities, totalApplications, adminCount] = await Promise.all([
      User.countDocuments(), Opportunity.countDocuments(), Application.countDocuments(), User.countDocuments({ role: 'superadmin' }),
    ]);
    res.json({ success: true, stats: { totalUsers, totalOpportunities, totalApplications, adminCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateProfile(req, res) {
  try {
    const { name, phone, bio, location, website, organization } = req.body;
    const user = req.user;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (organization !== undefined && user.role === 'superadmin') user.organization = organization;
    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'superadmin') return res.status(403).json({ success: false, message: 'Cannot delete admin users' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function toggleSaveOpportunity(req, res) {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found' });

    const user = req.user;
    const index = user.savedOpportunities.findIndex(id => id.toString() === opp._id.toString());

    if (index > -1) {
      user.savedOpportunities.splice(index, 1);
      await user.save();
      return res.json({ success: true, message: 'Removed from saved', saved: false });
    }

    user.savedOpportunities.push(opp._id);
    await user.save();
    res.json({ success: true, message: 'Opportunity saved', saved: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getSavedOpportunities(req, res) {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedOpportunities',
      match: { reviewStatus: 'approved' },
      populate: { path: 'organizerId', select: 'name' },
    });
    const opportunities = user.savedOpportunities
      .filter(o => o)
      .map(o => {
        const json = o.toPublicJSON();
        json.organizerName = o.organizerId?.name || 'Unknown';
        return json;
      });
    res.json({ success: true, opportunities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateCareerGoals(req, res) {
  try {
    const { targetRole, targetSkills, preferredIndustry, preferredLocation, opportunityPreference } = req.body;
    const user = req.user;
    user.careerGoals = {
      targetRole: targetRole !== undefined ? targetRole : (user.careerGoals?.targetRole || ''),
      targetSkills: Array.isArray(targetSkills) ? targetSkills : (user.careerGoals?.targetSkills || []),
      preferredIndustry: preferredIndustry !== undefined ? preferredIndustry : (user.careerGoals?.preferredIndustry || ''),
      preferredLocation: preferredLocation !== undefined ? preferredLocation : (user.careerGoals?.preferredLocation || ''),
      opportunityPreference: opportunityPreference !== undefined ? opportunityPreference : (user.careerGoals?.opportunityPreference || 'any'),
    };
    await user.save();
    res.json({ success: true, message: 'Career goals updated', careerGoals: user.careerGoals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getAllUsers, getPlatformStats, updateProfile, deleteUser, changePassword, toggleSaveOpportunity, getSavedOpportunities, updateCareerGoals };
