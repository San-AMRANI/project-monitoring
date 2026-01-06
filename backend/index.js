const express = require("express");
const cors = require("cors");
const quotesRouter = require("./routes/quotes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

app.use("/quotes", quotesRouter);

app.listen(port, () => {
	// Keep the server start log short and useful.
	console.log(`Quote service listening on http://localhost:${port}`);
});
