import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import {
  CssBaseline,
  withStyles
} from '@material-ui/core';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

import AppHeader from './appHeader';
import Login from '../pages/login';
import DocumentUpload from '../pages/documentUpload';
import DocumentManager from '../pages/documentManager';
import DocumentViewer from '../pages/documentViewer';
import PsychologistsManager from '../pages/psychologistsManager';

const styles = theme => ({
  main: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.5),
    },
  },
});

const App = ({ msalInstance, classes }) => (
  <MsalProvider instance={ msalInstance }>
    <Fragment>
        <Login />
        <CssBaseline />
        <AppHeader />
        <main className={ classes.main }>
          <AuthenticatedTemplate>
            <Route exact path="/" component={ DocumentManager } />
            <Route exact path="/upload" component={ DocumentUpload } />
            <Route exact path="/documents" component={ DocumentManager } />
            <Route exact path="/documents/:id" component={ DocumentViewer } />

            <Route exact path="/psychologists" component={ PsychologistsManager } />
            <Route exact path="/psychologists/:id" component={ PsychologistsManager } />
            <Route exact path="/psychologists/:id/edit" component={ PsychologistsManager } />
            <Route exact path="/psychologists/:id/copy" component={ PsychologistsManager } />
          </AuthenticatedTemplate>

          <UnauthenticatedTemplate>
            <h5 className="card-title">Please sign-in to see use the application.</h5>
          </UnauthenticatedTemplate>        
        </main>
      </Fragment>
    </MsalProvider>
  );
  
  export default withStyles(styles)(App);