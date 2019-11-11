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

const USER_BRAND_TABLE = process.env.USER_BRAND_TABLE;

/**
 * API HEALTH
 */
app.get('/mobile-brands/health', function (request, response) {
	res.status(200).send({service: 'userBrand Manager', isAlive: true});
});

/**
 * READ ONE
 */
app.get("/mobile-brands/:id", function(request, response) {

});

/**
 * READ ALL
 */
app.get('/mobile-brands', function (request, response) {

});

/**
 * UPDATE
 */
app.put('/mobile-brands', function (request, response) {
	winston.debug('Updating user brand: ' + request);
	// init the params from the request data
});

/**
 * DELETE
 */
app.delete('/mobile-brands/:userBrandId', function (request, response) {
	winston.debug('Deleting user brand: ' + request);
	// init parameter structure
});

module.exports.handler = serverless(app);
