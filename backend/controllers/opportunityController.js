const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

async function getOpportunities(req, res) {
  try {
    const { type, search, organizerId, reviewStatus, status, forStudent } = req.query;
    const filter = {};

    if (type && type !== 'all') filter.type = type;
    if (organizerId) filter.organizerId = organizerId;
    if (reviewStatus) filter.reviewStatus = reviewStatus;
    if (status) filter.status = status;

    if (forStudent === 'true') {
      filter.reviewStatus = 'approved';
      filter.status = { $ne: 'closed' };
    }

    let opportunities = await Opportunity.find(filter).sort({ createdAt: -1 }).populate('organizerId', 'name email role');

    if (search && search.trim()) {
      const q = search.toLowerCase();
      opportunities = opportunities.filter(o => o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q) || (o.organizerId?.name || '').toLowerCase().includes(q));
    }

    const result = opportunities.map(o => {
      const json = o.toPublicJSON();
      if (o.organizerId && o.organizerId._id) json.organizerName = o.organizerId.name;
      return json;
    });

    res.json({ success: true, opportunities: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getOpportunityCount(req, res) {
  try {
    const count = await Opportunity.countDocuments({ reviewStatus: 'approved', status: { $ne: 'closed' } });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getOpportunityById(req, res) {
  try {
    const opp = await Opportunity.findById(req.params.id).populate('organizerId', 'name');
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found' });
    const json = opp.toPublicJSON();
    json.organizerName = opp.organizerId?.name || 'Unknown';
    res.json({ success: true, opportunity: json });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function createOpportunity(req, res) {
  try {
    const { title, type, description, deadline, location, requirements, benefits } = req.body;
    const opp = await Opportunity.create({
      title, type, description, deadline: new Date(deadline),
      location: location || '', requirements: requirements || '', benefits: benefits || '',
      organizerId: req.user._id, status: 'open', reviewStatus: 'pending',
    });
    res.status(201).json({ success: true, message: 'Opportunity posted successfully. Waiting for admin approval.', opportunity: opp.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateOpportunity(req, res) {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found' });
    if (opp.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') return res.status(403).json({ success: false, message: 'Not allowed to edit this opportunity' });

    ['title', 'type', 'description', 'location', 'requirements', 'benefits', 'status'].forEach(f => { if (req.body[f] !== undefined) opp[f] = req.body[f]; });
    if (req.body.deadline) opp.deadline = new Date(req.body.deadline);
    await opp.save();

    res.json({ success: true, message: 'Opportunity updated', opportunity: opp.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function reviewOpportunity(req, res) {
  try {
    const { reviewStatus } = req.body;
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found' });
    opp.reviewStatus = reviewStatus;
    await opp.save();

    await Notification.create({
      recipientId: opp.organizerId, type: 'opportunity', title: 'Opportunity review update',
      message: `Your opportunity "${opp.title}" was ${reviewStatus} by admin`, link: '/manage-opportunities',
    });
    res.json({ success: true, message: `Opportunity ${reviewStatus}`, opportunity: opp.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteOpportunity(req, res) {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found' });

    const isOwner = opp.organizerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'superadmin';
    if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Not allowed' });

    await Application.deleteMany({ opportunityId: opp._id });
    await opp.deleteOne();
    res.json({ success: true, message: 'Opportunity deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getDashboardStats(req, res) {
  try {
    const user = req.user;

    if (user.role === 'student') {
      const apps = await Application.find({ studentId: user._id });
      const opps = await Opportunity.find({ reviewStatus: 'approved', status: { $ne: 'closed' } });
      const joinedEvents = apps.filter(a => (['event', 'hackathon']).includes(opps.find(o => o._id.toString() === a.opportunityId.toString())?.type));

      return res.json({
        success: true,
        stats: {
          totalApplications: apps.length, availableOpportunities: opps.length,
          shortlisted: apps.filter(a => a.status === 'accepted').length,
          eventsJoined: joinedEvents.length,
        },
        recentOpportunities: opps.slice(-3).reverse().map(o => o.toPublicJSON()),
      });
    }

    if (user.role === 'college' || user.role === 'company') {
      const myOpps = await Opportunity.find({ organizerId: user._id });
      const oppIds = myOpps.map(o => o._id);
      const apps = await Application.find({ opportunityId: { $in: oppIds } });
      const pending = apps.filter(a => a.status === 'applied' || a.status === 'pending').length;
      const reviewed = apps.filter(a => a.status !== 'applied' && a.status !== 'pending').length;
      const responseRate = apps.length ? Math.round((reviewed / apps.length) * 100) : 0;

      return res.json({
        success: true,
        stats: { activeOpportunities: myOpps.length, totalApplications: apps.length, pendingReview: pending, responseRate },
        recentOpportunities: myOpps.slice(-3).reverse().map(o => o.toPublicJSON()),
      });
    }

    res.status(400).json({ success: false, message: 'Dashboard stats not available for this role' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getOpportunities, getOpportunityCount, getOpportunityById, createOpportunity, updateOpportunity, reviewOpportunity, deleteOpportunity, getDashboardStats };
