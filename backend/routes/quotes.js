const express = require("express");
const router = express.Router();
const { quotes, getRandomQuote } = require("../data/quotes");

// GET /quotes - return all quotes
router.get("/", (req, res) => {
  res.json({ count: quotes.length, quotes });
});

// GET /quotes/random - return a random quote
router.get("/random", (req, res) => {
  res.json(getRandomQuote());
});

module.exports = router;