import React from 'react';
import { Paper, Box, Typography, Divider } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useComplaints } from '../../contexts/ComplaintContext';

const WelcomeMessage: React.FC = () => {
  const { user } = useAuth();
  const { getAllComplaints } = useComplaints();
  const allComplaints = getAllComplaints();

  // Get current time of day
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get current date
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 4, 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'start', sm: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {getTimeOfDay()}, {user?.firstName}!
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            {getCurrentDate()}
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          bgcolor: 'rgba(255, 255, 255, 0.1)', 
          p: 1.5, 
          borderRadius: 2,
          backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {allComplaints.filter(c => c.status === 'Pending').length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Pending
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {allComplaints.filter(c => c.status === 'In Progress').length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              In Progress
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {allComplaints.filter(c => c.status === 'Resolved').length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Resolved
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default WelcomeMessage; 