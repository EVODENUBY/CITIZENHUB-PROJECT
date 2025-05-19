import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import AuthDialog from '../components/AuthDialog';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const featuresRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(user?.isAdmin ? '/admin' : '/dashboard');
    } else {
      setAuthDialogOpen(true);
    }
  };

  const handleLearnMore = () => {
    featuresRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          pt: { xs: 6, md: 12 },
          pb: { xs: 8, md: 16 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                textAlign: { xs: 'center', md: 'left' },
                maxWidth: { md: '600px' }
              }}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    lineHeight: 1.2,
                  }}
                >
                  Your Voice Matters
                </Typography>
                <Typography
                  variant="h5"
                  paragraph
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                    maxWidth: '800px',
                    mx: { xs: 'auto', md: 0 },
                  }}
                >
                  Connect with your local government and make a difference in your community
                  through our efficient complaint and feedback system.
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGetStarted}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                      },
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleLearnMore}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.9)',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                    }}
                    endIcon={<InfoIcon />}
                  >
                    Learn More
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/citizen-feedback.svg"
                alt="Citizens Giving Feedback"
                sx={{
                  width: '100%',
                  maxWidth: { xs: '400px', sm: '500px', md: '600px', lg: '700px' },
                  height: 'auto',
                  filter: 'drop-shadow(5px 5px 10px rgba(0,0,0,0.2))',
                  animation: 'float 6s ease-in-out infinite',
                  mx: 'auto',
                  display: 'block',
                  '@keyframes float': {
                    '0%, 100%': {
                      transform: 'translateY(0)',
                    },
                    '50%': {
                      transform: 'translateY(-20px)',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FFEATURES SECTION*/}
      <Box ref={featuresRef} sx={{ py: 8, scrollMarginTop: '64px' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ 
              mb: 6,
              opacity: 0,
              animation: 'fadeIn 0.5s ease-out forwards',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            Why Choose Us?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} lg={4}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Typography variant="h5" gutterBottom color="primary">
                  Easy to Use
                </Typography>
                <Typography color="text.secondary">
                  Submit and track your complaints with our intuitive interface.
                  No technical expertise required.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Typography variant="h5" gutterBottom color="primary">
                  Real-time Updates
                </Typography>
                <Typography color="text.secondary">
                  Stay informed with instant notifications and status updates
                  on your complaints.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Typography variant="h5" gutterBottom color="primary">
                  Secure & Private
                </Typography>
                <Typography color="text.secondary">
                  Your data is protected with state-of-the-art security measures.
                  Your privacy is our priority.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <AuthDialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </Box>
  );
};

export default Home; 