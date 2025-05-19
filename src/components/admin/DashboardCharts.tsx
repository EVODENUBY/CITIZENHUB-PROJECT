import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useComplaints } from '../../contexts/ComplaintContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const MOCK_ADMIN_COMPLAINTS = [
  {
    id: 'C-001',
    userId: 'user-001',
    userName: 'Evode MUYISINGIZE',
    userEmail: 'evode@gmail.com',
    title: ' Water Related Issues',
    description: 'There is a massive  water leakage in the street. Please get ready to repair it',
    category: 'Infrastructure',
    priority: 'High',
    location: 'Remera, Rwanda',
    contactInfo: '+250 729525550',
    status: 'Pending',
    adminNotes: '',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
  {
    id: 'C-002',
    userId: 'user-002',
    userName: 'Adolphe NAYITURIKI',
    userEmail: 'adolphe@gmail.com',
    title: ' Street Light',
    description: ' street light isn\'t not working.',
    category: 'Utilities',
    priority: 'Medium',
    location: 'HUYE, Rwanda',
    contactInfo: '+250 790 789 802',
    status: 'In Progress',
    adminNotes: '',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
  {
    id: 'C-003',
    userId: 'user-002',
    userName: 'Bernard NDAGIJIMANA',
    userEmail: 'bernard@gmail.com',
    title: 'Disease outbreakt',
    description: 'Malaria outbreak.',
    category: 'HealthCare',
    priority: 'High',
    location: 'Nyamagabe, Rwanda',
    contactInfo: '+250 727 709 702',
    status: 'Pending',
    adminNotes: '',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
  {
    id: 'C-004',
    userId: 'user-002',
    userName: 'Vedaste TUYISHIMIRE',
    userEmail: 'vedaste@gmail.com',
    title: ' Transport problems',
    description: 'Shortage of Buses for passengers become a serious problem and\
     barrier to peaple from HUYE-KIGALI',
    category: 'infrastructure',
    priority: 'Medium',
    location: 'Kigali, Rwanda',
    contactInfo: '+250 722 787 902',
    status: 'Pending',
    adminNotes:'',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
  {
    id: 'C-005',
    userId: 'user-002',
    userName: 'Jonathan DUKUNDIMANA',
    userEmail: 'Jonathan@gmail.com',
    title: ' LOW LIVING ALLOWANCES TO UNIVERSITY STUNTS',
    description: 'Student Bursary is very low!!, Could you please increase it?',
    category: 'EDUCATION',
    priority: 'Medium',
    location: 'HUYE, Rwanda',
    contactInfo: '+250 734 089 002',
    status: 'In Progress',
    adminNotes:'',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
  {
    id: 'C-006',
    userId: 'user-002',
    userName: 'Patrick AMIZERO',
    userEmail: 'patrick@gmail.com',
    title: 'Hazardous Rainfall',
    description: 'Due to Heavy rainfall received in our District GICUMBI, It is prone to Hazzadous effects.\
                              REMA should visit Us to cope with That climate And provide us how e can overcome those catastrophes',
    category: 'HealthCare',
    priority: 'High',
    location: 'Gicumbi, Rwanda',
    contactInfo: '+250 730 000 002',
    status: 'Pending',
    adminNotes:'',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
  {
    id: 'C-007',
    userId: 'user-002',
    userName: 'Denyse CYUZUZO',
    userEmail: 'Denyse@gmail.com',
    title: ' ASKING ROAD PROVISION',
    description: 'We need good feeder roads to connect Kayonza to the rest of the country!!',
    category: 'infrastructure',
    priority: 'Medium',
    location: 'Kayonza, Rwanda',
    contactInfo: '+250 777 000 002',
    status: 'Resolved',
    adminNotes:'',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
  {
    id: 'C-008',
    userId: 'user-002',
    userName: 'Feliste izere',
    userEmail: 'felicite@gmail.com',
    title: 'REQUEST',
    description: 'We are asking for the government to provide electricity in NYARGURU if possible',
    category: 'Others',
    priority: 'Low',
    location: 'Gisagara, Rwanda',
    contactInfo: '+250 782 567 002',
    status: 'In Progress',
    adminNotes:'',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
  {
    id: 'C-008',
    userId: 'user-002',
    userName: 'Feliste izere',
    userEmail: 'felicite@gmail.com',
    title: 'REQUEST',
    description: 'We are asking for the government to provide electricity in NYARGURU if possible',
    category: 'Others',
    priority: 'Low',
    location: 'Gisagara, Rwanda',
    contactInfo: '+250 782 567 002',
    status: 'In Progress',
    adminNotes:'',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
];

const DashboardCharts: React.FC = () => {
  const { getAllComplaints } = useComplaints();
  // TEST DATA (TO BE UPDATED WITH REAL DATA)
  const allComplaints = React.useMemo(
    () => [...MOCK_ADMIN_COMPLAINTS, ...getAllComplaints()],
    [getAllComplaints]
  );

  // Prepare data for category chart
  const categoryData = React.useMemo(() => {
    const categories = allComplaints.reduce((acc, complaint) => {
      acc[complaint.category] = (acc[complaint.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  }, [allComplaints]);

  // Prepare data for status chart
  const statusData = React.useMemo(() => {
    const statuses = ['Pending', 'In Progress', 'Resolved'];
    return statuses.map(status => ({
      name: status,
      count: allComplaints.filter(c => c.status === status).length,
    }));
  }, [allComplaints]);

  if (allComplaints.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography color="text.secondary">
          No complaints data available to display charts
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Complaints by Category
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Complaints by Status
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardCharts;