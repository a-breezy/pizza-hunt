const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./routes"));

// tells mongoose which db to connect to
// if MONGODB_URI (like on heroku)use that, otehrwise use local server
mongoose.connect(
	process.env.MONGODB_URI || "mongodb://localhost:27017/pizza-hunt",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

// use this to log mongo queries being executed
mongoose.set("debug", true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
