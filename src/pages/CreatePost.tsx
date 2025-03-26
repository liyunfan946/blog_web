import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { postApi } from '../services/api';

interface Post {
  title: string;
  content: string;
  excerpt: string;
  image: string;
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState<Post>({
    title: '',
    content: '',
    excerpt: '',
    image: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSaving(true);
      const response = await postApi.createPost(post);
      navigate(`/post/${response.data._id}`);
    } catch (err) {
      setError('创建文章失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          写文章
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="标题"
            name="title"
            value={post.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="摘要"
            name="excerpt"
            value={post.excerpt}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={2}
            required
          />

          <TextField
            fullWidth
            label="封面图片URL"
            name="image"
            value={post.image}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="内容"
            name="content"
            value={post.content}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={10}
            required
          />

          <Box display="flex" gap={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving}
            >
              {saving ? '发布中...' : '发布'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              取消
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePost; 