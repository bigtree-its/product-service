//Require Mongoose
var mongoose = require('mongoose');

// Define a Schema for our Product Questions collection
const QuestionSchema = new mongoose.Schema({
    question: String,
    answer: String,
    date: Date,
    userName: String,
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
// ** Thus, for the example above, the model Question is for the questions collection in the database.
var Question = mongoose.model('Question', QuestionSchema);

//Ensure mongoose automatically created _id field for the document
Question._id instanceof mongoose.Types.ObjectId;

//Export function to create "Question" model class
module.exports = Question;