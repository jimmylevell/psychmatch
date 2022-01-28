require('dotenv').config({ path: '.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const documentApi = require('./routes/documentRoutes')
const psychologistApi = require('./routes/psychologistRoutes')
const dockerSecret = require('./utils/dockersecret');
const app = express();
const port = process.env.BACKEND_PORT || 3000;

// MongoDB configuration
let db = process.env.MARIAN_DB_STRING
if (process.env.NODE_ENV === "production") {
    dockerSecret.read('MARIAN_DB_STRING')
}
mongoose.Promise = global.Promise;
mongoose.connect(db, {
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// publish API
app.use('/api/documents', documentApi)
app.use('/api/psychologist', psychologistApi)

// start app
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})