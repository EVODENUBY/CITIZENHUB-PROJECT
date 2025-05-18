import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Pending as PendingIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useComplaints } from '../../contexts/ComplaintContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon sx={{ color, mr: 1 }} />
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" color={color}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const StatisticsCards: React.FC = () => {
  const { getAllComplaints } = useComplaints();
  const allComplaints = getAllComplaints();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Complaints"
          value={allComplaints.length}
          icon={AssignmentIcon}
          color="#1976d2"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Pending"
          value={allComplaints.filter(c => c.status === 'Pending').length}
          icon={PendingIcon}
          color="#d32f2f"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="In Progress"
          value={allComplaints.filter(c => c.status === 'In Progress').length}
          icon={SpeedIcon}
          color="#ed6c02"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Resolved"
          value={allComplaints.filter(c => c.status === 'Resolved').length}
          icon={StarIcon}
          color="#2e7d32"
        />
      </Grid>
    </Grid>
  );
};

export default StatisticsCards; 