/**
 * Seed script – populates MongoDB with sample data matching frontend mockData.
 * Run: npm run seed
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected for seeding...');

    await Application.deleteMany({});
    await Opportunity.deleteMany({});
    await User.deleteMany({});

    const password = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      {
        name: 'Alex Student',
        email: 'alex@university.edu',
        password,
        role: 'student',
        phone: '+1 (555) 123-4567',
        bio: 'Passionate computer science student exploring internships and hackathons.',
        location: 'Boston, USA',
      },
      {
        name: 'Tech College',
        email: 'college@edu.com',
        password,
        role: 'college',
      },
      {
        name: 'Innovate Corp',
        email: 'hr@innovate.com',
        password,
        role: 'company',
      },
      {
        name: 'Platform Admin',
        email: 'admin@skillsync.com',
        password: await bcrypt.hash('admin12345', 10),
        role: 'superadmin',
        organization: 'SkillSync',
        phone: '+1 555 0100',
      },
    ]);

    const [student, college, company, admin] = users;

    const opportunities = await Opportunity.insertMany([
      {
        title: 'Summer Internship Program 2026',
        type: 'internship',
        description:
          'Join our 12-week paid internship program working on real-world projects with mentorship from senior engineers.',
        deadline: new Date('2026-08-15'),
        location: 'Hybrid',
        requirements: 'CS student, 3rd year or above, basic React knowledge',
        benefits: 'Stipend, certificate, full-time offer potential',
        organizerId: company._id,
        status: 'open',
        reviewStatus: 'approved',
      },
      {
        title: 'National Hackathon 2026',
        type: 'hackathon',
        description:
          '48-hour hackathon focused on sustainable technology solutions. Teams of 2-4 students.',
        deadline: new Date('2026-06-30'),
        location: 'On-site',
        requirements: 'Valid student ID, team registration',
        benefits: 'Prizes up to $10,000, networking, swag',
        organizerId: college._id,
        status: 'open',
        reviewStatus: 'pending',
      },
      {
        title: 'Frontend Developer - Junior',
        type: 'job',
        description: 'We are hiring junior frontend developers to build responsive web applications using React.',
        deadline: new Date('2026-07-01'),
        location: 'Remote',
        requirements: 'React, HTML, CSS, Git',
        benefits: 'Health insurance, flexible hours',
        organizerId: company._id,
        status: 'open',
        reviewStatus: 'approved',
      },
      {
        title: 'Career Fair 2026',
        type: 'event',
        description:
          'Annual career fair connecting students with 50+ employers from tech, finance, and healthcare.',
        deadline: new Date('2026-05-10'),
        location: 'Campus Hall A',
        requirements: 'Open to all students',
        benefits: 'Direct recruiter access, workshops',
        organizerId: college._id,
        status: 'closed',
        reviewStatus: 'approved',
      },
    ]);

    const [opp1, opp2, opp3] = opportunities;

    await Application.insertMany([
      {
        opportunityId: opp1._id,
        studentId: student._id,
        status: 'applied',
        appliedAt: new Date('2026-01-18'),
        applicantDetails: {
          fullName: 'Alex Student',
          email: 'alex@university.edu',
          phone: '+1 (555) 123-4567',
          university: 'State University',
          course: 'B.Tech Computer Science',
          year: '3rd Year',
          resume: 'alex_resume.pdf',
          coverLetter: 'I am passionate about software development and eager to contribute to real-world projects.',
          linkedin: 'linkedin.com/in/alexstudent',
        },
      },
      {
        opportunityId: opp2._id,
        studentId: student._id,
        status: 'reviewed',
        appliedAt: new Date('2026-01-22'),
        applicantDetails: {
          fullName: 'Alex Student',
          email: 'alex@university.edu',
          phone: '+1 (555) 123-4567',
          university: 'State University',
          course: 'B.Tech Computer Science',
          year: '3rd Year',
          resume: 'alex_resume.pdf',
          coverLetter: 'Our team is excited to participate in the hackathon.',
          linkedin: 'linkedin.com/in/alexstudent',
        },
      },
      {
        opportunityId: opp3._id,
        studentId: student._id,
        status: 'accepted',
        appliedAt: new Date('2026-02-01'),
        applicantDetails: {
          fullName: 'Alex Student',
          email: 'alex@university.edu',
          phone: '+1 (555) 123-4567',
          university: 'State University',
          course: 'B.Tech Computer Science',
          year: '3rd Year',
          resume: 'alex_resume.pdf',
          coverLetter: 'I have hands-on React experience and would love to join your frontend team.',
          linkedin: 'linkedin.com/in/alexstudent',
        },
      },
    ]);

    console.log('Seed completed!');
    console.log('Demo logins (password in parentheses):');
    console.log('  Student:  alex@university.edu (password123)');
    console.log('  College:  college@edu.com (password123)');
    console.log('  Company:  hr@innovate.com (password123)');
    console.log('  Admin:    admin@skillsync.com (admin12345)');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
