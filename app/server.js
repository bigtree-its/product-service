require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
var cors = require('cors');

require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' });

const app = express();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
    // parse requests of content-type - application/json
app.use(bodyParser.json())

var callLogger = (req, res, next) => {
        let qs = querystring.stringify(req.query);
        console.log(`Request from: ${req.get('origin')} ${req.method}: ${req.path} ${qs}`);
        next();
    }
    // Add logger middleware before router middleware to express
    // .use(middleware)  is the syntax to add middleware to express
app.use(callLogger);

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

// Database configurations
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// connect to database
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
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

// Enable pre-flight across-the-board
// var whitelist = ['http://localhost:3000', 'http://localhost']
// var corsOptionsDelegate = function(req, callback) {
//     var corsOptions;
//     if (whitelist.indexOf(req.header('Origin')) !== -1) {
//         corsOptions = {
//                 origin: true,
//                 methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//                 preflightContinue: false,
//                 optionsSuccessStatus: 204,
//                 "Set-Cookie": "HttpOnly;Secure;SameSite=Strict"
//             } // reflect (enable) the requested origin in the CORS response
//     } else {
//         corsOptions = {
//                 origin: false,
//                 methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//                 preflightContinue: false,
//                 optionsSuccessStatus: 204,
//                 "Set-Cookie": "HttpOnly;Secure;SameSite=Strict"
//             } // disable CORS for this request
//     }
//     callback(null, corsOptions) // callback expects two parameters: error and options
// }

app.options('*', cors())
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, PUT, PATCH, POST");
    next();
})

// Other routes
require('./route/category')(app);
require('./route/brand')(app);
require('./route/product')(app);
require('./route/department')(app);
require('./route/review')(app);
require('./route/qa')(app);
require('./route/carousel')(app);
require('./route/collection')(app);
app.use('/health', require('./route/healthcheck'));

//Listen for requests
app.listen(process.env.PORT, () => {
    console.log(`Server listening on ${process.env.PORT}`);
    console.log(`Server Context Path ${process.env.CONTEXT_PATH}`);
});