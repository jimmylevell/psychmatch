import React from 'react';
import {
  Snackbar,
  SnackbarContent,
  IconButton,
  createTheme
} from '@mui/material';
import { withStyles } from '@mui/styles';
import { Error as ErrorIcon, Close as CloseIcon } from '@mui/icons-material';

const theme = createTheme();

const styles = () => ({
  snackbarContent: {
    backgroundColor: theme.palette.error.dark,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
});
const AUTO_HIDE_DURATION = 6000

const ErrorSnackbar = ({ id, message, onClose, classes }) => (
  <Snackbar
    open
    autoHideDuration={AUTO_HIDE_DURATION}
    onClose={onClose}
  >
    <SnackbarContent
      className={`${classes.margin} ${classes.snackbarContent}`}
      aria-describedby={id}
      message={
        <span id={id} className={classes.message}>
          <ErrorIcon className={`${classes.icon} ${classes.iconVariant}`} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
    />
  </Snackbar>
);

export default withStyles(styles)(ErrorSnackbar);
