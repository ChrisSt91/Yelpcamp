if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const joi = require("joi");
const appError = require("./utils/errorHandling/appError");
const session = require("express-session");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const User = require("./models/user");

const campgroundRoutes = require("./routes/campground.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

main().catch((err) => console.log("OH NO, MONGODB ERROR!", err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
	console.log("CONNECTED TO MONGODB!");
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser("thisisasecret"));
app.use(
	mongoSanitize({
		replaceWith: "_",
	})
);

const sessionConfig = {
	secret: "thisshouldbeabettersecret",
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.danger = req.flash("danger");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
	res.render("campgrounds/home");
});

app.use("*", (req, res, next) => {
	next(new appError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
	let status = 500;
	let message = "Something went wrong!";

	if (err.name === "CastError") {
		status = 400;
		message = "Cast Failed";
	} else if (err) {
		status = err.status || 500;
		message = err.message || "Something went wrong";
	}
	res.status(status).render("error", { message, status, stack: err.stack, err });
});

app.listen(3000, () => {
	console.log("SERVING ON PORT 3000");
});
