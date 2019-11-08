const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const AWS = require("aws-sdk");

// UUID Generator Module
const uuidV4 = require('uuid/v4').default;
// Configure Logging
const winston = require('winston');

// AWS Services
const S3 = new AWS.S3(require("./s3config.js")());

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({ strict: false }));

const USER_FIT_TABLE = process.env.USER_FIT_TABLE;

/**
 * API HEALTH
 */
app.get('/mobile-fits/health', function (request, response) {
	res.status(200).send({service: 'User Fit Manager', isAlive: true});
});

/**
 * READ ONE
 */
app.get('/mobile-fits/:id', function (requset, response) {
	winston.debug('Fetching user fit: ' + req.params.id);
	// init params structure with request params
});

/**
 * READ ALL
 */
app.get("/mobile-fits", function(request, response) {

});

/**
 * CREATE
 */
app.get('/mobile-fits', function (request, response) {

});

/**
 * UPDATE
 */
app.put('/mobile-fits/:id', function (request, response) {
	winston.debug('Updating user fit: ' + request);
	// init the params from the request data
});

/**
 * DELETE
 */
app.delete('/mobile-fits/:id', function (request, response) {
	winston.debug('Deleting user brand: ' + request);
	// init parameter structure

});

module.exports.handler = serverless(app);

