require('dotenv').config({ path: '.env' });

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const passport = require("passport");
const swaggerUi = require('swagger-ui-express');

const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const app = express();
const port = process.env.BACKEND_PORT || 3000;

const swaggerDocument = require('./swagger');
const documentApi = require('./routes/documentRoutes')
const psychologistApi = require('./routes/psychologistRoutes')

// Azure AD authentication
const options = {
  identityMetadata: `https://${config.SAML.metadata.authority}/${config.SAML.credentials.tenantID}/${config.SAML.metadata.version}/${config.SAML.metadata.discovery}`,
  issuer: `https://${config.SAML.metadata.authority}/${config.SAML.credentials.tenantID}/${config.SAML.metadata.version}`,
  clientID: config.SAML.credentials.clientID,
  audience: config.SAML.credentials.audience,
  validateIssuer: config.SAML.settings.validateIssuer,
  passReqToCallback: config.SAML.settings.passReqToCallback,
  loggingLevel: config.SAML.settings.loggingLevel,
  scope: config.SAML.resource.scope
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
  // Send user info using the second argument
  done(null, {}, token);
  }
);

// load environmental dependent MongoDB configuration
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGO_DB_STRING, {
  useNewUrlParser: true
}).then(() => {
  console.log('Database sucessfully connected')
},
  error => {
    console.log('Database could not be connected: ' + error)
  }
)

// enable cors
app.use(cors());

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}
app.use(passport.initialize());
passport.use(bearerStrategy);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// publish API
app.use('/api/documents', passport.authenticate('oauth-bearer', {session: false}), documentApi)
app.use('/api/psychologists', passport.authenticate('oauth-bearer', {session: false}), psychologistApi)

// publish Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// start app
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})