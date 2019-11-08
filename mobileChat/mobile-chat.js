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

const USER_CHAT_TABLE = process.env.USER_CHAT_TABLE;

/**
 * API HEALTH
 */
app.get('/mobile-chats/health', function (request, response) {
	res.status(200).send({service: 'User Chat Manager', isAlive: true});
});

/**
 * READ ONE
 */
app.get("/mobile-chats/:id", function(request, response) {
  
});

/**
 * READ
 */
app.get('/mobile-chats/:id', function (request, response) {
	winston.debug('Fetching user chat: ' + request);
	// init params structure with request params
	
});

/**
 * CREATE
 */
app.post('/mobile-chats', function (request, response) {
	
});

/**
 * UPDATE
 */
app.put('/mobile-chats/:id', function (request, response) {
	winston.debug('Updating user chat: ' + request);
	// init the params from the request data

});

/**
 * DELETE
 */
app.delete('/mobile-chats/:id', function (request, response) {
	winston.debug('Deleting user chat: ' + request);
	// init parameter structure
	
});

module.exports.handler = serverless(app);

