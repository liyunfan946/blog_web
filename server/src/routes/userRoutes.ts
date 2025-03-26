import express from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth';
import {
  register,
  login,
  updateProfile,
  updateAvatar,
} from '../controllers/userController';

const router = express.Router();
const upload = multer({ dest: process.env.UPLOAD_DIR });

// 公开路由
router.post('/register', register);
router.post('/login', login);

// 需要认证的路由
router.put('/profile', auth, updateProfile);
router.post('/avatar', auth, upload.single('avatar'), updateAvatar);

export default router; 