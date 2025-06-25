const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const ErrorLog = require('../../models/security/ErrorLog');

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ],
});

// Function to log errors to the database
const logErrorToDb = async (level, message, stack, req) => {
  try {
    await ErrorLog.create({
      level,
      message,
      stack: stack || null,
      userId: req.user ? req.user.id : null,
      url: req.originalUrl,
      method: req.method,
    });
  } catch (error) {
    console.error('Failed to log error to database:', error);
  }
};

// Middleware to log requests and errors
const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};

const errorLogger = (error, req, res, next) => {
  logger.error(`Error: ${error.message}`, { stack: error.stack });
  
  // Also log to the database
  logErrorToDb('error', error.message, error.stack, req);
  
  next(error);
};

module.exports = {
  logger,
  requestLogger,
  errorLogger,
};