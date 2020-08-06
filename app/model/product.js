//Require Mongoose
var mongoose = require('mongoose');
//Mongoose Paginate V2
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { Attribute } = require('./common');

// Define a Schema for our product collection
const ProductSchema = new mongoose.Schema({
    name: String, // product name
    pin: String, // Product Identification Number
    sku: String, // Stock Keeping Unit
    description: [String],
    tags: [String],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    salePrice: { type: Number },
    listPrice: { type: Number },
    discount: Number, // Discount in percentage
    availability: { type: String, enum: ['Available', 'Out of Stock'] },
    stock: Number,
    expiry: Date,
    slug: { type: String, trim: true },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    picture: {
        thumbnail: String,
        large: String,
        additional: [String]
    },
    summary: String,
    type: String,
    attributes: [Attribute],
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
var Product = mongoose.model('Product', ProductSchema);
//Ensure mongoose automatically created _id field for the document
Product._id instanceof mongoose.Types.ObjectId;

//Export function to create "Product" model class
module.exports = Product;