// import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const hotsauceRoute = require('./routes/hotsauce.route');
const log = require('./config/logger');
const morgan = require('morgan');
const { startDatabase } = require('./database/mongodb');

// initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// configure middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// adding morgan to log HTTP requests
app.use(morgan('combined'));


// configure routes
app.use('/api/hotsauces', hotsauceRoute);

// invalid route
app.use('*', (req, res) => {
    res.status(404).send('Invalid route');
});

// start the server after the database is started
startDatabase()
  .then(async () => {
    // insert ads into the database
    // await insertAds([{ title: 'Hello, world (again)!' }]);

    app.listen(PORT, () => {
      log.info(`Server started on port ${PORT}!`);
    });
  })
  .catch((error) => {
    log.info('Error starting the database:', error);
  });
