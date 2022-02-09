//Require Mongoose
var mongoose = require('mongoose');
const uuid = require('node-uuid');
// Define a Schema for our Department collection
const DepartmentSchema = new mongoose.Schema({
    _id: {type: String, default: uuid.v4},
    name: { type: String, required: true },
    slug: { type: String, trim: true }
}, {
    timestamps: true
});
// Compile model from schema
// When you call mongoose.model() on a schema, Mongoose compiles a model for you.
// The first argument is the singular name of the collection your model is for. 
// ** Mongoose automatically looks for the plural, lower cased version of your model name.
// ** Thus, for the example above, the model Tank is for the tanks collection in the database.
var Department = mongoose.model('Department', DepartmentSchema);

//Export function to create "Department" model class
module.exports = Department;