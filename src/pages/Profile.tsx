import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, updateProfile, updateAvatar } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile({ username, bio });
      setSuccess('个人资料更新成功');
    } catch (err) {
      setError('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateAvatar(file);
      setSuccess('头像更新成功');
    } catch (err) {
      setError('头像更新失败');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container>
        <Typography>请先登录</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          个人资料
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={user.avatar}
              alt={user.username}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Button
              variant="outlined"
              component="label"
              disabled={loading}
            >
              更换头像
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="个人简介"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              margin="normal"
              multiline
              rows={4}
            />

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            {success && (
              <Typography color="success.main" sx={{ mt: 2 }}>
                {success}
              </Typography>
            )}

            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                保存修改
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 