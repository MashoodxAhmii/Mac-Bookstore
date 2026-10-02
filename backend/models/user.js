const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	address: { type: String, required: true },
	role: { type: String, default: "user", enum: ["user", "admin"] },
	favourite: {
		type: [mongoose.Types.ObjectId],
		ref: "Books",
	},
	orders: {
		type: [mongoose.Types.ObjectId],
		ref: "Orders",
	},
	avatar: {
		type: String,
		default: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
	},
	cart: {
		type: [mongoose.Types.ObjectId],
		ref: "Books"
	}
});

module.exports = mongoose.model("User", userSchema);
