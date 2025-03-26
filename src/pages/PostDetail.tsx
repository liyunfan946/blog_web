import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Favorite, FavoriteBorder, Delete, Edit } from '@mui/icons-material';
import { postApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  _id: string;
  content: string;
  user: {
    username: string;
    avatar: string;
  };
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postApi.getPost(id!);
        setPost(response.data);
        setIsLiked(response.data.likes.includes(user?._id));
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
      setPost((prev) => {
        if (!prev) return null;
        const newLikes = isLiked
          ? prev.likes.filter((likeId) => likeId !== user._id)
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
    if (!window.confirm('确定要删除这篇文章吗？')) return;

    try {
      await postApi.deletePost(id!);
      navigate('/');
    } catch (err) {
      setError('删除失败');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error || '文章不存在'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar src={post.author.avatar} sx={{ mr: 2 }} />
          <Box>
            <Typography variant="subtitle1">{post.author.username}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          {user?._id === post.author._id && (
            <Box ml="auto">
              <IconButton onClick={() => navigate(`/edit-post/${id}`)}>
                <Edit />
              </IconButton>
              <IconButton onClick={handleDelete} color="error">
                <Delete />
              </IconButton>
            </Box>
          )}
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>

        <Box
          component="img"
          src={post.image}
          alt={post.title}
          sx={{
            width: '100%',
            maxHeight: 400,
            objectFit: 'cover',
            borderRadius: 1,
            mb: 3,
          }}
        />

        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>

        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={handleLike}>
            {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {post.likes.length} 喜欢
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
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
            color="primary"
            disabled={!comment.trim()}
          >
            发表评论
          </Button>
        </Box>

        {post.comments.map((comment) => (
          <Box key={comment._id} sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar src={comment.user.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
              <Typography variant="subtitle2">{comment.user.username}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography variant="body2">{comment.content}</Typography>
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default PostDetail; 