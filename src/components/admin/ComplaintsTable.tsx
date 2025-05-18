import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TableSortLabel,
  TablePagination,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Reply as ReplyIcon,
  DateRange as DateRangeIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useComplaints } from '../../contexts/ComplaintContext';
import { format, isValid, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

interface FilterState {
  status: string[];
  priority: string[];
  category: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

interface ResponseDialogState {
  open: boolean;
  complaintId: string;
  complaintTitle: string;
  complaintDescription: string;
  complaintCategory: string;
  complaintLocation: string;
  contactInfo: string;
  userName: string;
  userEmail: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  adminNotes: string;
  createdAt: string;
}

interface DeleteDialogState {
  open: boolean;
  complaintId: string;
  complaintTitle: string;
}

const formatDate = (dateString: string, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    // First try parsing as ISO string
    const date = parseISO(dateString);
    if (isValid(date)) {
      return format(date, formatStr);
    }
    
    // If not ISO, try regular Date constructor
    const fallbackDate = new Date(dateString);
    if (isValid(fallbackDate)) {
      return format(fallbackDate, formatStr);
    }
    
    // If both attempts fail, return a placeholder
    return 'Invalid date';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const MOCK_ADMIN_COMPLAINTS = [
  {
    id: 'complaint-001',
    userId: 'user-001',
    userName: 'Evode nuby',
    userEmail: 'evode@nuby.com',
    title: ' Water Issue',
    description: 'There is a mock water leakage in the street.',
    category: 'Infrastructure',
    priority: 'High',
    location: 'Kigali, Rwanda',
    contactInfo: '+250 700 000 001',
    status: 'Pending',
    adminNotes: '',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
  {
    id: 'complaint-002',
    userId: 'user-002',
    userName: 'Jane',
    userEmail: 'jane.Gasaro@jane.com',
    title: ' Street Light',
    description: ' street light not working.',
    category: 'Utilities',
    priority: 'Medium',
    location: 'Kigali, Rwanda',
    contactInfo: '++250 790 789 802',
    status: 'In Progress',
    adminNotes: 'Mock technician assigned.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
  {
    id: 'complaint-003',
    userId: 'user-002',
    userName: 'Gasaro jane',
    userEmail: 'Gasaro@gmail.com',
    title: 'Disease outbreakt',
    description: 'Malaria outbreak.',
    category: 'healthy',
    priority: 'high',
    location: 'nyamagabe, Rwanda',
    contactInfo: '+250 790 789 802',
    status: 'Resolved',
    adminNotes: 'technician assigned.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
  {
    id: 'complaint-004',
    userId: 'user-002',
    userName: 'Mukunzi Emery',
    userEmail: 'mukunzi@gmail.com',
    title: ' Street Light',
    description: ' street light not working.',
    category: 'Utilities',
    priority: 'Medium',
    location: 'Kigali, Rwanda',
    contactInfo: '+250 78 080 002',
    status: 'In Progress',
    adminNotes: ' technician assigned.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  }
];

const ComplaintsTable: React.FC = () => {
  const { getAllComplaints, updateComplaintStatus, deleteComplaint } = useComplaints();
  // For testing, combine mock data with real data (remove in production)
  const allComplaints = [...MOCK_ADMIN_COMPLAINTS, ...getAllComplaints()];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    category: [],
    dateRange: {
      startDate: '',
      endDate: ''
    }
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc' as 'asc' | 'desc'
  });

  // Response dialog state
  const [responseDialog, setResponseDialog] = useState<ResponseDialogState>({
    open: false,
    complaintId: '',
    complaintTitle: '',
    complaintDescription: '',
    complaintCategory: '',
    complaintLocation: '',
    contactInfo: '',
    userName: '',
    userEmail: '',
    status: 'Pending',
    adminNotes: '',
    createdAt: '',
  });

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    complaintId: '',
    complaintTitle: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Get unique values for filters
  const categories = Array.from(new Set(allComplaints.map(c => c.category)));
  const priorities = Array.from(new Set(allComplaints.map(c => c.priority)));
  const statuses = Array.from(new Set(allComplaints.map(c => c.status)));

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (filterName: keyof FilterState, value: string | string[]) => {
    if (!Array.isArray(value) && value === 'all') {
      setFilters(prev => ({
        ...prev,
        [filterName]: []
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterName]: Array.isArray(value) ? value : [value]
      }));
    }
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      category: [],
      dateRange: {
        startDate: '',
        endDate: ''
      }
    });
    setSearchTerm('');
    setPage(0);
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

  const filteredComplaints = allComplaints
    .filter(complaint => {
      const matchesSearch = searchTerm === '' || 
        Object.values(complaint).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus = filters.status.length === 0 || filters.status.includes(complaint.status);
      const matchesPriority = filters.priority.length === 0 || filters.priority.includes(complaint.priority);
      const matchesCategory = filters.category.length === 0 || filters.category.includes(complaint.category);
      
      // Date range filtering
      let matchesDateRange = true;
      if (filters.dateRange.startDate && filters.dateRange.endDate) {
        const complaintDate = new Date(complaint.createdAt);
        const startDate = startOfDay(new Date(filters.dateRange.startDate));
        const endDate = endOfDay(new Date(filters.dateRange.endDate));
        
        matchesDateRange = isWithinInterval(complaintDate, { start: startDate, end: endDate });
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesDateRange;
    })
    .sort((a, b) => {
      const key = sortConfig.key as keyof typeof a;
      if (!a[key] || !b[key]) return 0;
      
      const comparison = String(a[key]).localeCompare(String(b[key]));
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

  const paginatedComplaints = filteredComplaints.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle opening the response dialog
  const handleOpenResponse = (complaint: any) => {
    setResponseDialog({
      open: true,
      complaintId: complaint.id,
      complaintTitle: complaint.title,
      complaintDescription: complaint.description,
      complaintCategory: complaint.category,
      complaintLocation: complaint.location,
      contactInfo: complaint.contactInfo,
      userName: complaint.userName || 'N/A',
      userEmail: complaint.userEmail || 'N/A',
      status: complaint.status,
      adminNotes: complaint.adminNotes || '',
      createdAt: complaint.createdAt,
    });
  };

  // Handle closing the response dialog
  const handleCloseDialog = () => {
    setResponseDialog({
      open: false,
      complaintId: '',
      complaintTitle: '',
      complaintDescription: '',
      complaintCategory: '',
      complaintLocation: '',
      contactInfo: '',
      userName: '',
      userEmail: '',
      status: 'Pending',
      adminNotes: '',
      createdAt: '',
    });
  };

  // Handle submitting the response
  const handleSubmitResponse = async () => {
    try {
      await updateComplaintStatus(
        responseDialog.complaintId,
        responseDialog.status,
        responseDialog.adminNotes
      );
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating complaint:', error);
      // You might want to show an error message to the user here
    }
  };

  // Handle opening delete dialog
  const handleOpenDelete = (complaint: any) => {
    setDeleteDialog({
      open: true,
      complaintId: complaint.id,
      complaintTitle: complaint.title,
    });
  };

  // Handle closing delete dialog
  const handleCloseDelete = () => {
    setDeleteDialog({
      open: false,
      complaintId: '',
      complaintTitle: '',
    });
  };

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    try {
      await deleteComplaint(deleteDialog.complaintId);
      handleCloseDelete();
      setSnackbar({
        open: true,
        message: `Complaint "${deleteDialog.complaintTitle}" has been deleted successfully`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting complaint:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete complaint. Please try again.',
        severity: 'error',
      });
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Complaints Management
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            disabled={!searchTerm && Object.values(filters).every(arr => arr.length === 0)}
          >
            Clear Filters
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Date Range Filters */}
          <TextField
            type="date"
            size="small"
            label="Start Date"
            value={filters.dateRange.startDate}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              dateRange: {
                ...prev.dateRange,
                startDate: e.target.value
              }
            }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 170 }}
          />
          <TextField
            type="date"
            size="small"
            label="End Date"
            value={filters.dateRange.endDate}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              dateRange: {
                ...prev.dateRange,
                endDate: e.target.value
              }
            }))}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 170 }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="all">
                <Checkbox checked={filters.status.length === 0} />
                All Status
              </MenuItem>
              {statuses.map(status => (
                <MenuItem key={status} value={status}>
                  <Checkbox checked={filters.status.includes(status)} />
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              multiple
              value={filters.priority}
              label="Priority"
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="all">
                <Checkbox checked={filters.priority.length === 0} />
                All Priorities
              </MenuItem>
              {priorities.map(priority => (
                <MenuItem key={priority} value={priority}>
                  <Checkbox checked={filters.priority.includes(priority)} />
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              multiple
              value={filters.category}
              label="Category"
              onChange={(e) => handleFilterChange('category', e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="all">
                <Checkbox checked={filters.category.length === 0} />
                All Categories
              </MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  <Checkbox checked={filters.category.includes(category)} />
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'id'}
                  direction={sortConfig.key === 'id' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'title'}
                  direction={sortConfig.key === 'title' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'userName'}
                  direction={sortConfig.key === 'userName' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('userName')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'userEmail'}
                  direction={sortConfig.key === 'userEmail' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('userEmail')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'category'}
                  direction={sortConfig.key === 'category' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('category')}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'status'}
                  direction={sortConfig.key === 'status' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'priority'}
                  direction={sortConfig.key === 'priority' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('priority')}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'createdAt'}
                  direction={sortConfig.key === 'createdAt' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('createdAt')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedComplaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell>{complaint.id}</TableCell>
                <TableCell>{complaint.title}</TableCell>
                <TableCell>{complaint.userName || 'N/A'}</TableCell>
                <TableCell>{complaint.userEmail || 'N/A'}</TableCell>
                <TableCell>{complaint.category}</TableCell>
                <TableCell>
                  <Chip
                    label={complaint.status}
                    color={getStatusColor(complaint.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={complaint.priority}
                    color={getStatusColor(complaint.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {formatDate(complaint.createdAt)}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      startIcon={<ReplyIcon />}
                      onClick={() => handleOpenResponse(complaint)}
                    >
                      Respond
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleOpenDelete(complaint)}
                      title="Delete Complaint"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredComplaints.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Response Dialog */}
      <Dialog 
        open={responseDialog.open} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          Respond to Complaint
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 2 }}>
            {/* Complaint Details Section */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Complaint Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Title:
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {responseDialog.complaintTitle}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Description:
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {responseDialog.complaintDescription}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Category:
                  </Typography>
                  <Typography variant="body1">
                    {responseDialog.complaintCategory}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Location:
                  </Typography>
                  <Typography variant="body1">
                    {responseDialog.complaintLocation}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* User Information Section */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                User Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Name:
                  </Typography>
                  <Typography variant="body1">
                    {responseDialog.userName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Email:
                  </Typography>
                  <Typography variant="body1">
                    {responseDialog.userEmail}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Contact Info:
                  </Typography>
                  <Typography variant="body1">
                    {responseDialog.contactInfo}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Submitted on:
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(responseDialog.createdAt, 'PPpp')}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Response Section */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Admin Response
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={responseDialog.status}
                  label="Status"
                  onChange={(e) => setResponseDialog(prev => ({
                    ...prev,
                    status: e.target.value as 'Pending' | 'In Progress' | 'Resolved'
                  }))}
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
                value={responseDialog.adminNotes}
                onChange={(e) => setResponseDialog(prev => ({
                  ...prev,
                  adminNotes: e.target.value
                }))}
                placeholder="Enter your response or notes about this complaint..."
                helperText="This message will be visible to the user"
              />
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitResponse} 
            variant="contained" 
            color="primary"
            disabled={!responseDialog.adminNotes.trim()}
          >
            Submit Response
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the complaint "{deleteDialog.complaintTitle}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ComplaintsTable;