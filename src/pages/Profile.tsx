import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Grid,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const Profile = () => {
  const [formData, setFormData] = useState({
    username: '示例用户',
    email: 'example@example.com',
    bio: '这是一段个人简介...',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现更新个人资料逻辑
    console.log('更新信息：', { ...formData, avatar });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} className="p-8 bg-gray-800">
        <Typography variant="h4" component="h1" gutterBottom className="text-white">
          个人资料
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  src={avatarPreview}
                  sx={{ width: 150, height: 150, mb: 2 }}
                  className="bg-gray-700"
                />
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  className="text-white"
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
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="用户名"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                required
                className="bg-gray-700"
              />
              <TextField
                fullWidth
                label="邮箱"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                className="bg-gray-700"
              />
              <TextField
                fullWidth
                label="个人简介"
                name="bio"
                multiline
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                margin="normal"
                className="bg-gray-700"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="mt-4"
              >
                保存修改
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile; 