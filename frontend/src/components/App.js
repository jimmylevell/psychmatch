import React, { Fragment, Component } from 'react';
import { Route } from 'react-router-dom';
import {
  CssBaseline,
  withStyles
} from '@material-ui/core';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../authConfig";

import AppHeader from './appHeader';
import Login from '../pages/login';
import DocumentUpload from '../pages/documentUpload';
import DocumentManager from '../pages/documentManager';
import DocumentViewer from '../pages/documentViewer';
import PsychologistsManager from '../pages/psychologistsManager';

const msalInstance = new PublicClientApplication(msalConfig);

const styles = theme => ({
  main: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.5),
    },
  },
});
class App extends Component {
  constructor() {
    super()

    this.state = {
      token: null,

    }
  }

  tokenUpdated = (token) => {
    this.setState({
      token: token
    })
  }

  render() {
    const { classes } = this.props;

    return (
      <MsalProvider instance={ msalInstance }>
        <Fragment>
            <Login tokenUpdated={ this.tokenUpdated } />
            <CssBaseline />
            <AppHeader />
            <main className={ classes.main }>
              { /* Don't load components if token not present */}
              { this.state.token && (
                <AuthenticatedTemplate>
                  { /* Authenticated */ }
                  <Route exact path="/">
                    <DocumentManager token={ this.state.token } />
                  </Route>

                  <Route exact path="/upload">
                    <DocumentUpload token={ this.state.token } />
                  </Route>

                  <Route exact path="/documents">
                    <DocumentManager token={ this.state.token } />
                  </Route>

                  <Route exact path="/documents/:id">
                    <DocumentViewer token={ this.state.token } />
                  </Route>

                  <Route exact path="/psychologists">
                    <PsychologistsManager token={ this.state.token } />
                  </Route>

                  <Route exact path="/psychologists/:id">
                    <PsychologistsManager token={ this.state.token } />
                  </Route>

                  <Route exact path="/psychologists/:id/edit">
                    <PsychologistsManager token={ this.state.token } />
                  </Route>

                  <Route exact path="/psychologists/:id/copy">
                    <PsychologistsManager token={ this.state.token } />
                  </Route>
                  
                </AuthenticatedTemplate>
              )}

              { /* Unauthenticated */ }
              <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see use the application.</h5>
              </UnauthenticatedTemplate>        
            </main>
          </Fragment>
        </MsalProvider>
     );
  }
}

export default withStyles(styles)(App);