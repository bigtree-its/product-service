//Require Mongoose
var mongoose = require('mongoose');

// Define a Schema for our Department collection
const DepartmentSchema = new mongoose.Schema({
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
//Ensure mongoose automatically created _id field for the document
Department._id instanceof mongoose.Types.ObjectId;
Department.parent instanceof mongoose.Types.ObjectId;

//Export function to create "Department" model class
module.exports = Department;