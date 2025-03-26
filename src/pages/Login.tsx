import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现登录逻辑
    console.log('登录信息：', formData);
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} className="p-8 bg-gray-800">
        <Typography variant="h4" component="h1" gutterBottom className="text-white">
          登录
        </Typography>
        <form onSubmit={handleSubmit}>
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
            label="密码"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            className="bg-gray-700"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="mt-6"
          >
            登录
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2" className="text-gray-400">
            还没有账号？
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/register')}
              className="text-blue-400 ml-1"
            >
              立即注册
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 