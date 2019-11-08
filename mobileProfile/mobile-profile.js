const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

// Configure Logging
const winston = require("winston");

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ strict: false }));

const USER_PROFILE_TABLE = process.env.USER_PROFILE_TABLE;

/**
 * API HEALTH
 */
app.get("/mobile-profiles/health", async function(request, response) {
  request.status(200).send({ service: "userBrand Manager", isAlive: true });
});

/**
 * READ ONE
 */
app.get("/mobile-profiles/:id", async function(request, response) {
  winston.debug("Fetching user profile: " + request);
  // init params structure with request params

});

/**
 * READ ALL
 */
app.get("/mobile-profiles", async function(request, response) {
});

/**
 * UPDATE
 */
app.put("/mobile-profiles/:id", async function(request, response) {
  winston.debug("Updating user profile: " + request);
});

/**
 * DELETE
 */
app.delete("/mobile-profiles/:id", async function(request, response) {
  winston.debug("Deleting user profile: " + request);
  // init parameter structure
});

/**
 * Converting the app to serverless
 */
module.exports.handler = serverless(app);
