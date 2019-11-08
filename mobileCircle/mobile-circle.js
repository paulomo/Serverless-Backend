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
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const S3 = new AWS.S3(require("./s3config.js")());

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({ strict: false }));

const USER_CIRCLE_TABLE = process.env.USER_CIRCLE_TABLE;

/**
 * API HEALTH
 */
app.get('/mobile-circles/health', function (request, response) {
	res.status(200).send({service: 'User Circle Manager', isAlive: true});
});

/**
 * READ ONE
 */
app.get('/mobile-circles/:id', function (request, response) {
	winston.debug('Fetching user circle: ' + req.params.id);
	// init params structure with request params

});

/**
 * READ ALL
 */
app.get("/mobile-circles", function(request, response) {

});

/**
 * CREATE
 */
app.get('/mobile-circles', function (request, response) {

});

/**
 * UPDATE
 */
app.put('/mobile-circles/:id', function (request, response) {
	winston.debug('Updating user circle: ' + request);
	// init the params from the request data

});

/**
 * DELETE
 */
app.delete('/mobile-circles/:id', function (request, response) {
	winston.debug('Deleting user circle: ' + request);
	// init parameter structure

});

module.exports.handler = serverless(app);

