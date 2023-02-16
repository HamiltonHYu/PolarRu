const express = require("express");
const path = require("path");
const { pollController } = require("../controllers");

const router = express.Router();

router.get("/list/:id", pollController.getPolls, (req, res) => {
  res.status(200).json([...res.locals.polls]);
});

router.post("/", pollController.createPoll, (req, res) => {
  res.status(200).json(res.locals);
});

router.get("/:id", pollController.getPoll, (req, res) => {
  res.status(200).json(res.locals.poll);
});

module.exports = router;
