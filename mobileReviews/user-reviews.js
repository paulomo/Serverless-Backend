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

const USER_REVIEWS_TABLE = process.env.USER_REVIEWS_TABLE;

// Get Brand endpoint
app.get('/user-reviews/health', function (req, res) {
	res.status(200).send({service: 'User Review Manager', isAlive: true});
});

// Create REST entry points
app.get('/user-reviews/userReviewsId', function (req, res) {
	winston.debug('Fetching user review: ' + req.params.id);
	// init params structure with request params
	var params = {
		userReviewId: req.params.id
	};
});

app.get("/user-reviews/:userReviewId", function(request, response) {
  const params = {
    TableName: USER_REVIEWS_TABLE,
    Key: {
      userReviewId: request.params.userReviewId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/user-reviews', function (req, res) {
	var searchParams = {
		TableName: process.env.USER_REVIEWS_TABLE,
		KeyConditionExpression: "userReviewId = :userReviewId",
		ExpressionAttributeValues: {
			":userReviewId": req.params.userReviewId
		}
	};
});

app.put('/user-reviews', function (req, res) {
	winston.debug('Updating user review: ' + req.body.userReviewId);
	// init the params from the request data
	var keyParams = {
		userReviewId: req.body.userReviewId
	};
	winston.debug('Updating user brand: ' + req.body.userReviewId);
	var reviewUpdateParams = {
		TableName: userBrandSchema.TableName,
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

app.delete('/user-reviews/:userReviewId', function (req, res) {
	winston.debug('Deleting user review: ' + req.params.id);
	// init parameter structure
	var deleteUserReviewParams = {
		TableName: process.env.USER_REVIEWS_TABLE,
		Key: {
			userReviewId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

