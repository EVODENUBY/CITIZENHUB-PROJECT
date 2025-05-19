import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  NotificationsActive as NotificationIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Timeline as TimelineIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  PriorityHigh as HighPriorityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../contexts/AuthContext';
import { useComplaints } from '../contexts/ComplaintContext';
import { useAnnouncements } from '../contexts/AnnouncementContext';
import { format } from 'date-fns';
import Chatbot from '../components/user/Chatbot';

// TEST ANNOUNCEMENT ON USER DASHBOARD (TO BE UPDATED WITH REAL TIME FROM ADMIN)
const announcements = [
  {
    id: 1,
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Sunday, 24th JUNE 2025',
    date: '2025-05-19',
  },
  {
    id: 2,
    title: 'New Feature Release',
    message: 'Track your complaints in real-time!',
    date: '2025-05-18',
  },
];

// TESTIMONIALS
const testimonials = [
  {
    id: 1,
    name: "Evode MUYISINGIZE",
    role: "Software Engineer | Community Member",
    comment: "CitizenHub has made it so much easier to report issues in our community. The response time is Best!",
    avatar: "/images/testimonials/person1.jpg"
  },
  {
    id: 2,
    name: "Adolphe NAYITURIKI",
    role: "Student |Software Engineer",
    comment: "As a Student of UR, I appreciate how efficiently the platform handles our concerns. Great communication system!",
    avatar: "/images/testimonials/person2.jpg"
  },
  {
    id: 3,
    name: "Evode sano",
    role: "Local Citizen",
    comment: "This platform has transformed how we interact with local authorities. It's user-friendly and effective.",
    avatar: "/images/testimonials/person3.jpg"
  }
];

const StatCard = ({ title, value, icon: Icon, color }: any) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Card ref={ref} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ color: color, mr: 1 }} />
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" color={color}>
          {typeof value === 'number' && inView ? (
            <CountUp end={value} duration={2.5} />
          ) : (
            value
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserComplaints, refreshComplaints } = useComplaints();
  const { getActiveAnnouncements } = useAnnouncements();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State for status alert
  const [statusAlert, setStatusAlert] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
    complaintId: string; // Add this to track which complaint triggered the alert
  }>({
    open: false,
    message: '',
    severity: 'info',
    complaintId: ''
  });

  const userComplaints = getUserComplaints();
  const activeAnnouncements = getActiveAnnouncements();

  // TO MONITOR THE STATUS OF THE LAST COMPLAINT
  useEffect(() => {
    const lastComplaint = userComplaints[0];
    if (lastComplaint && lastComplaint.id !== statusAlert.complaintId) {
      const status = lastComplaint.status;
      const message = `Complaint "${lastComplaint.title}" has been ${status.toLowerCase()}`;
      setStatusAlert({
        open: true,
        message,
        severity: status === 'Resolved' ? 'success' : 'info',
        complaintId: lastComplaint.id
      });

      // TO CLOSE ALERT AFTER 3 SECONDS
      const timer = setTimeout(() => {
        setStatusAlert(prev => ({ ...prev, open: false }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [userComplaints, statusAlert.complaintId]);

  // HANDLE CLOSING ALERT
  const handleCloseAlert = () => {
    setStatusAlert(prev => ({ ...prev, open: false }));
  };

  // TO CHECK USER DATA
  useEffect(() => {
    console.log('User data:', user);
    console.log('Complaints:', userComplaints);
  }, [user, userComplaints]);

  const stats = useMemo(() => {
    return {
      total: userComplaints.length,
      resolved: userComplaints.filter(c => c.status === 'Resolved').length,
      pending: userComplaints.filter(c => c.status === 'Pending').length,
      inProgress: userComplaints.filter(c => c.status === 'In Progress').length,
    };
  }, [userComplaints]);

  const recentComplaints = useMemo(() => {
    return userComplaints
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [userComplaints]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Pending':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <HighPriorityIcon sx={{ color: 'error.main' }} />;
      case 'medium':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'low':
        return <InfoIcon sx={{ color: 'info.main' }} />;
      default:
        return <InfoIcon sx={{ color: 'info.main' }} />;
    }
  };

  // Add refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshComplaints();
    setTimeout(() => setIsRefreshing(false), 1000); // ANIMATE REFRESH 1 SECONDS
  };

  // AUTO REFRESH COMPLAINTS EVERY 5 SECONDS
  useEffect(() => {
    const interval = setInterval(() => {
      refreshComplaints();
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshComplaints]);

  // IF NO USER DATA, SHOW LOADING
  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.primary">
          Loading user data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {/* WELCOME */}
        <Paper 
          elevation={2}
          sx={{ 
            p: 4, 
            mb: 4, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center', 
            gap: 4,
            borderRadius: 2,
          }}
        >
          <Avatar
            src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=200`}
            sx={{ 
              width: { xs: 100, md: 120 }, 
              height: { xs: 100, md: 120 },
              border: '4px solid white',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            }}
          >
            {user.firstName?.[0]}{user.lastName?.[0]}
          </Avatar>

          <Box sx={{ flex: 1, width: '100%' }}>
            <Typography 
              variant="h4" 
              gutterBottom
              color="text.primary"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Welcome , {user.firstName} {user.lastName}!
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    borderRadius: 2,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
                    Email Address
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user.email}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    bgcolor: 'secondary.main', 
                    color: 'white',
                    borderRadius: 2,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
                    Account Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user.isAdmin ? 'Admin Account' : 'Citizen'}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    bgcolor: 'success.main', 
                    color: 'white',
                    borderRadius: 2,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
                    Total Complaints
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {stats.total}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* QUICK ACTIONS */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate('/submit')}
            >
              Submit New Complaint
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<SearchIcon />}
              onClick={() => navigate('/track')}
            >
              Track Complaints
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<RefreshIcon sx={{ 
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
              }} />}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              Refresh Data
            </Button>
          </Grid>
        </Grid>

        {/* STATISTICS CARDS */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Complaints"
              value={stats.total}
              icon={AssignmentIcon}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Resolved"
              value={stats.resolved}
              icon={CheckCircleIcon}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon={TimelineIcon}
              color="warning.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending"
              value={stats.pending}
              icon={PendingIcon}
              color="error.main"
            />
          </Grid>
        </Grid>

        {/* ANNOUNCEMENT SECTION, IF EXISTS */}
        {activeAnnouncements.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="h2">
                Latest Announcements
              </Typography>
            </Box>
            <List>
              {activeAnnouncements.map((announcement, index) => (
                <React.Fragment key={announcement.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemAvatar>
                      {getPriorityIcon(announcement.priority)}
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                          {announcement.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.primary" sx={{ my: 1 }}>
                            {announcement.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Posted on {format(announcement.createdAt, 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      size="small"
                      label={announcement.priority.toUpperCase()}
                      color={
                        announcement.priority === 'high'
                          ? 'error'
                          : announcement.priority === 'medium'
                          ? 'warning'
                          : 'info'
                      }
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                  {index < activeAnnouncements.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}

        {/* RECENT COMPLAINTS */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Recent Complaints
              </Typography>
              <List>
                {recentComplaints.map((complaint) => (
                  <React.Fragment key={complaint.id}>
                    <ListItem
                      sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <AssignmentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={complaint.title}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {complaint.category}
                            </Typography>
                            {` - ${format(new Date(complaint.createdAt), 'MMM dd, yyyy')}`}
                            {complaint.adminNotes && (
                              <Box sx={{ mt: 1, bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Admin Response: {complaint.adminNotes}
                                </Typography>
                              </Box>
                            )}
                          </React.Fragment>
                        }
                      />
                      <Chip
                        label={complaint.status}
                        color={getStatusColor(complaint.status) as any}
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" sx={{ my: 1 }} />
                  </React.Fragment>
                ))}
                {recentComplaints.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No complaints submitted yet"
                      secondary="Click 'Submit New Complaint' to get started"
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* TESTIMONIALS*/}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
            What Citizens Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial) => (
              <Grid item xs={12} md={4} key={testimonial.id}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 5,
                    },
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <Avatar
                      src={testimonial.avatar}
                      sx={{
                        width: 64,
                        height: 64,
                        border: '4px solid white',
                        boxShadow: 2,
                      }}
                    />
                  </Box>
                  <Box sx={{ pt: 4 }}>
                    <Typography
                      variant="body1"
                      paragraph
                      sx={{
                        fontStyle: 'italic',
                        color: 'text.secondary',
                        textAlign: 'center',
                        mb: 2,
                      }}
                    >
                      "{testimonial.comment}"
                    </Typography>
                    <Box sx={{ mt: 'auto', textAlign: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* STATUS UPDATE*/}
      <Snackbar
        open={statusAlert.open}
        autoHideDuration={2000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 6 }} // TOP MARGIN
      >
        <Alert 
          onClose={handleCloseAlert}
          severity={statusAlert.severity}
          sx={{ width: '100%' }}
          elevation={6}
        >
          {statusAlert.message}
        </Alert>
      </Snackbar>

      <Chatbot />
    </Box>
  );
};

export default UserDashboard; 