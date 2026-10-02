const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        }
    },
    { timestamps: true }
)

const Books = mongoose.model("Books", BookSchema);
module.exports = Books;
