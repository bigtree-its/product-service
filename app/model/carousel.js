//Require Mongoose
var mongoose = require('mongoose');
const uuid = require('node-uuid');
// Define a Schema for our Carousel collection
const CarouselSchema = new mongoose.Schema({
    _id: {type: String, default: uuid.v4},
    product: String,
    image: String,
    title: String,
    description: String,
    active: Boolean,
    coming: Boolean,
}, {
    timestamps: true
});
// Compile model from schema
// When you call mongoose.model() on a schema, Mongoose compiles a model for you.
// The first argument is the singular name of the collection your model is for. 
// ** Mongoose automatically looks for the plural, lower cased version of your model name.
// ** Thus, for the example above, the model Tank is for the tanks collection in the database.
var Carousel = mongoose.model('Carousel', CarouselSchema);

//Export function to create "Carousel" model class
module.exports = Carousel;