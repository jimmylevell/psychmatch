import React from 'react';
import {
  CircularProgress,
  createTheme
} from '@mui/material';

const theme = createTheme();

const LoadingBar = () => (
  <div>
    <CircularProgress sx={{
      position: "fixed",
      top: theme.spacing(10),
      fontSize: 100,
      marginTop: theme.spacing(10),
      marginLeft: '50%',
      zIndex: 100000
    }} size={100} />
  </div>
);

export default LoadingBar;
