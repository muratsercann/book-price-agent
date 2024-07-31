const express = require("express");
const kitapyurdu = require("./services/kitapyurdu");
const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Server is running :)" });
});

router.get("/kitapyurdu", async (req, res) => {
  const { query, sortOption } = req.query || {};
  res.status(200).json(await kitapyurdu.search(query, sortOption));
});

router.get("/trendyol", async (req, res) => {
  res.status(200).json({ message: "Welcome !" });
});

router.get("/hepsiburada", async (req, res) => {
  res.status(200).json({ message: "Welcome !" });
});

router.get("/amazon", async (req, res) => {
  res.status(200).json({ message: "Welcome !" });
});

router.get("/dr", async (req, res) => {
  res.status(200).json({ message: "Welcome !" });
});

module.exports = router;
