import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Article,
  Add,
  Person,
  Logout,
  Login,
  PersonAdd,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const menuItems = [
    { text: '首页', icon: <Home />, path: '/' },
    { text: '所有文章', icon: <Article />, path: '/articles' },
  ];

  if (user) {
    menuItems.push({ text: '写文章', icon: <Add />, path: '/create' });
  }

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem
          button
          key={item.text}
          component={RouterLink}
          to={item.path}
          onClick={handleDrawerToggle}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
      <Divider />
      {user ? (
        <>
          <ListItem
            button
            component={RouterLink}
            to="/profile"
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>
              <Avatar
                src={user.avatar}
                alt={user.username}
                sx={{ width: 24, height: 24 }}
              />
            </ListItemIcon>
            <ListItemText primary={user.username} />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="退出登录" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem
            button
            component={RouterLink}
            to="/login"
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>
              <Login />
            </ListItemIcon>
            <ListItemText primary="登录" />
          </ListItem>
          <ListItem
            button
            component={RouterLink}
            to="/register"
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>
              <PersonAdd />
            </ListItemIcon>
            <ListItemText primary="注册" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: '#24292e' }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 600,
          }}
        >
          Blog
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={RouterLink}
                to={item.path}
                startIcon={item.icon}
              >
                {item.text}
              </Button>
            ))}
            {user ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: 'inherit' }}>
                    {user.username}
                  </Typography>
                  <IconButton
                    onClick={handleMenu}
                    sx={{ ml: 1 }}
                  >
                    <Avatar
                      src={user.avatar}
                      alt={user.username}
                      sx={{ width: 32, height: 32 }}
                    />
                  </IconButton>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 180,
                    },
                  }}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleClose}
                  >
                    <Person sx={{ mr: 1 }} /> 个人资料
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} /> 退出登录
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  startIcon={<Login />}
                >
                  登录
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                  startIcon={<PersonAdd />}
                >
                  注册
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: 240,
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 