import React from 'react';
import {
  Snackbar,
  SnackbarContent,
  IconButton,
  createTheme
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

const theme = createTheme();
const AUTO_HIDE_DURATION = 6000

const InfoSnackbar = ({ id, message, onClose }) => (
  <Snackbar
    open
    autoHideDuration={AUTO_HIDE_DURATION}
    onClose={onClose}
  >
    <SnackbarContent
      sx={{
        backgroundColor: theme.palette.success.dark,
      }}
      aria-describedby={id}
      message={
        <span id={id} style={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <CheckIcon sx={{
            fontSize: 20,
            opacity: 0.9,
            marginRight: theme.spacing(1),
          }} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
          <CloseIcon sx={{
            fontSize: 20,
          }} />
        </IconButton>
      ]}
    />
  </Snackbar>
);

export default InfoSnackbar;
