import express from "express";
import Datastore from "nedb";

// set up a router
const router = express.Router();

// set up the database
const settingsDB = new Datastore({ filename: "./source/data/settings.db", autoload: true });

// all routes in here are starting with /notes - see server.js

// GET ALL settings
router.get("/", (req, res) => {
  settingsDB.find({}, (err, data) => {
    res.json(data);
  });
});

// SAVE ALL settings
router.post("/", (req, res) => {
  console.log("POST notes ROUTE REACHED");
  console.log("this is the newly stored data:");

  const data = req.body;
  console.log(data);
  settingsDB.remove({}, { multi: true }, (err, numRemoved) => {
    console.log(numRemoved);
  });
  settingsDB.insert(data);
  settingsDB.find({}, (err, foundData) => {
    res.json(foundData);
  });
});

// damit wir dies im server.js verwenden können:
export default router;
