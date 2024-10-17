const { RateLimiterRedis } = require('rate-limiter-flexible');
const Redis = require('redis');
const { findUserID } = require('../../models/auth/Token');
const client = require('../../config/redisConfig'); // Ensure this file exports a valid Redis client

// Initialize rate limiters for valid and anonymous users
const rateLimiters = {
  validUser: new RateLimiterRedis({
    storeClient: client,
    points: 100, // 100 requests per minute
    duration: 60, // Per minute
  }),
  anonUser: new RateLimiterRedis({
    storeClient: client,
    points: 10, // 10 requests per minute
    duration: 60, // Per minute
  }),
};

// Middleware function to apply rate limiting
const rateLimiterMiddleware = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    let rateLimiter;

    // Check if the token is valid
    if (token) {
      const userId = await findUserID(token);

      if (userId) {
        // Valid user, apply the validUser rate limiter
        rateLimiter = rateLimiters.validUser;
      } else {
        // Invalid token, treat as anonymous
        rateLimiter = rateLimiters.anonUser;
      }
    } else {
      // No token, treat as anonymous user
      rateLimiter = rateLimiters.anonUser;
    }

    // Apply the appropriate rate limiter
    await rateLimiter.consume(req.ip);
    next(); // Proceed to the next middleware or route handler

  } catch (err) {
    // Instead of `instanceof RateLimiterRes`, check for `msBeforeNext`
    if (err && err.msBeforeNext) {
      
      // return res.status(429).json({
      //   message: 'Too many requests',
      //   retryAfter: Math.ceil(err.msBeforeNext / 1000), // Retry time in seconds
      // });
      return res.status(429).redirect('/429_error')
    }
    // Handle other errors
    console.error('Error in rate limiter middleware:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  rateLimiterMiddleware,
};

