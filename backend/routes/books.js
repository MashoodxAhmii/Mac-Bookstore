const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");

//add book --admin
router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const { title, author, genre, price, stock, url, description, language } = req.body;
        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            price: req.body.price,
            stock: req.body.stock,
            description: description || "No description provided",
            language: language || "English"
        });
        await book.save();
        res.status(201).json({ message: "Book added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding book" });
    }
});

//update book --admin
router.put("/update-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (!bookid) {
            return res.status(400).json({ message: "bookid header is required" });
        }

        const { title, author, genre, price, stock, url, description, language } = req.body;
        const updatedData = {
            url,
            title,
            author,
            genre,
            price,
            stock,
            description: description || "No description provided",
            language: language || "English"
        };

        const updatedBook = await Book.findByIdAndUpdate(bookid, updatedData, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({
            message: "Book updated successfully",
            book: updatedBook
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating book" });
    }
});

//Delete book --admin
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (!bookid) {
            return res.status(400).json({ message: "bookid header is required" });
        }

        const deletedBook = await Book.findByIdAndDelete(bookid);

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({
            message: "Book deleted successfully",
            book: deletedBook
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting book" });
    }
});

//get all books
router.get("/get-all-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.status(200).json({
            status: "success",
            message: "All books fetched successfully",
            data: books
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting books" });
    }
});

//get book by id
router.get("/get-book-by-id", async (req, res) => {
    try {
        const { bookid } = req.headers;
        const book = await Book.findById(bookid);
        return res.status(200).json({
            status: "success",
            message: "Book fetched successfully",
            data: book
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting book" });
    }
});

module.exports = router;
