const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: String,
    email: String,
    password: String,
    phone: { type: String, required: true },


})


const userModel = mongoose.model("user", userSchema);

module.exports = { userModel };