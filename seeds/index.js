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
			author: "66ede89a8297ff29de5415f8",
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)}, ${sample(places)}`,
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			price: pricing,
			images: [
				{
					url: "https://res.cloudinary.com/dakwwvfiu/image/upload/v1728856546/YelpCamp/ghmxlmxpwsxswjn7efdb.jpg",
					filename: "YelpCamp/ghmxlmxpwsxswjn7efdb",
				},
				{
					url: "https://res.cloudinary.com/dakwwvfiu/image/upload/v1728856547/YelpCamp/gvlx9nho1tpv1fwbmtju.jpg",
					filename: "YelpCamp/gvlx9nho1tpv1fwbmtju",
				},
			],
		});
		await camp.save();
	}
};

seedDB().then(() => {
	console.log("CLOSING MONGO CONNECTION");
	mongoose.connection.close();
});
