const mongoose = require('mongoose');
const Listing = require('../models/listings');
const dataToAdd = require('./data.js'); 
const data = require('./data.js');

// Connect to MongoDB
main()
  .then(() => {
    console.log('Connected to MongoDB');
    return intiFunction();
  })
  .then(() => {
    console.log('Data added successfully');
    mongoose.connection.close(); // Close connection after the operation
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// Using Model.create() so setters and defaults are applied
const intiFunction = async () => {
  try {
    await Listing.deleteMany({}); // Clear existing listings
    console.log('Existing listings cleared.');
    dataToAdd.data.forEach(listing => {
      listing.owner="685bb0817a967b8a636d1f30"; // Set the owner for each listing
    });
    // Use Listing.create() instead of insertMany()
    await Listing.create(dataToAdd.data);
  } catch (error) {
    console.error('Error adding new listing:', error);
  }
};