const mongoose = require('mongoose')

const productsSchema = mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number
})

module.exports = mongoose.model("products", productsSchema);