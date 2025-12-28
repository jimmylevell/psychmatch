import React, { Fragment, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  CssBaseline,
  createTheme,
  Box
} from '@mui/material';
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

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      ModelService.getInstance(token);
    }
  }, [token]);

  return (
    <MsalProvider instance={msalInstance}>
      <Fragment>
        <Login tokenUpdated={setToken} />
        <CssBaseline />
        <AppHeader />
        <Box component="main" sx={{
          padding: theme.spacing(3),
          [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(0.5),
          },
        }}>
          { /* Don't load components if token not present */}
          {token && (
            <AuthenticatedTemplate>
              <Routes>
                { /* Authenticated */}
                <Route path="/" element={<DocumentManager />} />
                <Route path="/upload" element={<DocumentUpload />} />
                <Route path="/documents" element={<DocumentManager />} />
                <Route path="/documents/:id" element={<DocumentViewer />} />
                <Route path="/psychologists" element={<PsychologistsManager />} />
                <Route path="/psychologists/:id" element={<PsychologistsManager />} />
                <Route path="/psychologists/:id/edit" element={<PsychologistsManager />} />
                <Route path="/psychologists/:id/copy" element={<PsychologistsManager />} />
              </Routes>
            </AuthenticatedTemplate>
          )}

          { /* Unauthenticated */}
          <UnauthenticatedTemplate>
            <h5 className="card-title">Please sign-in to see use the application.</h5>
          </UnauthenticatedTemplate>
        </Box>
      </Fragment>
    </MsalProvider>
  )
}

export default App;
