import React, { useState } from 'react';
import { Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, TextField, Alert, Snackbar } from '@mui/material';
import WelcomeMessage from '../components/admin/WelcomeMessage';
import StatisticsCards from '../components/admin/StatisticsCards';
import ComplaintsTable from '../components/admin/ComplaintsTable';
import AnnouncementManager from '../components/admin/AnnouncementManager';
import DashboardCharts from '../components/admin/DashboardCharts';
import { useComplaints } from '../contexts/ComplaintContext';

const AdminDashboard: React.FC = () => {
  const { updateComplaintStatus } = useComplaints();
  const [responseDialog, setResponseDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [newStatus, setNewStatus] = useState<'Pending' | 'In Progress' | 'Resolved'>('In Progress');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleResponse = async () => {
    if (!selectedComplaint) return;

    try {
      await updateComplaintStatus(selectedComplaint, newStatus, responseText);
      setSnackbar({
        open: true,
        message: 'Complaint status updated successfully',
        severity: 'success'
      });
      setResponseDialog(false);
      setResponseText('');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update complaint status',
        severity: 'error'
      });
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <WelcomeMessage />
        </Grid>
        <Grid item xs={12}>
          <StatisticsCards />
        </Grid>
        <Grid item xs={12}>
          <AnnouncementManager />
        </Grid>
        <Grid item xs={12}>
          <ComplaintsTable />
        </Grid>
        <Grid item xs={12}>
          <DashboardCharts />
        </Grid>
      </Grid>

      {/* Response Dialog */}
      <Dialog open={responseDialog} onClose={() => setResponseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Complaint Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value as typeof newStatus)}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Admin Notes"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialog(false)}>Cancel</Button>
          <Button onClick={handleResponse} variant="contained" color="primary">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* NOTIFICATION SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard; 