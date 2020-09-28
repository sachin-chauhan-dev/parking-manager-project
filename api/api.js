/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');

/**
 * server configuration
 */
const config = require('../config/');
const dbService = require('./services/db.service');
const auth = require('./policies/auth.policy');

// environment: development, staging, production
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const mappedOpenRoutes = mapRoutes(config.publicRoutes, 'api/controllers/');
const mappedAuthRoutes = mapRoutes(config.privateRoutes, 'api/controllers/');
const DB = dbService(environment, config.migrate).start();
const morgan = require('morgan');
const uniqueRequestId = require('./services/uuid.service');

morgan.token('id', (req) => req.id);
app.use(uniqueRequestId);
app.use(morgan(':id :method :url :response-time'));

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

// secure express app
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// secure your private routes with jwt authentication middleware
app.all('/parkingmanager/*', (req, res, next) => auth(req, res, next));

// fill routes for express application
app.use('/', mappedOpenRoutes);
app.use('/parkingmanager', mappedAuthRoutes);

server.listen(config.port, () => {
  if (environment !== 'production' &&
    environment !== 'development'
  ) {
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  return DB;
});
