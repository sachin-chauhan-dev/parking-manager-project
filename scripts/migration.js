// environment: development, staging, production
const dbService = require('../api/services/db.service');
const config = require('../config/');

const environment = process.env.NODE_ENV;
dbService(environment, config.migrate).start();