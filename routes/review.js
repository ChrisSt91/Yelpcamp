const express = require("express");
const router = express.Router({ mergeParams: true });
const appError = require("../utils/errorHandling/appError");
const wrapAsync = require("../utils/wrapAsync");
const { campgroundSchema, reviewSchema } = require("../schemas");

//Models
const Review = require("../models/review");
const Campground = require("../models/campground");

//Middleware
const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new appError(msg, 400);
	}
	next();
};

router.post(
	"/",
	validateReview,
	wrapAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	"/:reviewId",
	wrapAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		res.redirect(`/campgrounds/${id}`);
	})
);

router.all("*", (req, res, next) => {
	next(new appError("Page Not Found", 404));
});

module.exports = router;
