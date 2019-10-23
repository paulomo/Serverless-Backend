"use strict";

// Require AWS, FAUNADB_SECRET, Express
const AWS = require("aws-sdk");
const faunadb = require("faunadb");
const express = require("express");

module.exports = () => {
  const serverless = require("serverless-http");
  const bodyParser = require("body-parser");
  const app = express();

  // AWS Services
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const S3 = new AWS.S3(require("./s3config.js")());

  // FAUNADB_SECRET
  const q = faunadb.query;
  const faunaClient = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET
  });

  app.use(bodyParser.json({ strict: false }));
};
