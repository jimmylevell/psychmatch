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
import { withStyles } from '@mui/styles';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { AuthenticatedTemplate, } from "@azure/msal-react";

import Help from './help'

const theme = createTheme();

const styles = () => ({
  header: {
    backgroundColor: "#82B282",
  },
  text: {
    fontSize: '4.5em',
    color: '#f50057',
  },
  headerButton: {
    position: 'fixed',
    top: theme.spacing(-0.5),
    right: theme.spacing(),
    color: '#f50057',
    [theme.breakpoints.down('xs')]: {
      top: theme.spacing(-1),
      right: theme.spacing(0),
    }
  },
  link: {
    fontSize: '1.5em',
    color: 'white',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    textDecoration: 'none'
  },
  displayName: {
    marginRight: theme.spacing(10)
  },
  helpIcon: {
    fontSize: '4.5em',
    color: 'white',
  }
})

function AppHeader(props) {
  const { classes } = props
  const [showHelp, setShowHelp] = useState(false)

  const handleChange = () => {
    setShowHelp(!showHelp)
  }

  return (
    <AppBar position="static" className={classes.header}>
      <Toolbar className={classes.toolBar}>
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
            <Link className={classes.link} to="/upload">Upload</Link>
            <Link className={classes.link} to="/documents">Documents</Link>
            <Link className={classes.link} to="/psychologists">Psychologists</Link>
          </Box>
        </AuthenticatedTemplate>
      </Toolbar>

      <Button
        onClick={handleChange}
        className={classes.headerButton}
      >
        <HelpOutlineIcon
          color="secondary"
          aria-label="add"
          className={classes.helpIcon}
        />
      </Button>
      <Help handleChange={handleChange} showModal={showHelp} />
    </AppBar>
  )
}

export default withStyles(styles)(AppHeader);
