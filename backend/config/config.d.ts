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
declare const configs: Configs;
export default configs;
export type { Config, Configs };
//# sourceMappingURL=config.d.ts.map