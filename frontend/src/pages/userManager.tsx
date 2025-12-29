import React, { Fragment, useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  createTheme
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { orderBy } from 'lodash';

import { ModelService, User } from '../service';
import ErrorSnackbar from '../components/errorSnackbar';
import LoadingBar from '../components/loadingBar';
import InfoSnackbar from '../components/infoSnackbar';

const theme = createTheme();

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'psychologist' | 'administrator'>('psychologist');

  const service = ModelService.getInstance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string} | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getCurrentUser = useCallback(() => {
    service.getCurrentUser()
      .then(user => {
        setCurrentUser(user);
      })
      .catch(err => {
        console.error('Error fetching current user:', err);
      });
  }, [service]);

  const getUsers = useCallback(() => {
    service.getUsers()
      .then(users => {
        setUsers(users || []);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setError({ message: "Error loading users. You may not have administrator permissions." });
      });
  }, [service]);

  useEffect(() => {
    if (ModelService.token) {
      getCurrentUser();
      getUsers();
    }
  }, [getCurrentUser, getUsers]);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setEmail(user.email);
      setRole(user.role);
    } else {
      setEditingUser(null);
      setEmail('');
      setRole('psychologist');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setEmail('');
    setRole('psychologist');
  };

  const handleSaveUser = async () => {
    try {
      setLoading(true);

      if (editingUser) {
        await service.updateUserRole(editingUser._id, role);
        setSuccess('User role updated successfully!');
      } else {
        await service.saveUser({ email, role });
        setSuccess('User created successfully!');
      }

      getUsers();
      handleCloseDialog();
    } catch (error) {
      setError({ message: 'Error saving user: ' + error });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete user "${user.email}"?`)) {
      try {
        setLoading(true);
        await service.deleteUser(user._id);
        setSuccess('User deleted successfully!');
        getUsers();
      } catch (error) {
        setError({ message: 'Error deleting user: ' + error });
      } finally {
        setLoading(false);
      }
    }
  };

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'administrator';

  if (!isAdmin && currentUser) {
    return (
      <Fragment>
        <Typography variant="h4">User Management</Typography>
        <Typography variant="body1" sx={{ marginTop: theme.spacing(2) }}>
          You do not have permission to access this page. Administrator role required.
        </Typography>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Typography variant="h4">User Management</Typography>

      {users.length > 0 ? (
        <Paper elevation={1} sx={{ marginTop: theme.spacing(2) }}>
          <List>
            {orderBy(users, ['email'], ['asc']).map(user => (
              <ListItem key={user._id}>
                <ListItemText
                  primary={user.email}
                  secondary={`Role: ${user.role}`}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleOpenDialog(user)} color="inherit">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUser(user)} color="inherit">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : (
        !loading && (
          <Typography variant="subtitle1" sx={{ marginTop: theme.spacing(2) }}>
            No users found. Start by adding your first user!
          </Typography>
        )
      )}

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        sx={{ marginTop: theme.spacing(2) }}
      >
        Add User
      </Button>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editingUser ? 'Edit User Role' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!!editingUser}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="psychologist">Psychologist</MenuItem>
              <MenuItem value="administrator">Administrator</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveUser} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {loading && <LoadingBar />}

      {error && (
        <ErrorSnackbar
          onClose={() => setError(null)}
          message={error.message}
        />
      )}

      {success && (
        <InfoSnackbar
          onClose={() => setSuccess(null)}
          message={success}
        />
      )}
    </Fragment>
  );
};

export default UserManager;
