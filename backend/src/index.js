const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const dbConfig = require('./database/db');
const documentApi = require('./routes/documentRoutes')
const psychologistApi = require('./routes/psychologistRoutes')
const app = express();
const port = process.env.BACKEND_PORT || 3000;

// MongoDB configuration
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
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