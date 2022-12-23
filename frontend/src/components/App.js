import React, { Fragment, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  CssBaseline,
  createTheme
} from '@mui/material';
import { withStyles } from '@mui/styles';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../authConfig";

import { ModelService } from '../service';

import AppHeader from './appHeader';
import Login from '../pages/login';
import DocumentUpload from '../pages/documentUpload';
import DocumentManager from '../pages/documentManager';
import DocumentViewer from '../pages/documentViewer';
import PsychologistsManager from '../pages/psychologistsManager';

const msalInstance = new PublicClientApplication(msalConfig);

const theme = createTheme();

const styles = ({
  main: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.5),
    },
  },
});
const App = ({ classes }) => {
  const [token, setToken] = useState(null);
  let service = null;

  useEffect(() => {
    if (token) {
      service = ModelService.getInstance(token);

      console.log(service)
    }
  }, [token]);

  return (
    <MsalProvider instance={msalInstance}>
      <Fragment>
        <Login tokenUpdated={setToken} />
        <CssBaseline />
        <AppHeader />
        <main className={classes.main}>
          { /* Don't load components if token not present */}
          {token && (
            <AuthenticatedTemplate>
              <Routes>
                { /* Authenticated */}
                <Route exact path="/" element={<DocumentManager />} />
                <Route exact path="/upload" element={<DocumentUpload />} />
                <Route exact path="/documents" element={<DocumentManager />} />
                <Route exact path="/documents/:id" element={<DocumentViewer />} />
                <Route exact path="/psychologists" element={<PsychologistsManager />} />
                <Route exact path="/psychologists/:id" element={<PsychologistsManager />} />
                <Route exact path="/psychologists/:id/edit" element={<PsychologistsManager />} />
                <Route exact path="/psychologists/:id/copy" element={<PsychologistsManager />} />
              </Routes>
            </AuthenticatedTemplate>
          )}

          { /* Unauthenticated */}
          <UnauthenticatedTemplate>
            <h5 className="card-title">Please sign-in to see use the application.</h5>
          </UnauthenticatedTemplate>
        </main>
      </Fragment>
    </MsalProvider>
  )
}

export default withStyles(styles)(App);
