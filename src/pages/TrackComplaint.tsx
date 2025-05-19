import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  Paper,
  Chip,
  Grid,
} from '@mui/material';
import { useComplaints } from '../contexts/ComplaintContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const steps = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];

const TrackComplaint: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');
  const { getComplaintById } = useComplaints();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const complaint = getComplaintById(trackingId);

    if (!complaint) {
      setError('Complaint not found. Please check the ID and try again.');
      return;
    }

    //VERIFY IF USER OWNS THE COMPLAINT, OR IS ADMIN
    if (!user?.isAdmin && complaint.userId !== user?.id) {
      setError('You do not have permission to view this complaint.');
      return;
    }
  };

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

  const complaint = trackingId ? getComplaintById(trackingId) : null;
  const hasAccess = complaint && (user?.isAdmin || complaint.userId === user?.id);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Track Your Complaint
        </Typography>
        
        <Box component="form" onSubmit={handleSearch} sx={{ mt: 3, mb: 4 }}>
          <TextField
            fullWidth
            label="Complaint ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            required
            placeholder="Enter your complaint ID (e.g., complaint-001)"
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Track Complaint
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {complaint && hasAccess && (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Box sx={{ mb: 4 }}>
                <Typography variant="overline" color="text.secondary">
                  Complaint ID
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {complaint.id}
                </Typography>

                <Typography variant="overline" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {complaint.title}
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="overline" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body1">
                      {complaint.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="overline" color="text.secondary">
                      Priority
                    </Typography>
                    <Chip
                      label={complaint.priority}
                      color={getStatusColor(complaint.priority)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="overline" color="text.secondary">
                      Submitted
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(complaint.createdAt), 'MMM dd, yyyy')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="overline" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(complaint.updatedAt), 'MMM dd, yyyy')}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Current Status
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Chip
                  label={complaint.status}
                  color={getStatusColor(complaint.status)}
                  sx={{ mb: 3 }}
                />
              </Box>

              <Stepper
                activeStep={steps.indexOf(complaint.status)}
                alternativeLabel
                sx={{ mb: 4 }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {complaint.description}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Location
              </Typography>
              <Typography variant="body1" paragraph>
                {complaint.location}
              </Typography>

              {complaint.adminNotes && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Admin Response
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body1">
                      {complaint.adminNotes}
                    </Typography>
                  </Paper>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
};

export default TrackComplaint; 