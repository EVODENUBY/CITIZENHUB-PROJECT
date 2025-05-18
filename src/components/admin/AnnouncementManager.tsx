import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  NotificationsActive as NotificationIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from '@mui/icons-material';
import { useAnnouncements } from '../../contexts/AnnouncementContext';
import { format } from 'date-fns';

interface AnnouncementFormData {
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

const initialFormData: AnnouncementFormData = {
  title: '',
  message: '',
  priority: 'medium',
};

const AnnouncementManager: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement, toggleAnnouncementStatus } = useAnnouncements();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AnnouncementFormData>(initialFormData);

  const handleOpenDialog = () => {
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement(formData.title, formData.message, formData.priority);
    handleCloseDialog();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Announcements Management</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          New Announcement
        </Button>
      </Box>

      <List>
        {announcements.map((announcement, index) => (
          <React.Fragment key={announcement.id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <IconButton
                    edge="end"
                    onClick={() => toggleAnnouncementStatus(announcement.id)}
                    color={announcement.isActive ? 'primary' : 'default'}
                  >
                    {announcement.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => deleteAnnouncement(announcement.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                      {announcement.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={announcement.priority.toUpperCase()}
                      color={getPriorityColor(announcement.priority)}
                    />
                    <Chip
                      size="small"
                      label={announcement.isActive ? 'Active' : 'Inactive'}
                      color={announcement.isActive ? 'success' : 'default'}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.primary" paragraph>
                      {announcement.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Posted on {format(announcement.createdAt, 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < announcements.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {/* New Announcement Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Announcement</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
              <TextField
                fullWidth
                label="Message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                multiline
                rows={4}
                required
              />
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!formData.title.trim() || !formData.message.trim()}
            >
              Create Announcement
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
};

export default AnnouncementManager; 