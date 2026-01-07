const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, () => {
	// Keep the server start log short and useful.
	console.log(`Quote service listening on http://localhost:${port}`);
});
