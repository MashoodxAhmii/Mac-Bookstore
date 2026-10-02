const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "Books",
    },
    status: {
        type: String,
        default: "Order Placed",
        enum: ["Order Placed", "Out for delivery", "Delivered", "Canceled"],
    },

}, { timestamps: true });

module.exports = mongoose.model("Orders", OrderSchema);
