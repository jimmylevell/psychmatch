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
import { AuthenticatedTemplate, } from "@azure/msal-react";

import Help from './help'

const theme = createTheme();

function AppHeader() {
  const [showHelp, setShowHelp] = useState(false)

  const handleChange = () => {
    setShowHelp(!showHelp)
  }

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
          <Box display='flex' flexGrow={1}>
            {/* whatever is on the left side */}
            <Link sx={{
              fontSize: '1.5em',
              color: 'white',
              paddingLeft: theme.spacing(1),
              paddingRight: theme.spacing(1),
              textDecoration: 'none'
            }} to="/upload">Upload</Link>
            <Link sx={{
              fontSize: '1.5em',
              color: 'white',
              paddingLeft: theme.spacing(1),
              paddingRight: theme.spacing(1),
              textDecoration: 'none'
            }} to="/documents">Documents</Link>
            <Link sx={{
              fontSize: '1.5em',
              color: 'white',
              paddingLeft: theme.spacing(1),
              paddingRight: theme.spacing(1),
              textDecoration: 'none'
            }} to="/psychologists">Psychologists</Link>
          </Box>
        </AuthenticatedTemplate>
      </Toolbar>

      <Button
        onClick={handleChange}
        sx={{
          position: 'fixed',
          top: theme.spacing(-0.5),
          right: theme.spacing(),
          color: '#f50057',
          [theme.breakpoints.down('xs')]: {
            top: theme.spacing(-1),
            right: theme.spacing(0),
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
