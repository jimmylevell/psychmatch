import React, {Component} from 'react';
import { withMsal } from "@azure/msal-react";

import { tokenRequest } from "../authConfig";
import { isTokenExpired } from "../utilities";

class Login extends Component {
  constructor() {
    super()

    this.state = {
      token: null
    }
  }

  componentDidMount() {
    // initial login
    const msalInstance = this.props.msalContext.instance;
    msalInstance.loginPopup()
  }

  componentDidUpdate() {
    this.callLogin() 
  }

  callLogin() {
    const msalInstance = this.props.msalContext.instance;
    const msalAccounts = this.props.msalContext.accounts;
    const msalInProgress = this.props.msalContext.inProgress;
  
    const request = {
      ...tokenRequest,
      account: msalAccounts[0]
    };
  
    // if account is available
    if (msalAccounts.length > 0) {
      // if token is present, and expired
      if(((!this.state.token || isTokenExpired(this.state.token)) && msalInProgress !== true)) {
        msalInstance.acquireTokenSilent(request)
        .then((response) => {
          this.setState({ 
            token: response.accessToken 
          }, () => {
            this.props.tokenUpdated(response.accessToken)
          })
        })
        .catch((error) => {
          if (error.errorCode === "invalid_grant") {
            // fallback to interaction when silent call fails
            msalInstance.acquireTokenPopup(request)
            .then((response) => {
              //console.log(response)
            })
            .catch((error) => {
              console.error(error);
            });
          } else {
              console.error(error);   
          }
          
          console.error(error)
        })
      }
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