import express from "express";
import Datastore from "nedb";

// set up a router
const router = express.Router();

// set up the database
const notesDB = new Datastore({ filename: "./source/data/notes.db", autoload: true });

// all routes in here are starting with /notes - see server.js

// GET ALL notes
router.get("/", (req, res) => {
  notesDB.find({}, (err, data) => {
    res.json(data);
  });
});

// SAVE ALL notes
router.post("/", (req, res) => {
  console.log("POST notes ROUTE REACHED");
  console.log("this is the newly stored data:");

  const data = req.body;
  console.log(data);
  notesDB.remove({}, { multi: true }, (err, numRemoved) => {
    console.log(numRemoved);
  });
  notesDB.insert(data);
  notesDB.find({}, (err, foundData) => {
    res.json(foundData);
  });
});

// damit wir dies im server.js verwenden können:
export default router;
