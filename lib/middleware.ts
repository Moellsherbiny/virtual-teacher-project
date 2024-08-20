// lib/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import multer from 'multer';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing so we can handle it ourselves
  },
};

// Configure multer for file storage with date-based naming
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '');
    cb(null, `${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('File is not an image'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});

export const runMiddleware = (
  req: NextRequest,
  res: NextResponse,
  fn: Function
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export const uploadMiddleware = upload.single('file');
