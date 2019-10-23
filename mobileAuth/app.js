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
    app.get("/user/health", function(req, res) {});
    
    /**
     * Get user attributes
     */
    app.get("/user/:id", function(req, res) {});
    
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
    app.post("/user", function(req, res) {});
    
    app.post("/user/create", function(req, res) {});
    
    /**
     * Enable a user that is currently disabled
     */
    app.put("/user/enable", function(req, res) {});
    
    /**
     * Disable a user that is currently enabled
     */
    app.put("/user/disable", function(req, res) {});
    
    /**
     * Update a user's attributes
     */
    app.put("/user", function(req, res) {});
    
    /**
     * Delete a user
     */
    app.delete("/user/:id", function(req, res) {});
      

};