import React, {Component} from 'react';
import {
  withStyles,
} from '@material-ui/core';
import { compose } from 'recompose';
import { useMsal } from "@azure/msal-react";

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

function Authtemplate(props) {
  const { instance, accounts  } = useMsal();

  const request = {
    ...tokenRequest,
    account: accounts[0]
  };

  if (accounts.length > 0) {
    if(!localStorage.getItem('token') || isTokenExpired(localStorage.getItem('token'))) {
      instance.acquireTokenSilent(request).then((response) => {
        localStorage.setItem('token', response.accessToken);
      }).catch((error) => {
        if (error.errorCode === "invalid_grant") {
          // fallback to interaction when silent call fails
          instance.acquireTokenPopup(request).then(
            function (response) {
                console.log(response)
            }).catch(function (error) {
                console.log(error);
            });
        } else {
            console.error(error);   
        }
        
        console.log(error)
      })
    }
    
    return (
      <button onClick={() => instance.logout()}>Logout</button>
    )
  } else {
      return <button onClick={() => instance.loginPopup()}>Login</button>
  }
}

class Login extends Component {
  constructor() {
    super()

    this.state = {
    }
  }

  render() {
    return (
      <div>
        <Authtemplate/>
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
)(Login);