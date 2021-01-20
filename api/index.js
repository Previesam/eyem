const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');


// create express app
const app = express();

// Cross-Origin resource sharing check
app.use(cors());

// morgan implementation logging of request information
app.use(morgan('common'));

// Implement compression of request
app.use(compression());

// Implement helmet for more security
app.use(helmet());

// Use Express Static
app.use(express.static(__dirname + '/public'));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
 
// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to our api."});
});

// Require routes

require('./routes/user.route.js')(app);
require('./routes/job.route.js')(app);
// require('./routes/business.route.js')(app);
// require('./routes/category.route.js')(app);
// require('./routes/product.route.js')(app);
// require('./routes/event.route.js')(app);
// require('./routes/service.route.js')(app);
// require('./routes/role.route.js')(app);

// Export server for requests
module.exports = {
    path: "/api/",
    handler: app
}