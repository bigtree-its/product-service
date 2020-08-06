//Require Mongoose
var mongoose = require('mongoose');
//Mongoose Paginate V2
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Define a Schema for our BasketItem collection
const BasketItemSchema = new mongoose.Schema({
    productId: String, // BasketItem identifier
    name: String, // BasketItem name
    price: { type: Number },
    qty: Number,
    subTotal: Number,
    picture: String,
    brand: String
}, {
    timestamps: true
});

BasketItemSchema.plugin(aggregatePaginate);

// Compile model from schema
// When you call mongoose.model() on a schema, Mongoose compiles a model for you.
// The first argument is the singular name of the collection your model is for. 
// ** Mongoose automatically looks for the plural, lower cased version of your model name.
// ** Thus, for the example above, the model Tank is for the tanks collection in the database.
var BasketItem = mongoose.model('BasketItem', BasketItemSchema);
//Ensure mongoose automatically created _id field for the document
BasketItem._id instanceof mongoose.Types.ObjectId;

//Export function to create "BasketItem" model class
module.exports = BasketItem;