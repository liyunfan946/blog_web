import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';

dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 路由
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// 数据库连接
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch((error) => {
    console.error('数据库连接失败:', error);
  });

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器错误' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 