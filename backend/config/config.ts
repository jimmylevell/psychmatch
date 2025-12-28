import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env' });

function getDockerSecret(secret_name: string): string {
    try {
        return fs.readFileSync(`/run/secrets/${secret_name}`, 'utf8').trim();
    } catch (err: any) {
        if (err.code !== 'ENOENT') {
            console.error(`An error occurred while trying to read the secret: ${secret_name}. Err: ${err}`);
        } else {
            console.log(`Could not find the secret, probably not running in swarm mode: ${secret_name}. Err: ${err}`);
        }
        return '';
    }
}

interface Config {
    MONGO_DB_STRING: string;
    deepl: {
        API: string;
        KEY: string;
    };
    nlpmodel: {
        API: string;
    };
    SAML: {
        credentials: {
            tenantID: string;
            clientID: string;
            audience: string;
        };
        resource: {
            scope: string[];
        };
        metadata: {
            authority: string;
            discovery: string;
            version: string;
        };
        settings: {
            passReqToCallback: boolean;
            loggingLevel: string;
        };
    };
}

interface Configs {
    development: Config;
    test: Config;
    production: Config;
}

const configs: Configs = {
    development: {
        MONGO_DB_STRING: process.env.MONGO_DB_STRING || "mongodb://mongoadmin:password@localhost:27017/psychmatch?authSource=admin",
        deepl: {
            API: "https://api-free.deepl.com/v2/translate",
            KEY: process.env.DEEPL_API_KEY || "",
        },
        nlpmodel: {
            API: "https://nlp-model.psychmatch.app.levell.ch/"
        },
        SAML: {
            credentials: {
                tenantID: process.env.AZURE_TENANT_ID || "",
                clientID: process.env.AZURE_CLIENT_ID || "",
                audience: process.env.AZURE_CLIENT_ID || ""
            },
            resource: {
                scope: ["access_as_user"]
            },
            metadata: {
                authority: "login.microsoftonline.com",
                discovery: ".well-known/openid-configuration",
                version: "v2.0"
            },
            settings: {
                passReqToCallback: false,
                loggingLevel: "info"
            }
        }
    },
    test: {
        MONGO_DB_STRING: "mongodb://localhost:27017/documents",
        deepl: {
            API: "https://api-free.deepl.com/v2/translate",
            KEY: process.env.DEEPL_API_KEY || "",
        },
        nlpmodel: {
            API: "http://psychmatch-nlp-model:5000"
        },
        SAML: {
            credentials: {
                tenantID: process.env.AZURE_TENANT_ID || "",
                clientID: process.env.AZURE_CLIENT_ID || "",
                audience: process.env.AZURE_CLIENT_ID || ""
            },
            resource: {
                scope: ["access_as_user"]
            },
            metadata: {
                authority: "login.microsoftonline.com",
                discovery: ".well-known/openid-configuration",
                version: "v2.0"
            },
            settings: {
                passReqToCallback: false,
                loggingLevel: "info"
            }
        }
    },
    production: {
        MONGO_DB_STRING: getDockerSecret('MONGO_DB_STRING'),
        deepl: {
            API: "https://api-free.deepl.com/v2/translate",
            KEY: getDockerSecret('DEEPL_API_KEY') || "",
        },
        nlpmodel: {
            API: "http://psychmatch-nlp-model:5000"
        },
        SAML: {
            credentials: {
                tenantID: getDockerSecret('AZURE_TENANT_ID') || "",
                clientID: getDockerSecret('AZURE_CLIENT_ID') || "",
                audience: getDockerSecret('AZURE_CLIENT_ID') || ""
            },
            resource: {
                scope: ["access_as_user"]
            },
            metadata: {
                authority: "login.microsoftonline.com",
                discovery: ".well-known/openid-configuration",
                version: "v2.0"
            },
            settings: {
                passReqToCallback: false,
                loggingLevel: "info"
            }
        }
    }
};

export default configs;
export type { Config, Configs };
