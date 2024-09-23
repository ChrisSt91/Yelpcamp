const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router.get(
	"/",
	wrapAsync(async (req, res, next) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds });
	})
);

router.get(
	"/new",
	isLoggedIn,
	wrapAsync(async (req, res, next) => {
		res.render("campgrounds/new");
	})
);

router.post(
	"/",
	validateCampground,
	isLoggedIn,
	wrapAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground);
		campground.author = req.user._id;
		await campground.save();
		req.flash("success", "Successfully made a new campground!");
		res.redirect(`campgrounds/${campground._id}`);
	})
);

router.get(
	"/:id",
	wrapAsync(async (req, res, next) => {
		const campground = await Campground.findById(req.params.id)
			.populate("reviews")
			.populate("author");
		if (!campground) {
			req.flash("error", "Campground not found");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/show", { campground });
	})
);

router.get(
	"/:id/edit",
	isLoggedIn,
	isAuthor,
	wrapAsync(async (req, res, next) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		if (!campground) {
			req.flash("error", "Campground not found");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/edit", { campground });
	})
);

router.put(
	"/:id",
	validateCampground,
	isLoggedIn,
	isAuthor,
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
	isLoggedIn,
	isAuthor,
	wrapAsync(async (req, res, next) => {
		const { id } = req.params;
		const deletedCamp = await Campground.findByIdAndDelete(id);
		req.flash("success", "Successfully deleted a  campground!");
		res.redirect("/campgrounds");
	})
);

module.exports = router;
