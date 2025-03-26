import express from 'express';
import { auth } from '../middleware/auth';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
} from '../controllers/postController';

const router = express.Router();

// 公开路由
router.get('/', getPosts);
router.get('/:id', getPost);

// 需要认证的路由
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/comments', auth, addComment);

export default router; 