const mongoose = require('mongoose');

const conn = async () => {
    try {
        await mongoose.connect(process.env.URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB");
        console.log(error);
    }
}

module.exports = conn;
conn();