import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import {
  CssBaseline,
  withStyles,
} from '@material-ui/core';

import AppHeader from './appHeader'
import DocumentUpload from '../pages/documentUpload'
import DocumentManager from '../pages/documentManager'
import DocumentViewer from '../pages/documentViewer'

const styles = theme => ({
  main: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.5),
    },
  },
});

const App = ({ classes }) => (
  <Fragment>
      <CssBaseline />
      <AppHeader />
      <main className={ classes.main }>
        <Route exact path="/" component={ DocumentManager } />
        <Route exact path="/upload" component={ DocumentUpload } />
        <Route exact path="/documents" component={ DocumentManager } />
        <Route exact path="/documents/:id" component={ DocumentViewer } />
      </main>
    </Fragment>
  );
  
  export default withStyles(styles)(App);