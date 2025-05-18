import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Snackbar,
  Alert,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { useComplaints } from '../contexts/ComplaintContext';

interface ComplaintData {
  title: string;
  description: string;
  category: string;
  location: string;
  contactInfo: string;
  priority: 'High' | 'Medium' | 'Low';
}

const categories = [
  'Infrastructure',
  'Public Services',
  'Sanitation',
  'Transportation',
  'Education',
  'Healthcare',
  'Other',
];

const priorities = [
  { value: 'High', label: 'High Priority' },
  { value: 'Medium', label: 'Medium Priority' },
  { value: 'Low', label: 'Low Priority' },
];

const SubmitComplaint: React.FC = () => {
  const navigate = useNavigate();
  const { addComplaint } = useComplaints();
  const [formData, setFormData] = useState<ComplaintData>({
    title: '',
    description: '',
    category: '',
    location: '',
    contactInfo: '',
    priority: 'Medium', // Default priority
  });

  const [successDialog, setSuccessDialog] = useState({
    open: false,
    complaintId: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(successDialog.complaintId);
    setSnackbar({
      open: true,
      message: 'Complaint ID copied to clipboard!',
      severity: 'success',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await addComplaint(formData);
      // Note: addComplaint should be modified to return the new complaint object
      setSuccessDialog({
        open: true,
        complaintId: result.id,
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to submit complaint. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCloseDialog = () => {
    setSuccessDialog({ open: false, complaintId: '' });
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
            Submit a Complaint
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                size="small"
                fullWidth
              />
              <TextField
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                size="small"
                fullWidth
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                size="small"
                fullWidth
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                size="small"
                fullWidth
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={3}
                fullWidth
                size="small"
              />
              <TextField
                label="Contact Information"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                required
                size="small"
                fullWidth
                helperText="Please provide your email or phone number"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Submit Complaint
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>

      {/* Success Dialog */}
      <Dialog
        open={successDialog.open}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Complaint Submitted Successfully!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your complaint has been submitted successfully. Please save your complaint ID for tracking:
          </DialogContentText>
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" component="div" sx={{ fontFamily: 'monospace' }}>
              {successDialog.complaintId}
            </Typography>
            <Button
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyId}
              size="small"
            >
              Copy ID
            </Button>
          </Box>
          <DialogContentText sx={{ mt: 2 }}>
            You can use this ID to track the status of your complaint in the Track Complaints section.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Go to Dashboard
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SubmitComplaint; 