import React, {Component} from 'react';
import {
  withStyles,
} from '@material-ui/core';
import { compose } from 'recompose';
import { withMsal } from "@azure/msal-react";

import { tokenRequest } from "../authConfig";

const styles = theme => ({
})

function isTokenExpired(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  const { exp } = JSON.parse(jsonPayload);
  const expired = Date.now() >= exp * 1000
  return expired
}

class Login extends Component {
  constructor() {
    super()

    this.state = {
      token: null
    }
  }

  componentDidMount() {
    this.callLogin()
  }

  componentDidUpdate() {
    this.callLogin() 
  }

  callLogin() {
    const msalInstance = this.props.msalContext.instance;
    const msalAccounts = this.props.msalContext.accounts;
    const msalInProgress = this.context.inProgress;
  
    const request = {
      ...tokenRequest,
      account: msalAccounts[0]
    };
  
    if (msalAccounts.length > 0) {
      if((!this.state.token || isTokenExpired(this.state.token) && msalInProgress !== true)) {
        msalInstance.acquireTokenSilent(request).then((response) => {
          this.setState({ token: response.accessToken }, () => {this.props.tokenUpdated(response.accessToken)})
        }).catch((error) => {
          if (error.errorCode === "invalid_grant") {
            // fallback to interaction when silent call fails
            msalInstance.acquireTokenPopup(request).then(
              function (response) {
//                  console.log(response)
              }).catch(function (error) {
                  console.log(error);
              });
          } else {
              console.error(error);   
          }
          
          console.log(error)
        })
      }
    } else {
        msalInstance.loginPopup()
    }
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}

export default withMsal(Login);