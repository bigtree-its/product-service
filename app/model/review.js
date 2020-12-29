//Require Mongoose
var mongoose = require('mongoose');
// Define a Schema for our Review collection
const ReviewSchema = new mongoose.Schema({
    date: Date,
    userEmail: String,
    userName: String,
    title: String,
    stars: Number,
    content: String,
    product: {
        type: mongoose.Schema.Types.ObjectId,
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
Review._id instanceof mongoose.Types.ObjectId;

//Export function to create "Review" model class
module.exports = Review;