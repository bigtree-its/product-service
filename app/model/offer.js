//Require Mongoose
var mongoose = require('mongoose');
//Mongoose Paginate V2
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Define a Schema for our product collection
const OfferSchema = new mongoose.Schema({
    name: String, // offer name
    code: String, // offer name
    description: String,
    discountAmount: { type: Number },
    discountPercentage: { type: Number },
    from: Date,
    expiry: Date
}, {
    timestamps: true
});

OfferSchema.plugin(aggregatePaginate);

// Compile model from schema
// When you call mongoose.model() on a schema, Mongoose compiles a model for you.
// The first argument is the singular name of the collection your model is for. 
// ** Mongoose automatically looks for the plural, lower cased version of your model name.
// ** Thus, for the example above, the model Tank is for the tanks collection in the database.
var Product = mongoose.model('Product', OfferSchema);
//Ensure mongoose automatically created _id field for the document
Product._id instanceof mongoose.Types.ObjectId;

//Export function to create "Product" model class
module.exports = Product;