require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const profileRoutes = require('./routes/profileRoutes');
const trendingRoutes = require('./routes/trendingRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware – parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS – allow frontend (with credentials for cookies/sessions)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Session middleware – stores login in cookie + MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'skillsync_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// Serve uploaded files (resumes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);

// AI routes - communicates with Django backend
app.use('/api/ai', aiRoutes);

// Student profile routes
app.use('/api/users/profile', profileRoutes);

// Trending Skills routes
app.use('/api', trendingRoutes);

// Statistics routes (college + company dashboards)
app.use('/api', statisticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SkillSync API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler (e.g. Multer errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`SkillSync server running on http://localhost:${PORT}`);
});
