const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads', 'resumes')),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `resume-${unique}${path.extname(file.originalname) || '.pdf'}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  cb(allowed.includes(path.extname(file.originalname).toLowerCase()) ? null : new Error('Only PDF, DOC, and DOCX files are allowed'), allowed.includes(path.extname(file.originalname).toLowerCase()));
};

const uploadResume = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { uploadResume };
