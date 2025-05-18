import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Paper,
} from '@mui/material';
import { useAnnouncements } from '../../contexts/AnnouncementContext';
import { Announcement } from '../../types/Announcement';
import { format } from 'date-fns';

const AnnouncementViewer: React.FC = () => {
  const { getActiveAnnouncements } = useAnnouncements();
  const activeAnnouncements = getActiveAnnouncements();

  const getPriorityColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  if (activeAnnouncements.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No active announcements at this time.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Announcements
      </Typography>

      {activeAnnouncements.map((announcement) => (
        <Card key={announcement.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" gutterBottom>
                {announcement.title}
              </Typography>
              <Chip
                label={announcement.priority}
                color={getPriorityColor(announcement.priority)}
                size="small"
              />
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {announcement.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Posted on {format(new Date(announcement.createdAt), 'MMM dd, yyyy')}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default AnnouncementViewer; 