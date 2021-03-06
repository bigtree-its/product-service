//Require Mongoose
var mongoose = require('mongoose');
const uuid = require('node-uuid');
// Define a Schema for our Review collection
const ReviewSchema = new mongoose.Schema({
    headline: String,
    content: String,
    rating: Number,
    date: Date,
    userEmail: String,
    userName: String,
    product: {
        type: mongoose.Schema.Types.String,
        ref: 'Product'
    }
}, {
    timestamps: true
});
// Compile model from schema
// When you call mongoose.model() on a schema, Mongoose compiles a model for you.
// The first argument is the singular name of the collection your model is for. 
// ** Mongoose automatically looks for the plural, lower cased version of your model name.
// ** Thus, for the example above, the model Tank is for the tanks collection in the database.
var Review = mongoose.model('Review', ReviewSchema);
//Ensure mongoose automatically created _id field for the document

//Export function to create "Review" model class
module.exports = Review;