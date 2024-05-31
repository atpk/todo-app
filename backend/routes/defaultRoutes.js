const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Node Server" });
});

router.get("/healthcheck", async (req, res) => {
  res.status(200).json({ message: "Server is up and running" });
});

module.exports = router;
