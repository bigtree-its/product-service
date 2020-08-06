//Require Mongoose
var mongoose = require('mongoose');
//Mongoose Paginate V2
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Define a Schema for our Basket collection
const BasketSchema = new mongoose.Schema({
    clientIp: String,
    email: String,
    reference: String,
    subTotal: { type: Number },
    delivery: Number,
    discountAmount: Number,
    discountPercentage: Number,
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BasketItem'
    }],
    total: { type: Number },
}, {
    timestamps: true
});

BasketSchema.plugin(aggregatePaginate);

// Compile model from schema
// When you call mongoose.model() on a schema, Mongoose compiles a model for you.
// The first argument is the singular name of the collection your model is for. 
// ** Mongoose automatically looks for the plural, lower cased version of your model name.
// ** Thus, for the example above, the model Tank is for the tanks collection in the database.
var Basket = mongoose.model('Basket', BasketSchema);
//Ensure mongoose automatically created _id field for the document
Basket._id instanceof mongoose.Types.ObjectId;

//Export function to create "Basket" model class
module.exports = Basket;