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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({ strict: false }));

const USER_PURCHASE_TABLE = process.env.USER_PURCHASE_TABLE;

/**
 * API HEALTH
 */
app.get('/mobile-purchases/health', function (request, response) {
	response.status(200).send({service: 'userBrand Manager', isAlive: true});
});

/**
 * READ ALL
 */
app.get('/mobile-purchases', function (request, response) {
	winston.debug('Fetching user purchase: ' + request);
	// init params structure with request params

});

/**
 * READ ONE
 */
app.get("/mobile-purchases/:id", function(request, response) {

});

/**
 * CREATE
 */
app.post("/mobile-purchases", async function(request, response) {

});

/**
 * DELETE
 */
app.delete('/mobile-purchases/:id', function (request, response) {
	winston.debug('Deleting user purchase: ' + request);
	// init parameter structure

});

module.exports.handler = serverless(app);

