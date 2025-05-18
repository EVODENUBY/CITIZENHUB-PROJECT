import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useScrollTrigger,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Create as CreateIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  ConnectWithoutContact as LogoIcon,
  Login as LoginIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import AuthDialog from './AuthDialog';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect scroll for navbar transparency
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleEditProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  // Check if the current route matches
  const isActiveRoute = (path: string) => location.pathname === path;

  const handleMobileMenuClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const mobileMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Submit Complaint', icon: <CreateIcon />, path: '/submit' },
    { text: 'Track Complaint', icon: <SearchIcon />, path: '/track' },
    ...(user?.isAdmin ? [{ text: 'Admin Dashboard', icon: <AdminIcon />, path: '/admin' }] : []),
  ];

  const renderMobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{
        sx: {
          width: 240,
          bgcolor: 'background.default',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <LogoIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
            CitizenHub
          </Typography>
        </Box>
        <Divider />
        {isAuthenticated ? (
          <>
            <Box sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
            <List>
              {mobileMenuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => handleMobileMenuClick(item.path)}
                    selected={isActiveRoute(item.path)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleMobileMenuClick('/profile')}>
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText primary="Edit Profile" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon><LogoutIcon /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        ) : (
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthDialogOpen(true);
              }}
              startIcon={<LoginIcon />}
            >
              Login / Register
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={trigger ? 4 : 0}
      sx={{
        bgcolor: trigger ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease-in-out',
        borderBottom: trigger ? 1 : 0,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            flexGrow: 1,
            textDecoration: 'none',
            color: trigger ? 'primary.main' : 'white',
          }}
          component={RouterLink}
          to="/"
        >
          <LogoIcon sx={{ 
            fontSize: 32,
            color: trigger ? 'primary.main' : 'white',
            filter: trigger ? 'none' : 'drop-shadow(0px 2px 4px rgba(0,0,0,0.25))',
          }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              background: trigger ? 'none' : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              WebkitBackgroundClip: trigger ? 'none' : 'text',
              WebkitTextFillColor: trigger ? 'inherit' : 'transparent',
              textShadow: trigger ? 'none' : '0px 2px 4px rgba(0,0,0,0.25)',
            }}
          >
            CitizenHub
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated ? (
            <>
              {isMobile ? (
                <IconButton
                  color={trigger ? 'primary' : 'inherit'}
                  onClick={() => setMobileMenuOpen(true)}
                  sx={{
                    mr: 1,
                  }}
                >
                  <MenuIcon />
                </IconButton>
              ) : (
                <>
                  <Tooltip title="Dashboard">
                    <Button
                      color={trigger ? 'primary' : 'inherit'}
                      component={RouterLink}
                      to="/dashboard"
                      startIcon={<DashboardIcon />}
                      sx={{
                        bgcolor: isActiveRoute('/dashboard') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        color: trigger ? 'primary.main' : 'white',
                        textShadow: trigger ? 'none' : '0px 2px 4px rgba(0,0,0,0.25)',
                        '&:hover': {
                          bgcolor: trigger ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    >
                      Dashboard
                    </Button>
                  </Tooltip>

                  <Tooltip title="Submit Complaint">
                    <Button
                      color={trigger ? 'primary' : 'inherit'}
                      component={RouterLink}
                      to="/submit"
                      startIcon={<CreateIcon />}
                      sx={{
                        bgcolor: isActiveRoute('/submit') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        color: trigger ? 'primary.main' : 'white',
                        textShadow: trigger ? 'none' : '0px 2px 4px rgba(0,0,0,0.25)',
                        '&:hover': {
                          bgcolor: trigger ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    >
                      Submit
                    </Button>
                  </Tooltip>

                  <Tooltip title="Track Complaint">
                    <Button
                      color={trigger ? 'primary' : 'inherit'}
                      component={RouterLink}
                      to="/track"
                      startIcon={<SearchIcon />}
                      sx={{
                        bgcolor: isActiveRoute('/track') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        color: trigger ? 'primary.main' : 'white',
                        textShadow: trigger ? 'none' : '0px 2px 4px rgba(0,0,0,0.25)',
                        '&:hover': {
                          bgcolor: trigger ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    >
                      Track
                    </Button>
                  </Tooltip>

                  {user?.isAdmin && (
                    <Tooltip title="Admin Dashboard">
                      <Button
                        color={trigger ? 'primary' : 'inherit'}
                        component={RouterLink}
                        to="/admin"
                        startIcon={<AdminIcon />}
                        sx={{
                          bgcolor: isActiveRoute('/admin') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                          color: trigger ? 'primary.main' : 'white',
                          textShadow: trigger ? 'none' : '0px 2px 4px rgba(0,0,0,0.25)',
                          '&:hover': {
                            bgcolor: trigger ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.2)',
                          },
                        }}
                      >
                        Admin
                      </Button>
                    </Tooltip>
                  )}
                </>
              )}

              <Tooltip title="Account Settings">
                <IconButton 
                  onClick={handleMenuOpen} 
                  size="small" 
                  sx={{ 
                    ml: 1,
                    bgcolor: trigger ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      bgcolor: trigger ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 32, sm: 35 },
                      height: { xs: 32, sm: 35 },
                      bgcolor: 'secondary.main',
                      transition: 'transform 0.2s',
                      boxShadow: trigger ? 'none' : '0px 2px 4px rgba(0,0,0,0.25)',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    borderRadius: 2,
                  }
                }}
              >
                <MenuItem onClick={handleEditProfile}>
                  <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                  Edit Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color={trigger ? 'primary' : 'inherit'}
              onClick={() => setAuthDialogOpen(true)}
              startIcon={<LoginIcon />}
              variant="outlined"
              sx={{
                borderColor: trigger ? 'primary.main' : 'white',
                color: trigger ? 'primary.main' : 'white',
                textShadow: trigger ? 'none' : '0px 2px 4px rgba(0,0,0,0.25)',
                '&:hover': {
                  borderColor: trigger ? 'primary.dark' : 'white',
                  bgcolor: trigger ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              Login / Register
            </Button>
          )}
        </Box>
      </Toolbar>
      {renderMobileDrawer()}
      <AuthDialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </AppBar>
  );
};

export default Navbar; 