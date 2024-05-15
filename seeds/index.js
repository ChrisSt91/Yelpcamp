const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const Review = require("../models/review");
main().catch((err) => console.log("OH NO, MONGODB ERROR!", err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
	console.log("CONNECTED TO MONGODB!");
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Review.deleteMany({});
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const pricing = Math.floor(Math.random() * 20);
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)}, ${sample(places)}`,
			image: `https://loremflickr.com/450/300/camping?random=${i}`,
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			price: pricing,
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
