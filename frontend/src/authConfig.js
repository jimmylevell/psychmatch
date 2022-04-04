import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
    authority: "https://login.microsoftonline.com/" + process.env.REACT_APP_AZURE_ID,
    redirectUri: "/",
    postLogoutRedirectUri: "/",
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            console.error(message);
            return
        }
      }
    }
  }
};

export const tokenRequest = {
  scopes: [ "api://35aef02e-4185-4203-ba60-a16bb4152c55/access_as_user" ],
}
export const loginRequest = {
    scopes: [ ""]
};

export const silentRequest = {
    scopes: [ "access_as_user" ],
    loginHint: "user@levell.ch"
};