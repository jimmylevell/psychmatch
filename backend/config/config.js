require('dotenv').config({ path: '.env' });

const dockerSecret = require('../src/utils/dockersecret');

module.exports = {
  "development": {
    "MONGO_DB_STRING": process.env.MONGO_DB_STRING || "mongodb://mongoadmin:password@localhost:27017/psychmatch?authSource=admin",
    "deepl": {
      "API": "https://api-free.deepl.com/v2/translate",
      "KEY": process.env.DEEPL_API_KEY || "",
    },
    "nlpmodel": {
      "API": "https://nlp-model.psychmatch.app.levell.ch"
    },
    "SAML": {
      "credentials": {
          "tenantID": process.env.AZURE_TENANT_ID || "",
          "clientID": process.env.AZURE_CLIENT_ID || "",
          "audience": process.env.AZURE_CLIENT_ID || ""
      },
      "resource": {
          "scope": ["access_as_user"]
      },
      "metadata": {
          "authority": "login.microsoftonline.com",
          "discovery": ".well-known/openid-configuration",
          "version": "v2.0"
      },
      "settings": {
          "passReqToCallback": false,
          "loggingLevel": "info"
      }
    }
  },
  "test": {
    "MONGO_DB_STRING": "mongodb://localhost:27017/documents",
    "deepl": {
      "API": "https://api-free.deepl.com/v2/translate",
      "KEY": process.env.DEEPL_API_KEY || "",
    },
    "nlpmodel": {
      "API": "http://psychmatch-nlp-model:5000"
    },
    "SAML": {
      "credentials": {
          "tenantID": process.env.AZURE_TENANT_ID || "",
          "clientID": process.env.AZURE_CLIENT_ID || "",
          "audience": process.env.AZURE_CLIENT_ID || ""
      },
      "resource": {
          "scope": ["access_as_user"]
      },
      "metadata": {
          "authority": "login.microsoftonline.com",
          "discovery": ".well-known/openid-configuration",
          "version": "v2.0"
      },
      "settings": {
          "passReqToCallback": false,
          "loggingLevel": "info"
      }
    }
  },
  "production": {
    "MONGO_DB_STRING": dockerSecret.read('MONGO_DB_STRING'),
    "deepl": {
      "API": "https://api-free.deepl.com/v2/translate",
      "KEY": dockerSecret.read('DEEPL_API_KEY') || "",
    },
    "nlpmodel": {
      "API": "http://psychmatch-nlp-model:5000"
    },
    "SAML": {
      "credentials": {
          "tenantID": dockerSecret.read('AZURE_TENANT_ID') || "",
          "clientID": dockerSecret.read('AZURE_CLIENT_ID') || "",
          "audience": dockerSecret.read('AZURE_CLIENT_ID') || ""
      },
      "resource": {
          "scope": ["access_as_user"]
      },
      "metadata": {
          "authority": "login.microsoftonline.com",
          "discovery": ".well-known/openid-configuration",
          "version": "v2.0"
      },
      "settings": {
          "passReqToCallback": false,
          "loggingLevel": "info"
      }
    }
  }
}