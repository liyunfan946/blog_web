import { Request, Response } from 'express';
import Post from '../models/Post';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, image } = req.body;
    const author = req.user._id;

    const post = new Post({
      title,
      content,
      excerpt,
      image,
      author,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar');
    
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, image } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '没有权限修改此文章' });
    }

    post.title = title;
    post.content = content;
    post.excerpt = excerpt;
    post.image = image;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '没有权限删除此文章' });
    }

    await post.remove();
    res.json({ message: '文章已删除' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);
    if (likeIndex === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    post.comments.push({
      user: req.user._id,
      content,
    });

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
}; 