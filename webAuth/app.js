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
    app.get("/brands/health", function(req, res) {});
      
    /**
     * WARNING: THIS WILL REMOVE THE DYNAMODB TABLES FOR THIS QUICKSTART.
     * NOTE: In production, it is recommendended to have a backup of all Tables, and only manage these tables from corresponding micro-services.
     * Delete DynamoDB Tables required for the Infrastructure including the User, Tenant, Product, and Order Tables.
     */
    app.delete("/brands/tables", function(req, res) {});
    
    /**
     * WARNING: THIS WILL REMOVE ALL THE COGNITO USER POOLS, IDENTITY POOLS, ROLES, AND POLICIES CREATED BY THIS QUICKSTART.
     * Delete Infrastructure Created by Multi-tenant Identity Reference Architecture
     */
    app.delete("/brands/tenants/:tenantId", function(req, res) {});

    /**
     * WARNING: THIS WILL REMOVE ALL THE COGNITO USER POOLS, IDENTITY POOLS, ROLES, AND POLICIES CREATED BY THIS QUICKSTART.
     * Delete Infrastructure Created by Multi-tenant Identity Reference Architecture
     */
    app.delete("/brands/tenants/:tenantId/location/:locationId", function(req, res) {});
    
    /**
     * Lookup user pool for any user
     */
    app.get("/brands/pool/:id", function(req, res) {});
    
    /**
     * Get user attributes from a tenant
     */
    app.get("/brands/tenant/:tenantId:/user/:userId", function(req, res) {});
    
    /**
     * Get a list of users from a tenant
     */
    app.get("/brands/tenant/:tenantId/users", function(req, res) {});
    
    /**
     * Get list of locations using a tenantId and locationId
     */
    app.get("/brands/tenant/:tenantId/location/:locationId", function(req, res) {});
    
    /**
     * Create a new location
     */
    app.post("/brands/tenant/:tenantId/location", function(req, res) {});
    
    /**
     * Enable a tenant user that is currently disabled 
     */
    app.put("/brands/tenant/:tenantId/user/:userid", function(req, res) {});
    
    /**
     * Disable a tenant user that is currently enabled
     */
    app.put("/brands/tenant/:tenantId/user/:userid", function(req, res) {});

    /**
     * Enable a location user that is currently disabled
     */
    app.put("/brands/tenant/:tenantId/location/:locationId/user/:userid", function(req, res) {});
    
    /**
     * Disable a location user that is currently enabled
     */
    app.put("/brands/tenant/:tenantId/location/:locationId/user/:userid", function(req, res) {});
    
    /**
     * Update a user's attributes
     */
    app.put("/brands/tenant/:tenantId/user/:userid", function(req, res) {});
    
    /**
     * Delete a user tenant
     */
    app.delete("/brands/tenant/:tenantId/user/:userid", function(req, res) {});

    /**
     * Delete a user location
     */
    app.delete("/brands/tenant/:tenantId/location/:locationId/user/:userid", function(req, res) {});
      

};