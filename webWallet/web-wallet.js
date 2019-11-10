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

const WALLET_TABLE = process.env.WALLET_TABLE;

/**
 * API HEALTH
 */
app.get('/web-wallets/health', async function (request, response) {
	resquest.status(200).send({service: 'Wallet Manager', isAlive: true});
});

/**
 * READ ONE
 */
app.get('/web-wallets/:id', async function (request, response) {
	winston.debug('Fetching wallet: ' + request);
	// init params structure with request params
});

/**
 * READ ALL
 */
app.get("/web-wallets", async function(request, response) {

});

/**
 * CREATE
 */
app.get('/web-wallets', function (request, reponses) {

});

/**
 * UPDATE
 */
app.put('/web-wallets/:id', async function (request, response) {
	winston.debug('Updating wallet: ' + request);
	// init the params from the request data
});

/**
 * DELETE
 */
app.delete('/web-wallets/:id', function (request, response) {
	winston.debug('Deleting product: ' + req.params.id);
	// init parameter structure

});

module.exports.handler = serverless(app);

