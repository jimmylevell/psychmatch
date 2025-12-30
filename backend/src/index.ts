import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import jwksRsa from 'jwks-rsa';
import swaggerUi from 'swagger-ui-express';
import configs from './config/config';

const env = (process.env.NODE_ENV || 'development') as keyof typeof configs;
const config = configs[env];

import swaggerDocument from './swagger';
import documentApi from './routes/documentRoutes';
import psychologistApi from './routes/psychologistRoutes';
import userApi from './routes/userRoutes';
import { populateUserRole } from './middleware/auth';

const app: Application = express();
const port = process.env.BACKEND_PORT || 3000;

// Azure AD JWT authentication
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  audience: config.SAML.credentials.audience,
  issuer: `https://${config.SAML.metadata.authority}/${config.SAML.credentials.tenantID}/${config.SAML.metadata.version}`,
  algorithms: ['RS256'],
  secretOrKeyProvider: jwksRsa.passportJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.SAML.metadata.authority}/${config.SAML.credentials.tenantID}/discovery/v2.0/keys`
  })
};

const jwtStrategy = new JwtStrategy(jwtOptions, (payload: any, done: Function) => {
  // Validate token payload
  if (!payload) {
    return done(null, false);
  }
  // Send user info using the second argument
  done(null, { userId: payload.oid || payload.sub }, payload);
});

// load environmental dependent MongoDB configuration
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGO_DB_STRING).then(() => {
  console.log('Database sucessfully connected')
},
  error => {
    console.error('Database could not be connected: ' + error)
  }
);

// enable cors
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  console.log("Running in DEV mode")
  app.use(morgan('dev'));
} else {
  console.log("Running in PROD mode")
  app.use(morgan('combined'));
}

app.use(passport.initialize());
passport.use(jwtStrategy);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

// publish API with authentication and role population
app.use('/api/documents', passport.authenticate('jwt', { session: false }), populateUserRole, documentApi);
app.use('/api/psychologists', passport.authenticate('jwt', { session: false }), populateUserRole, psychologistApi);
app.use('/api/users', passport.authenticate('jwt', { session: false }), populateUserRole, userApi);

// publish Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// start app
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
});

export default app;
