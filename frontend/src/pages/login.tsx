import React, { useState, useEffect, useCallback } from 'react';
import { withMsal, IMsalContext } from "@azure/msal-react";

import { tokenRequest } from "../authConfig";
import { isTokenExpired } from "../utilities";

interface LoginProps {
  msalContext: IMsalContext;
  tokenUpdated: (token: string | null) => void;
}

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

    // if account is available
    if (msalAccounts.length > 0) {
      // if token is present, and expired
      if (((!token || isTokenExpired(token)) && !msalInProgress)) {
        msalInstance.acquireTokenSilent(request)
          .then((response) => {
            setToken(response.accessToken);
          })
          .catch((error: any) => {
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
  }, [msalContext, token]);

  useEffect(() => {
    const msalInstance = msalContext.instance;
    msalInstance.loginPopup()
  }, [msalContext]);

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
