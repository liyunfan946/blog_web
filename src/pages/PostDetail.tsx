import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Avatar,
  Divider,
  Paper,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Share,
  Edit,
  Delete,
} from '@mui/icons-material';
import { postApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postApi.getPost(id!);
        setPost(response.data);
        setIsLiked(response.data.likes.includes(user?._id || ''));
      } catch (err) {
        setError('获取文章失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user?._id]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await postApi.likePost(id!);
      setPost(prev => {
        if (!prev) return null;
        const newLikes = isLiked
          ? prev.likes.filter(likeId => likeId !== user._id)
          : [...prev.likes, user._id];
        return { ...prev, likes: newLikes };
      });
      setIsLiked(!isLiked);
    } catch (err) {
      setError('操作失败');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await postApi.addComment(id!, { content: comment });
      setPost(response.data);
      setComment('');
    } catch (err) {
      setError('评论失败');
    }
  };

  const handleDelete = async () => {
    if (!user || !post || post.author._id !== user._id) return;

    try {
      await postApi.deletePost(id!);
      navigate('/');
    } catch (err) {
      setError('删除文章失败');
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>加载中...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <Typography>文章不存在</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              {post.title}
            </Typography>
            {user && post.author._id === user._id && (
              <Box>
                <IconButton
                  onClick={() => navigate(`/edit/${post._id}`)}
                  sx={{ mr: 1 }}
                >
                  <Edit />
                </IconButton>
                <IconButton onClick={handleDelete} color="error">
                  <Delete />
                </IconButton>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={post.author.avatar}
              alt={post.author.username}
              sx={{ mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {post.author.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Box
            component="img"
            src={post.image}
            alt={post.title}
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 1,
              mb: 3,
            }}
          />

          <Typography
            variant="body1"
            paragraph
            sx={{
              lineHeight: 1.8,
              '& p': { mb: 3 },
              '& img': { maxWidth: '100%', height: 'auto' },
            }}
          >
            {post.content}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              startIcon={isLiked ? <Favorite /> : <FavoriteBorder />}
              onClick={handleLike}
              color={isLiked ? 'primary' : 'default'}
            >
              {post.likes.length} 喜欢
            </Button>
            <Button startIcon={<Comment />}>
              {post.comments.length} 评论
            </Button>
            <Button startIcon={<Share />}>分享</Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            评论 ({post.comments.length})
          </Typography>

          <Box component="form" onSubmit={handleComment} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="写下你的评论..."
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!comment.trim()}
            >
              发表评论
            </Button>
          </Box>

          {post.comments.map((comment) => (
            <Box key={comment._id} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar
                  src={comment.user.avatar}
                  alt={comment.user.username}
                  sx={{ mr: 1 }}
                />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    {comment.user.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  pl: 7,
                  '& p': { mb: 0 },
                }}
              >
                {comment.content}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};

export default PostDetail; 