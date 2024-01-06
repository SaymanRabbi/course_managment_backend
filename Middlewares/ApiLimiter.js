const rateLimit = require('express-rate-limit');

exports.apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, //max api request 10
    message:'Too many requests, please try again later'
})