import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { JWT_SECRET } from '../config';

// 用户注册
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: '用户名或邮箱已被使用' });
    }

    // 创建新用户
    const user = new User({
      username,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`, // 使用用户名作为种子生成独特头像
    });

    await user.save();

    // 生成 JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // 返回用户信息（不包含密码）
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
    };

    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

// 用户登录
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 生成 JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // 返回用户信息（不包含密码）
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
    };

    res.json({ user: userResponse, token });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取用户资料
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新用户资料
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { username, bio } = req.body;
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    if (username) {
      // 检查用户名是否已被使用
      const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ message: '用户名已被使用' });
      }
      user.username = username;
      // 更新头像（使用新的用户名作为种子）
      user.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    }

    if (bio) {
      user.bio = bio;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const avatar = req.file?.path;

    if (!avatar) {
      return res.status(400).json({ message: '请上传头像' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
}; 