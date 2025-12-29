import React, { useState, useEffect, useCallback } from 'react';
import { withMsal } from "@azure/msal-react";

import { tokenRequest } from "../authConfig";
import { isTokenExpired } from "../utilities";
import { LoginProps } from '../types';

function Login(props: LoginProps) {
  const [token, setToken] = useState<string | null>(null);

  const { msalContext, tokenUpdated } = props;

  const callLogin = useCallback(() => {
    const msalInstance = msalContext.instance;
    const msalAccounts = msalContext.accounts;
    const msalInProgress = msalContext.inProgress;

    const request = {
      ...tokenRequest,
      account: msalAccounts[0]
    };

    // Prevent multiple simultaneous interactions
    if (msalInProgress !== "none") {
      return;
    }

    // if account is available
    if (msalAccounts.length > 0) {
      // if token is present, and expired
      if (!token || isTokenExpired(token)) {
        msalInstance.acquireTokenSilent(request)
          .then((response) => {
            setToken(response.accessToken);
          })
          .catch((error: any) => {
            // Only try popup if no other interaction is in progress
            if (error.errorCode === "invalid_grant" && msalInProgress === "none") {
              msalInstance.acquireTokenPopup(request)
                .then((response) => {
                  setToken(response.accessToken);
                })
                .catch((error) => {
                  console.error(error);
                });
            } else {
              console.error(error);
            }
          })
      }
    } else {
      // No account available, trigger login
      msalInstance.loginPopup()
        .then((response) => {
          // After login, the accounts will be available
          return msalInstance.acquireTokenSilent({
            ...tokenRequest,
            account: response.account
          });
        })
        .then((response) => {
          setToken(response.accessToken);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [msalContext, token]);

  useEffect(() => {
    callLogin()
  }, [callLogin]);

  useEffect(() => {
    tokenUpdated(token)
  }, [token, tokenUpdated]);

  return (
    <div>
    </div>
  )
}

export default withMsal(Login);
