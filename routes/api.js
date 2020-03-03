/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const mongo = require('mongodb');
const MONGO_URI = process.env.DB;
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

module.exports = async function(app) {  
    
    app.route("/api/books")
      .get(async (req, res) => {
        try {
          const client = await MongoClient.connect(process.env.DB, { useUnifiedTopology: true }); 
          const col = await client.db("test").collection("library");
          let result = await col.find().toArray();
          for (let i = 0; i < result.length; i++) {
            result[i].commentcount = result[i].comments.length;
            delete result[i].comments;
          }
          res.json(result);
        } catch {
          //res.sendStatus(400);
          return new Error("Error sending books array.");
        }
      })

      .post(async (req, res) => {
        try {
          const client = await MongoClient.connect(process.env.DB, { useUnifiedTopology: true }); 
          const col = await client.db("test").collection("library");
          console.log("Successfully connected to database.");
          let title = req.body.title;
          if (!title) {
            res.status(400).send("Missing title.");
          } else {
            let doc = {'title': title, 'comments': [] };
            let result = await col.insertOne(doc);
            res.json(await col.findOne(ObjectId(result.insertedId)));
          }
        } catch {
          return res.status(400).send("Error adding new book.");
        }
      })

      .delete(async (req, res) => {
        try {
          const client = await MongoClient.connect(process.env.DB, { useUnifiedTopology: true }); 
          const col = await client.db("test").collection("library");
          let result = await col.deleteMany({});
          //console.log(result);
          res.send("Complete delete successful.");
        } catch {
          return res.status(400).send("Error deleting books.");
        }
      });

    app.route("/api/books/:id")
      .get(async (req, res) => {  
        try {
          let bookid = req.params.id;
          const client = await MongoClient.connect(process.env.DB, { useUnifiedTopology: true }); 
          const col = await client.db("test").collection("library");
          let result = await col.findOne({ _id: ObjectId(bookid) });
            res.json(result);
        } catch {
          return res.status(400).send("No book exists.");
        }
      })

      // Add comments to book
      .post(async (req, res) => {
        try {
          let bookid = await req.params.id;
          let comment = await req.body.comment;
          const client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true }); 
          const col = await client.db("test").collection("library");
          let result = await col.findOneAndUpdate({'_id': ObjectId(bookid)}, {'$push': {'comments': comment}}, {returnOriginal: false, upsert: true});
          //let update = await col.updateOne({'_id': ObjectId(bookid)}, {'$push': {'comments': comment}});
          //let result = await col.findOne({'_id': ObjectId(bookid)});
          //console.log(result.value);
          res.json(result.value);
        } catch {
          return res.status(400).send("Error adding comment.");
        }
      })

      .delete(async (req, res) => {
        try {
          let bookid = req.params.id;
          const client = await MongoClient.connect(process.env.DB, { useUnifiedTopology: true }); 
          const col = await client.db("test").collection("library");
          //console.log("Successfully connected to database.");
          let result = await col.deleteOne({ _id: ObjectId(bookid) });
          res.send("Delete successful.");
        } catch {
          return res.status(400).send("Error deleting specific book.");
        }
      });

}; // export app
