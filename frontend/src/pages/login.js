import React, { useState, useEffect } from 'react';
import { withMsal } from "@azure/msal-react";

import { tokenRequest } from "../authConfig";
import { isTokenExpired } from "../utilities";

function Login(props) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const msalInstance = props.msalContext.instance;
    msalInstance.loginPopup()
  }, [props.msalContext.instance]);

  useEffect(() => {
    callLogin()
  }, []);

  useEffect(() => {
    props.tokenUpdated(token)
  }, [token]);

  const callLogin = () => {
    const msalInstance = props.msalContext.instance;
    const msalAccounts = props.msalContext.accounts;
    const msalInProgress = props.msalContext.inProgress;

    const request = {
      ...tokenRequest,
      account: msalAccounts[0]
    };

    // if account is available
    if (msalAccounts.length > 0) {
      // if token is present, and expired
      if (((!token || isTokenExpired(token)) && msalInProgress !== true)) {
        msalInstance.acquireTokenSilent(request)
          .then((response) => {
            setToken(response.accessToken);
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

  return (
    <div>
    </div>
  )
}

export default withMsal(Login);
