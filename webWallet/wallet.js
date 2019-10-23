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

// Get Brand endpoint
app.get('/wallets/health', function (req, res) {
	res.status(200).send({service: 'Wallet Manager', isAlive: true});
});

// Create REST entry points
app.get('/wallets/:id', function (req, res) {
	winston.debug('Fetching wallet: ' + req.params.id);
	// init params structure with request params
	var params = {
		walletId: req.params.id
	};
});

app.get("/wallets/:walletId", function(request, response) {
  const params = {
    TableName: WALLET_TABLE,
    Key: {
      walletId: request.params.walletId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/wallets', function (req, res) {
	var searchParams = {
		TableName: process.env.WALLET_TABLE,
		KeyConditionExpression: "walletId = :walletId",
		ExpressionAttributeValues: {
			":walletId": req.params.walletId
		}
	};
});

app.put('/wallets', function (req, res) {
	winston.debug('Updating wallet: ' + req.body.walletId);
	// init the params from the request data
	var keyParams = {
		walletId: req.body.walletId
	};
	winston.debug('Updating brand: ' + req.body.walletId);
	var walletUpdateParams = {
		TableName: walletSchema.TableName,
		Key: keyParams,
		UpdateExpression: "set " +
				"sku=:sku, " +
				"title=:title, " +
				"description=:description, " +
				"#condition=:condition, " +
				"conditionDescription=:conditionDescription, " +
				"numberInStock=:numberInStock, " +
				"unitCost=:unitCost",
		ExpressionAttributeNames: {
			'#condition': 'condition'
		},
		ExpressionAttributeValues: {
			":sku": req.body.sku,
			":title": req.body.title,
			":description": req.body.description,
			":condition": req.body.condition,
			":conditionDescription": req.body.conditionDescription,
			":numberInStock": req.body.numberInStock,
			":unitCost": req.body.unitCost
		},
		ReturnValues: "UPDATED_NEW"
	};
});

app.delete('/wallets/:walletId', function (req, res) {
	winston.debug('Deleting product: ' + req.params.id);
	// init parameter structure
	var deleteWalletParams = {
		TableName: process.env.WALLET_TABLE,
		Key: {
			productId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

