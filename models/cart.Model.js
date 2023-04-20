const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

    image: String,
    title: String,
    price: Number,
    qty: Number,
    user_id: String,


})


const cartItem = mongoose.model("cartBewakuf", cartSchema);

module.exports = { cartItem };