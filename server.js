const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// parse requests of content-type - application/json
app.use(bodyParser.json())


// Database configurations
const mongoose = require('mongoose');
const dbConfig = require('./app/config/database.config');
mongoose.Promise = global.Promise;

// connect to database
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
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
require('./app/route/category')(app);
// require('./app/route/product.js')(app);
require('./app/route/brand')(app);

//Listen for requests
app.listen(3000, () => {
    console.log("Server listening on Port 3000");
});