const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
	title: { type: String, required: [true, "A campground must have a name"] },
	image: { type: String, required: true },
	price: { type: Number, required: true, min: 0 },
	description: { type: String, required: true },
	location: { type: String, required: true },
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
	],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews,
			},
		});
	}
});

module.exports = mongoose.model("Campground", CampgroundSchema);
