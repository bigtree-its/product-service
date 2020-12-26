//Require Mongoose
var mongoose = require('mongoose');
var materializedPlugin = require('mongoose-mpath');

// Define a Schema for our category collection
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: {
        type: mongoose.Schema.Types.ObjectId,
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
//Ensure mongoose automatically created _id field for the document
Category._id instanceof mongoose.Types.ObjectId;

//Export function to create "Category" model class
module.exports = Category;