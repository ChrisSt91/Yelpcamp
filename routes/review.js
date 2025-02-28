const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { campgroundSchema, reviewSchema } = require("../schemas");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");
const Review = require("../models/review");
const Campground = require("../models/campground");
const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviews.createReview));

router.put("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviews.updateReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;
