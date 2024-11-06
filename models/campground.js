const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
	{
		title: { type: String, required: [true, "A campground must have a name"] },
		images: [{ url: String, filename: String }],
		geometry: {
			type: {
				type: String,
				enum: ["Point"],
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
		price: { type: Number, required: true, min: 0 },
		description: { type: String, required: true },
		location: { type: String, required: true },
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: "Review",
			},
		],
	},
	opts
);

CampgroundSchema.path("images")
	.schema.virtual("thumbnail")
	.get(function () {
		return this.url.replace("/upload/", "/upload/w_200/");
	});

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
	return `
		<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
		<p>${this.description.substring(0, 20)}...</p>`;
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
