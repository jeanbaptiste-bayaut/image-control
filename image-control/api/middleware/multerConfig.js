import { log } from 'console';
import multer from 'multer';
import path from 'path';

// Multer configuration
const storage = multer.diskStorage({
  // Destination to store csv file
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

// Validate file type
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only CSV is allowed!'), false);
  }
};

// Init Upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB
});

export default upload;
