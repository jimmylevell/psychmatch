import React, { useEffect, useCallback } from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";

import { loginRequest, tokenRequest } from "../authConfig";

function Login({ tokenUpdated }) {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const acquireToken = useCallback(async () => {
    if (accounts.length === 0 || inProgress !== InteractionStatus.None) {
      return;
    }

    const request = {
      ...tokenRequest,
      account: accounts[0]
    };

    try {
      const response = await instance.acquireTokenSilent(request);
      tokenUpdated(response.accessToken);
    } catch (error) {
      console.error("Silent token acquisition failed:", error);
      try {
        const response = await instance.acquireTokenPopup(request);
        tokenUpdated(response.accessToken);
      } catch (popupError) {
        console.error("Token acquisition failed:", popupError);
      }
    }
  }, [instance, accounts, inProgress, tokenUpdated]);

  useEffect(() => {
    const handleLogin = async () => {
      if (inProgress !== InteractionStatus.None) {
        return;
      }

      if (!isAuthenticated) {
        try {
          await instance.loginPopup(loginRequest);
        } catch (error) {
          console.error("Login failed:", error);
        }
      } else {
        await acquireToken();
      }
    };

    handleLogin();
  }, [isAuthenticated, inProgress, instance, acquireToken]);

  return null;
}

export default Login;
