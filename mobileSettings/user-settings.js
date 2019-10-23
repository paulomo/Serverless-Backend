export function index() {}
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

const USER_SETTING_TABLE = process.env.USER_SETTING_TABLE;

// Get Brand endpoint
app.get('/user-settings/health', function (req, res) {
	res.status(200).send({service: 'userBrand Manager', isAlive: true});
});

// Create REST entry points
app.get('/user-settings/:id', function (req, res) {
	winston.debug('Fetching user setting: ' + req.params.id);
	// init params structure with request params
	var params = {
		userSettingId: req.params.id
	};
});

app.get("/user-settings/:userSettingId", function(request, response) {
  const params = {
    TableName: USER_SETTING_TABLE,
    Key: {
      userSettingId: request.params.userSettingId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/user-settings', function (req, res) {
	var searchParams = {
		TableName: process.env.USER_SETTING_TABLE,
		KeyConditionExpression: "userSettingId = :userSettingId",
		ExpressionAttributeValues: {
			":userSettingId": req.params.userSettingId
		}
	};
});

app.put('/user-settings', function (req, res) {
	winston.debug('Updating user setting: ' + req.body.userSettingId);
	// init the params from the request data
	var keyParams = {
		userSettingId: req.body.userSettingId
	};
	winston.debug('Updating user setting: ' + req.body.userSettingId);
	var settingUpdateParams = {
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

app.delete('/user-settings/:userSettingId', function (req, res) {
	winston.debug('Deleting user setting: ' + req.params.id);
	// init parameter structure
	var deleteUserSettingParams = {
		TableName: process.env.USER_SETTING_TABLE,
		Key: {
			userSettingId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

