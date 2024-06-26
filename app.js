const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const joi = require("joi");
const appError = require("./utils/errorHandling/appError");

const app = express();

const campgrounds = require("./routes/campground.js");
const reviews = require("./routes/review.js");

main().catch((err) => console.log("OH NO, MONGODB ERROR!", err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
	console.log("CONNECTED TO MONGODB!");
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(cookieParser("thisisasecret"));

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.use((err, req, res, next) => {
	let status = 500;
	let message = "Something went wrong!";

	if (err instanceof appError) {
		status = err.status;
		message = err.message || "Something went wrong";
	} else if (err.name === "CastError") {
		status = 400;
		message = "Cast Failed";
	}

	res.status(status).render("error", { message, status, stack: err.stack, err });
});

app.listen(3000, () => {
	console.log("SERVING ON PORT 3000");
});
