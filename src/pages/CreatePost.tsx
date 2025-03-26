import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import { postApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await postApi.createPost({
        title,
        content,
        excerpt,
        image,
      });
      navigate('/');
    } catch (err) {
      setError('发布文章失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          发布新文章
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="摘要"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
              margin="normal"
              multiline
              rows={2}
            />

            <TextField
              fullWidth
              label="封面图片URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="内容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              margin="normal"
              multiline
              rows={10}
            />

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                发布
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
              >
                取消
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreatePost; 