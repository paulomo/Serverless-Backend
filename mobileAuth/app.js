// Require AWS, Express
const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");

// AWS Services
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const S3 = new AWS.S3(require("./s3config.js")());

// configure express
const app = express();
app.use(bodyParser.json({ strict: false }));


module.exports = async () => {
    app.get("/users/health", function(req, res) {});
    
    /**
     * Get user attributes
     */
    app.get("/users/:userId", function(req, res) {});
    
    /**
     * Get a list of users using a tenant id to scope the list
     */
    app.get("/users", function(req, res) {});
    
    /**
     * Get a list of users using a tenantId and locationId to scope the list
     */
    app.get("/users", function(req, res) {});
    
    /**
     * Create a new user
     */
    app.post("/users/create", function(req, res) {});
    
    /**
     * Enable a user that is currently disabled
     */
    app.put("/users/enable", function(req, res) {});
    
    /**
     * Disable a user that is currently enabled
     */
    app.put("/users/disable", function(req, res) {});
    
    /**
     * Update a user's attributes
     */
    app.put("/users", function(req, res) {});
    
    /**
     * Delete a user
     */
    app.delete("/users/:userId", function(req, res) {});
      

};