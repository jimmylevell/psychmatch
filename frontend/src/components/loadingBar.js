import React from 'react';
import {
  CircularProgress,
  createTheme
} from '@mui/material';
import { withStyles } from '@mui/styles';

const theme = createTheme();

const styles = () => ({
  loadingBar: {
    position: "fixed",
    top: theme.spacing(10),
    fontSize: 100,
    marginTop: theme.spacing(10),
    marginLeft: '50%',
    zIndex: 100000
  }
});

const LoadingBar = ({ classes }) => (
  <div className={classes.root}>
    <CircularProgress className={classes.loadingBar} size={100} />
  </div>
);

export default withStyles(styles)(LoadingBar);
