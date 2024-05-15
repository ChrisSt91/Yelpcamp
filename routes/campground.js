const express = require("express");
const router = express.Router();
const appError = require("../utils/errorHandling/appError");
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new appError(msg, 400);
	}
	next();
};

router.get(
	"/",
	wrapAsync(async (req, res, next) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds });
	})
);

router.get("/new", (req, res, next) => {
	res.render("campgrounds/new");
});

router.post(
	"/",
	validateCampground,
	wrapAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`campgrounds/${campground._id}`);
	})
);

router.get(
	"/:id",
	wrapAsync(async (req, res, next) => {
		const campground = await Campground.findById(req.params.id).populate("reviews");
		res.render("campgrounds/show", { campground });
	})
);

router.get(
	"/:id/edit",
	wrapAsync(async (req, res, next) => {
		const campground = await Campground.findById(req.params.id);
		res.render("campgrounds/edit", { campground });
	})
);

router.put(
	"/:id",
	validateCampground,
	wrapAsync(async (req, res, next) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(
			id,
			{ ...req.body.campground },
			{ new: true }
		);
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	"/:id",
	wrapAsync(async (req, res, next) => {
		const { id } = req.params;
		const deletedCamp = await Campground.findByIdAndDelete(id);
		res.redirect("/campgrounds");
	})
);

router.all("*", (req, res, next) => {
	next(new appError("Page Not Found", 404));
});

module.exports = router;
