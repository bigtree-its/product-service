//Require Mongoose
var mongoose = require('mongoose');
//Mongoose Paginate V2
const mongoosePaginate = require('mongoose-paginate-v2');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Define a Schema for our product collection
const ProductSchema = new mongoose.Schema({
    pin: String, // Product Identification Number
    sku: String, // Stock Keeping Unit
    description: [String],
    categories: [mongoose.Schema.Types.ObjectId],
    salePrice: Number,
    listPrice: Number,
    discount: Number,
    availability: {type: String, enum:['Available', 'Out of Stock']},
    stock: Number,
    expiry: Date,
    slug: { type: String, trim: true },
    brand: mongoose.Schema.Types.ObjectId,
    image: {
        thumbnail: String,
        urls: [String]
    },
    shipping: {
        shipper: String,
        instructions: [String]
    },
    storage: [String],
    kids: Boolean,
    edible: Boolean,
    adultsOnly: Boolean
}, {
    timestamps: true
});

ProductSchema.plugin(aggregatePaginate);

// Compile model from schema
// When you call mongoose.model() on a schema, Mongoose compiles a model for you.
// The first argument is the singular name of the collection your model is for. 
// ** Mongoose automatically looks for the plural, lower cased version of your model name.
// ** Thus, for the example above, the model Tank is for the tanks collection in the database.
var Product = mongoose.model('Product', ProductSchema );
//Ensure mongoose automatically created _id field for the document
Product._id instanceof mongoose.Types.ObjectId;

//Export function to create "Product" model class
module.exports = Product;