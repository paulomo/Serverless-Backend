const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const AWS = require("aws-sdk");

// Configure Logging
const winston = require('winston');

// AWS Services
const S3 = new AWS.S3(require("./s3config.js")());

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({ strict: false }));

const USER_REVIEWS_TABLE = process.env.USER_REVIEWS_TABLE;


/**
 * HEALTH
 */
app.get('/mobile-reviews/health', function (request, response) {
	res.status(200).send({service: 'User Review Manager', isAlive: true});
});

/**
 * READ ONE
 */
app.get('/mobile-reviews/:id', function (request, response) {
	winston.debug('Fetching user review: ' + request);
	// init params structure with request params
	
});

/**
 * READ ALL
 */
app.get("/mobile-reviews", function(request, response) {
  
});

/**
 * UPDATE ONE
 */
app.put('/mobile-reviews/:id', function (request, response) {
	winston.debug('Updating user review: ' + request);
	// init the params from the request data
	
});

/**
 * DELETE
 */
app.delete('/mobile-reviews/:id', function (request, response) {
	winston.debug('Deleting user review: ' + request);
	// init parameter structure

});

module.exports.handler = serverless(app);

