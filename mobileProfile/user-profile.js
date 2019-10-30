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

const USER_PROFILE_TABLE = process.env.USER_PROFILE_TABLE;

// Get Brand endpoint
app.get('/user-profiles/health', function (req, res) {
	res.status(200).send({service: 'userBrand Manager', isAlive: true});
});

// Create REST entry points
app.get('/user-profiles/:userProfileId', function (req, res) {
	winston.debug('Fetching user profile: ' + req.params.id);
	// init params structure with request params
	var params = {
		userProfileId: req.params.id
	};
});

app.get("/user-profiles/:userProfileId", function(request, response) {
  const params = {
    TableName: USER_PROFILE_TABLE,
    Key: {
      userProfileId: request.params.userProfileId
    }
  };

  dynamoDb.get(params, (error, result) => {});
});

app.get('/user-profiles', function (req, res) {
	var searchParams = {
		TableName: process.env.USER_PROFILE_TABLE,
		KeyConditionExpression: "userProfileId = :userProfileId",
		ExpressionAttributeValues: {
			":userProfileId": req.params.userProfileId
		}
	};
});

app.put('/user-profiles', function (req, res) {
	winston.debug('Updating user profile: ' + req.body.userProfileId);
	// init the params from the request data
	var keyParams = {
		userProfileId: req.body.userProfileId
	};
	winston.debug('Updating user profile: ' + req.body.userProfileId);
	var profileUpdateParams = {
		TableName: userProfileSchema.TableName,
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

app.delete('/user-profiles/:userProfileId', function (req, res) {
	winston.debug('Deleting user profile: ' + req.params.id);
	// init parameter structure
	var deleteUserProfileParams = {
		TableName: process.env.USER_PROFILE_TABLE,
		Key: {
			userProfileId: req.params.id
		}
	};
});

module.exports.handler = serverless(app);

// Get User endpoint
app.get('/users/:userId', function (req, res) {
	const params = {
	  TableName: USERS_TABLE,
	  Key: {
		userId: req.params.userId,
	  },
	}
  
	dynamoDb.get(params, (error, result) => {
	  if (error) {
		console.log(error);
		res.status(400).json({ error: 'Could not get user' });
	  }
	  if (result.Item) {
		const {userId, name} = result.Item;
		res.json({ userId, name });
	  } else {
		res.status(404).json({ error: "User not found" });
	  }
	});
  })


  // Create User endpoint
app.post('/users', function (req, res) {
	const { userId, name } = req.body;
	if (typeof userId !== 'string') {
	  res.status(400).json({ error: '"userId" must be a string' });
	} else if (typeof name !== 'string') {
	  res.status(400).json({ error: '"name" must be a string' });
	}
  
	const params = {
	  TableName: USERS_TABLE,
	  Item: {
		userId: userId,
		name: name,
	  },
	};
  
	dynamoDb.put(params, (error) => {
	  if (error) {
		console.log(error);
		res.status(400).json({ error: 'Could not create user' });
	  }
	  res.json({ userId, name });
	});
  })