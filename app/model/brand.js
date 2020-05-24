//Require Mongoose
var mongoose = require('mongoose');

// Define a Schema for our Brand collection
const BrandSchema = new mongoose.Schema({
    name: String,
    slug: { type: String, trim: true },
    logo: String,
    manufacturer: {
        name: String,
        contact: String,
        address: String,
        country: String
    },
    importer: {
        name: String,
        contact: String,
        address: String,
        country: String
    },
    packer:{
        name: String,
        contact: String,
        address: String,
        country: String
    }
}, {
    timestamps: true
});
// Compile model from schema
// When you call mongoose.model() on a schema, Mongoose compiles a model for you.
// The first argument is the singular name of the collection your model is for. 
// ** Mongoose automatically looks for the plural, lower cased version of your model name.
// ** Thus, for the example above, the model Tank is for the tanks collection in the database.
var Brand = mongoose.model('Brand', BrandSchema );
//Ensure mongoose automatically created _id field for the document
Brand._id instanceof mongoose.Types.ObjectId;

//Export function to create "Brand" model class
module.exports = Brand;

