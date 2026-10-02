const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
// express-mongo-sanitize removed
require('dotenv').config();
require('./conn/conn.js');
const User = require('./routes/user');
const Books = require('./routes/books');
const Favourite = require('./routes/favourite');
const Cart = require('./routes/cart');
const Order = require('./routes/order');

app.use(helmet());
app.use(cors());
app.use(express.json());
// express-mongo-sanitize removed due to incompatibility with express v5 req.query readonly restriction
//routes
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

app.get("/", (req, res) => {
    res.send("Hello from backend side");
});
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server Started Successfully on port ${PORT}`);
});