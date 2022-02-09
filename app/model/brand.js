//Require Mongoose
var mongoose = require('mongoose');
var { Address } = require('./common')
const uuid = require('node-uuid');
// Define a Schema for our Brand collection
const BrandSchema = new mongoose.Schema({
    // _id: { type: UUID, default: uuidv4 },
    _id: {type: String, default: uuid.v4},
    name: String,
    slug: { type: String, trim: true },
    logo: String,
    manufacturer: Address,
    exporter: Address,
    importer: Address
}, {
    timestamps: true
});

var Brand = mongoose.model('Brand', BrandSchema);


//Export function to create "Brand" model class
module.exports = Brand;