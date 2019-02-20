const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // name:  String, // this is the basic way to specify field
    name: {type: String, required: true }, // this is the more detailed version
    price: { type: Number, required: true }
});



module.exports = mongoose.model('Product', productSchema);
