const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");



//add to favourite
router.put("/add-to-favourite", authenticateToken, async (req, res) => {
    try {
        const { id } = req.user;
        const { bookId } = req.body;
        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        const isBookFavourite = userData.favourite ? userData.favourite.some(fav => fav.toString() === bookId) : false;
        if (isBookFavourite) {
            return res.status(200).json({ message: "Book is already in favourite" });
        }
        await User.findByIdAndUpdate(id, { $push: { favourite: bookId } });
        return res.status(200).json({ message: "Book added to favourite" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//remove from favourite
router.put("/remove-from-favourite", authenticateToken, async (req, res) => {
    try {
        const { id } = req.user;
        const { bookId } = req.body;
        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        const isBookFavourite = userData.favourite ? userData.favourite.some(fav => fav.toString() === bookId) : false;
        if (isBookFavourite) {
            await User.findByIdAndUpdate(id, { $pull: { favourite: bookId } });
        }
        return res.status(200).json({ message: "Book removed from favourite" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//get all the favourite books
router.get("/get-all-favourite", authenticateToken, async (req, res) => {
    try {
        const { id } = req.user;
        const userData = await User.findById(id).populate("favourite");
        const favouriteBooks = userData.favourite || [];
        return res.status(200).json({
            status: "Success",
            data: favouriteBooks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});

module.exports = router;