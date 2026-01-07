const express = require("express");
const cors = require("cors");
const quotesRouter = require("./routes/quotes");

const app = express();

app.use(cors());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/quotes", quotesRouter);

module.exports = app;
