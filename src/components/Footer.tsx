import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Language as WebIcon,
  YouTube as YouTubeIcon,
  AccessTime as ClockIcon,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: { xs: 4, md: 6 },
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              textAlign: 'center',
              pb: { xs: 3, sm: 0 },
              borderBottom: { xs: '1px solid rgba(255,255,255,0.1)', sm: 'none' }
            }}>
              <Typography variant="h6" gutterBottom>
                CitizenHub
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                 Empowering citizens through efficient communication system
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 1
              }}>
                <ClockIcon />
                <Typography variant="body2"
                sx={{
                  color:"cyan",
                  fontWeight:'bold'
                }}
                >
                  {currentTime.toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              textAlign: 'center',
              pb: { xs: 3, sm: 0 },
              borderBottom: { xs: '1px solid rgba(255,255,255,0.1)', sm: 'none' }
            }}>
              <Typography variant="h6" gutterBottom>
                Connect with Me
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 2,
                '& .MuiIconButton-root': {
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }
              }}>
                <IconButton
                  href="https://github.com/EVODENUBY"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'white' }}
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton
                  href="https://url-shortener.me/PLN"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'white' }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  href="https://www.youtube.com/@EVODENUBY"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'white' }}
                >
                  <YouTubeIcon />
                </IconButton>
                <IconButton
                  href="https://twitter.com/@evodeSTACK"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'white' }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  href="https://evodenuby.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'white' }}
                >
                  <WebIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <Box sx={{ 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1
            }}>
              <Typography variant="h6" gutterBottom>
                Developed by EVODENUBY
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <Link rel="stylesheet" href="mailto:evodenuby@gmail.com" 
                target="_blank"
                sx={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  
                  '&:hover': {
                    textDecoration: 'none',
                     color:"cyan",
                    fontWeight: 'bold',
                    transform: 'scale(1.05)',
                    textShadow: '0 0 8px rgba(255,255,255,0.5)'
                  }
                }}
                > 
              evodenuby@gmail.com
                </Link>
                
                 <Link
                 rel="stylesheet" href="tel:+250791783308"  target="_blank"
                sx={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  paddingLeft:'10px',
                  '&:hover': {
                    textDecoration: 'none',
                    transform: 'scale(1.05)',
                    textShadow: '0 0 8px rgba(255,255,255,0.5)',
                    color:"cyan",
                    fontWeight: 'bold'
                  }
                }}
                 >
                  +250 791 783 308
                </Link>
              </Typography>
              <Link
                href="https://evodenuby.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    textDecoration: 'none',
                    transform: 'scale(1.05)',
                    textShadow: '0 0 8px rgba(255,255,255,0.5)'
                  }
                }}
              >
                Visit My Portfolio
              </Link>
              
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                © {new Date().getFullYear()} All rights reserved
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer; 