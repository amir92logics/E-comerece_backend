const mongoose = require("mongoose");

   const users = mongoose.Schema({
    email: String,
    password: String
   });
module.exports = mongoose.model("users", users);