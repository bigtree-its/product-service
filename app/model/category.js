//Require Mongoose
var mongoose = require('mongoose');
var materializedPlugin = require('mongoose-mpath');
const uuid = require('node-uuid');
// Define a Schema for our category collection
const CategorySchema = new mongoose.Schema({
    // _id: {type: String, default: uuid.v4},
    name: { type: String, required: true },
    image: String,
    slug: String,
    parent: mongoose.Schema.Types.String,
    department: {
        type: mongoose.Schema.Types.String,
        ref: 'Department'
    }
}, {
    timestamps: true
});
CategorySchema.plugin(materializedPlugin);
// Compile model from schema
// When you call mongoose.model() on a schema, Mongoose compiles a model for you.
// The first argument is the singular name of the collection your model is for. 
// ** Mongoose automatically looks for the plural, lower cased version of your model name.
// ** Thus, for the example above, the model Tank is for the tanks collection in the database.
var Category = mongoose.model('Category', CategorySchema);
Category._id instanceof mongoose.Types.ObjectId;
//Export function to create "Category" model class
module.exports = Category;