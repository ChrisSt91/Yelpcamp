const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
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

module.exports = mongoose.model("Campground", CampGroundSchema);
