const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { campgroundSchema, reviewSchema } = require("../schemas");
const { isLoggedIn, validateReview } = require("../middleware");
//Models
const Review = require("../models/review");
const Campground = require("../models/campground");

router.post(
	"/",
	isLoggedIn,
	validateReview,
	wrapAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		review.author = req.user._id;
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		req.flash("success", "Created new review");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	"/:reviewId",
	wrapAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash("success", "Review deleted");
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
