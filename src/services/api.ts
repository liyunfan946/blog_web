import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 用户相关API
export const userApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/users/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: { username?: string; bio?: string }) =>
    api.put('/users/profile', data),
  updateAvatar: (formData: FormData) =>
    api.put('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

// 文章相关API
export const postApi = {
  getPosts: () => api.get('/posts'),
  getPost: (id: string) => api.get(`/posts/${id}`),
  createPost: (data: any) => api.post('/posts', data),
  updatePost: (id: string, data: any) => api.put(`/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  likePost: (id: string) => api.post(`/posts/${id}/like`),
  addComment: (id: string, data: { content: string }) =>
    api.post(`/posts/${id}/comments`, data),
};

export default api; 