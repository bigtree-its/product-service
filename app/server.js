const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

var callLogger = function (req, res, next) {
    console.log(`Received request for ${req.method} ${req.path}`);
    next();
}

app.use(callLogger);

// Database configurations
const mongoose = require('mongoose');
const config = require('./config/application-config');
const port = config.port;
mongoose.Promise = global.Promise;

// connect to database
mongoose.connect(config.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("Successfully connected to database"); })
    .catch(err => {
        console.error("Cannot connect to the database. Exiting now", err);
        process.exit();
    })

//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Require routes
require('./route/category')(app);
require('./route/brand')(app);
require('./route/product')(app);

//Listen for requests
app.listen(port, () => {
    console.log(`Server listening on ${port}`);
    // console.log('Server listening on Port '+ port);
});