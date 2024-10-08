const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
	.route("/")
	.get(wrapAsync(campgrounds.index))
	// .post(validateCampground, isLoggedIn, wrapAsync(campgrounds.createCampground));
	.post(upload.array("image"), (req, res) => {
		console.log(req.body, req.files);
		res.send("it worked");
	});

router.get("/new", isLoggedIn, wrapAsync(campgrounds.renderNewForm));

router
	.route("/:id")
	.get(wrapAsync(campgrounds.showCampground))
	.put(validateCampground, isLoggedIn, isAuthor, wrapAsync(campgrounds.updateCampground))
	.delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));

module.exports = router;
