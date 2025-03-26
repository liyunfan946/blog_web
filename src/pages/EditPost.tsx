import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { postApi } from '../services/api';

interface Post {
  title: string;
  content: string;
  excerpt: string;
  image: string;
}

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post>({
    title: '',
    content: '',
    excerpt: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postApi.getPost(id!);
        const { title, content, excerpt, image } = response.data;
        setPost({ title, content, excerpt, image });
      } catch (err) {
        setError('获取文章失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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
      await postApi.updatePost(id!, post);
      navigate(`/post/${id}`);
    } catch (err) {
      setError('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          编辑文章
        </Typography>

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
              {saving ? '保存中...' : '保存'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/post/${id}`)}
            >
              取消
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditPost; 