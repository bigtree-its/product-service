//Require Mongoose
var mongoose = require('mongoose');
const uuid = require('node-uuid');
//Mongoose Paginate V2
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { Attribute } = require('./common');
const { NameValue } = require('./common');

// Define a Schema for our product collection
const ProductSchema = new mongoose.Schema({
    _id: {type: String, default: uuid.v4},
    name: String, // product name
    pin: String, // Product Identification Number
    sku: String, // Stock Keeping Unit
    barcode: String,
    description: [String],
    tags: [String],
    categories: [{
        type: mongoose.Schema.Types.String,
        ref: 'Category'
    }],
    price: { type: Number },// Product's original price. Enter a lower value into SalePrice.
    salePrice: { type: Number }, //To show a reduced price
    costPrice: { type: Number },
    margin: Number, // 30%
    profit: Number, // Profit
    tax: Number, // Sale Tax on particular products
    discount: Number, // Discount in percentage
    availability: { type: String, enum: ['Available', 'Out of Stock'] },
    stock: Number,
    size: String,
    weight: String,
    colors: [String],
    expiry: Date,
    availableDate: Date,
    orderedDate: Date,
    slug: { type: String, trim: true },
    department: {
        type: mongoose.Schema.Types.String,
        ref: 'Department'
    },
    brand: {
        type: mongoose.Schema.Types.String,
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
    nutritionalInformation: [NameValue],
    qa: [NameValue],
    shipping: {
        shipper: String,
        instructions: [String]
    },
    storage: [String],
    status: { type: String, enum: ['Active', 'Draft', 'Discontinued'] },
    deliveryOptions: { type: String, enum: ['Home Delivery', 'Collection Only'] },
    kids: Boolean,
    fragile: Boolean,
    edible: Boolean,
    adultsOnly: Boolean,
    featured: Boolean
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

//Export function to create "Product" model class
module.exports = Product;