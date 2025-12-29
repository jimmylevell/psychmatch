import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  createTheme
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";

import Help from './help'

const theme = createTheme();

const AppHeader: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false)
  const { instance, accounts } = useMsal();

  const handleChange = () => {
    setShowHelp(!showHelp)
  }

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
    });
  }

  const userName = accounts[0]?.name || accounts[0]?.username || "User";

  return (
    <AppBar position="static" sx={{
      backgroundColor: "#82B282",
    }}>
      <Toolbar>
        <AuthenticatedTemplate>
          <Button color="inherit" component={Link} to="/">
            <FeedbackIcon />
            <Typography variant="h6" color="inherit">
              Psychmatch
            </Typography>
          </Button>

          {/* link collection */}
          <Box display='flex' flexGrow={1} alignItems="center">
            {/* whatever is on the left side */}
            <Button color="inherit" component={Link} to="/upload" sx={{
              fontSize: '1em',
              textTransform: 'none',
            }}>
              Upload
            </Button>
            <Button color="inherit" component={Link} to="/documents" sx={{
              fontSize: '1em',
              textTransform: 'none',
            }}>
              Documents
            </Button>
            <Button color="inherit" component={Link} to="/psychologists" sx={{
              fontSize: '1em',
              textTransform: 'none',
            }}>
              Psychologists
            </Button>
            <Button color="inherit" component={Link} to="/my-profile" sx={{
              fontSize: '1em',
              textTransform: 'none',
            }}>
              My Profile
            </Button>
            <Button color="inherit" component={Link} to="/users" sx={{
              fontSize: '1em',
              textTransform: 'none',
            }}>
              Users
            </Button>
          </Box>

          {/* User info and logout */}
          <Box display='flex' alignItems="center" gap={2}>
            <Typography variant="body1" color="inherit">
              {userName}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                textTransform: 'none',
              }}
            >
              Logout
            </Button>
          </Box>
        </AuthenticatedTemplate>
      </Toolbar>

      <Button
        onClick={handleChange}
        sx={{
          position: 'fixed',
          top: theme.spacing(-0.5),
          right: theme.spacing(27),
          color: '#f50057',
          [theme.breakpoints.down('xs')]: {
            top: theme.spacing(-1),
            right: theme.spacing(27),
          }
        }}
      >
        <HelpOutlineIcon
          color="secondary"
          aria-label="add"
          sx={{
            fontSize: '4.5em',
            color: 'white',
          }}
        />
      </Button>
      <Help handleChange={handleChange} showModal={showHelp} />
    </AppBar>
  )
}

export default AppHeader;
