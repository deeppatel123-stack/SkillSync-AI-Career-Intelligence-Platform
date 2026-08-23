const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const CampusDrive = require('../models/CampusDrive');
const CollegeEvent = require('../models/CollegeEvent');
const Notification = require('../models/Notification');

async function getCollegeStats(req, res) {
  try {
    const collegeId = req.user._id;
    const [totalStudents, totalOpps, totalDrives, totalEvents] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Opportunity.countDocuments({ organizerId: collegeId }),
      CampusDrive.countDocuments({ collegeId }),
      CollegeEvent.countDocuments({ collegeId }),
    ]);

    const allApps = await Application.find({}, 'status applicantDetails');
    const placedStudents = await User.countDocuments({ role: 'student', placementStatus: 'placed' });
    const placementRate = totalStudents ? Math.round((placedStudents / totalStudents) * 100) : 0;

    // Department breakdown
    const students = await User.find({ role: 'student' }, 'branch cgpa placementStatus');
    const deptMap = {};
    students.forEach(s => {
      const dept = s.branch || 'General';
      if (!deptMap[dept]) deptMap[dept] = { count: 0, placed: 0 };
      deptMap[dept].count++;
      if (s.placementStatus === 'placed') deptMap[dept].placed++;
    });

    const recentDrives = await CampusDrive.find({ collegeId }).sort({ driveDate: 1 }).limit(5);
    const recentEvents = await CollegeEvent.find({ collegeId }).sort({ eventDate: 1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalStudents,
        activeOpportunities: totalOpps,
        totalDrives,
        totalEvents,
        placedStudents,
        placementRate,
        departmentBreakdown: deptMap,
      },
      recentDrives: recentDrives.map(d => d.toPublicJSON()),
      recentEvents: recentEvents.map(e => e.toPublicJSON()),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getCollegeStudents(req, res) {
  try {
    const { department, semester, minCgpa, placementStatus, search } = req.query;
    const filter = { role: 'student' };

    if (department && department !== 'all') filter.branch = new RegExp(department, 'i');
    if (semester && semester !== 'all') filter.semester = semester;
    if (placementStatus && placementStatus !== 'all') filter.placementStatus = placementStatus;

    let students = await User.find(filter).select('-password').sort({ createdAt: -1 });

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
        (s.skills || []).some(sk => sk.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      students: students.map(s => s.toPublicJSON()),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getCampusDrives(req, res) {
  try {
    const { collegeId, status, department } = req.query;
    const filter = {};
    if (collegeId) filter.collegeId = collegeId;
    if (status && status !== 'all') filter.status = status;
    if (department && department !== 'all') filter.department = new RegExp(department, 'i');

    const drives = await CampusDrive.find(filter).sort({ driveDate: 1 });
    res.json({ success: true, drives: drives.map(d => d.toPublicJSON()) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function createCampusDrive(req, res) {
  try {
    const { title, type, companyName, role, department, minCgpa, requiredSkills, driveDate, deadline, mode, venue, selectionProcess } = req.body;
    const drive = await CampusDrive.create({
      title,
      type: type || 'placement',
      companyName,
      role,
      department: department || 'All Departments',
      minCgpa: minCgpa ? Number(minCgpa) : 0,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s=>s.trim()) : []),
      driveDate: new Date(driveDate),
      deadline: new Date(deadline),
      mode: mode || 'on-campus',
      venue: venue || '',
      selectionProcess: selectionProcess || '',
      collegeId: req.user._id,
      organizerName: req.user.name,
    });

    res.status(201).json({ success: true, message: 'Campus drive created successfully', drive: drive.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateCampusDrive(req, res) {
  try {
    const drive = await CampusDrive.findById(req.params.id);
    if (!drive) return res.status(404).json({ success: false, message: 'Drive not found' });
    if (drive.collegeId.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    ['title', 'type', 'companyName', 'role', 'department', 'mode', 'venue', 'selectionProcess', 'status'].forEach(f => {
      if (req.body[f] !== undefined) drive[f] = req.body[f];
    });
    if (req.body.minCgpa !== undefined) drive.minCgpa = Number(req.body.minCgpa);
    if (req.body.driveDate) drive.driveDate = new Date(req.body.driveDate);
    if (req.body.deadline) drive.deadline = new Date(req.body.deadline);
    if (req.body.requiredSkills) drive.requiredSkills = Array.isArray(req.body.requiredSkills) ? req.body.requiredSkills : req.body.requiredSkills.split(',').map(s=>s.trim());

    await drive.save();
    res.json({ success: true, message: 'Drive updated', drive: drive.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteCampusDrive(req, res) {
  try {
    const drive = await CampusDrive.findById(req.params.id);
    if (!drive) return res.status(404).json({ success: false, message: 'Drive not found' });
    if (drive.collegeId.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await drive.deleteOne();
    res.json({ success: true, message: 'Drive deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function registerForCampusDrive(req, res) {
  try {
    const drive = await CampusDrive.findById(req.params.id);
    if (!drive) return res.status(404).json({ success: false, message: 'Drive not found' });
    if (new Date(drive.deadline) < new Date()) return res.status(400).json({ success: false, message: 'Drive registration deadline has passed' });

    const studentId = req.user._id;
    if (drive.registeredStudents.some(id => id.toString() === studentId.toString())) {
      return res.status(400).json({ success: false, message: 'Already registered for this drive' });
    }

    drive.registeredStudents.push(studentId);
    await drive.save();

    await Notification.create({
      recipientId: studentId,
      type: 'drive',
      title: 'Drive Registration Confirmed',
      message: `You registered for ${drive.companyName} - ${drive.role} drive on ${drive.driveDate ? drive.driveDate.toISOString().split('T')[0] : ''}`,
      link: '/college/drives',
    });

    res.json({ success: true, message: 'Registered for campus drive successfully', drive: drive.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getCollegeEvents(req, res) {
  try {
    const { collegeId, type } = req.query;
    const filter = {};
    if (collegeId) filter.collegeId = collegeId;
    if (type && type !== 'all') filter.type = type;

    const events = await CollegeEvent.find(filter).sort({ eventDate: 1 });
    res.json({ success: true, events: events.map(e => e.toPublicJSON()) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function createCollegeEvent(req, res) {
  try {
    const { title, type, description, eventDate, time, location, targetDepartment, registrationLink, speakers } = req.body;
    const event = await CollegeEvent.create({
      title,
      type: type || 'workshop',
      description,
      eventDate: new Date(eventDate),
      time: time || '10:00 AM',
      location: location || 'Auditorium / Online',
      collegeId: req.user._id,
      targetDepartment: targetDepartment || 'All',
      registrationLink: registrationLink || '',
      speakers: Array.isArray(speakers) ? speakers : (speakers ? speakers.split(',').map(s=>s.trim()) : []),
    });

    res.status(201).json({ success: true, message: 'Event created successfully', event: event.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteCollegeEvent(req, res) {
  try {
    const event = await CollegeEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.collegeId.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await event.deleteOne();
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getCollegeStats,
  getCollegeStudents,
  getCampusDrives,
  createCampusDrive,
  updateCampusDrive,
  deleteCampusDrive,
  registerForCampusDrive,
  getCollegeEvents,
  createCollegeEvent,
  deleteCollegeEvent,
};
