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
      console.log('Rate Limiting Middleware: Starting');
      const token = req.headers['authorization'];
  
      let rateLimiter;
  
      if (token) {
        const userId = await findUserID(token);
        console.log('User ID:', userId);
  
        if (userId) {
          rateLimiter = rateLimiters.validUser;
          console.log('Using validUser rate limiter');
        } else {
          rateLimiter = rateLimiters.anonUser;
          console.log('Using anonUser rate limiter');
        }
      } else {
        rateLimiter = rateLimiters.anonUser;
        console.log('No token provided, using anonUser rate limiter');
      }
  
      await rateLimiter.consume(req.ip);
      console.log('Rate limit check passed for IP:', req.ip);
      next();
    } catch (err) {
      if (err instanceof RateLimiterRedis.RateLimiterRes) {
        console.error('Rate limit exceeded:', err);
        return res.status(429).json({
          message: 'Too many requests',
          retryAfter: Math.ceil(err.msBeforeNext / 1000),
        });
      }
      console.error('Error in rate limiter middleware:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

module.exports = {
  rateLimiterMiddleware,
};
