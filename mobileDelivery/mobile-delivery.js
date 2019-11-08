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

const USER_DELIVERY_TABLE = process.env.USER_DELIVERY_TABLE;

/**
 * API HEALTH
 */
app.get('/mobile-deliveries/health', function (request, response) {
	res.status(200).send({service: 'User Delivery Manager', isAlive: true});
});

/**
 * READ ONE
 */
app.get('/mobile-deliveries/:id', function (request, response) {
	winston.debug('Fetching user delivery: ' + request);
	// init params structure with request params

});

/**
 * READ ALL
 */
app.get("/mobile-deliveries", function(request, response) {

});

/**
 * CREATE
 */
app.post('/mobile-deliveries', function (request, response) {

});

/**
 * UPDATE
 */
app.put('/mobile-deliveries/:id', function (request, response) {
	winston.debug('Updating user delivery: ' + request);
	// init the params from the request data

});

/**
 * DELETE
 */
app.delete('/user-deliveries/:id', function (request, response) {
	winston.debug('Deleting user delivery: ' + request);
	// init parameter structure

});

module.exports.handler = serverless(app);

