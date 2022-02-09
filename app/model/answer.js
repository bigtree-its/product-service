//Require Mongoose
var mongoose = require('mongoose');
const uuid = require('node-uuid');
// Define a Schema for our Answer collection
const AnswerSchema = new mongoose.Schema({
    _id: {type: String, default: uuid.v4},
    answer: String,
    question: {
        type: mongoose.Schema.Types.String,
        ref: 'Question'
    },
    userEmail: String,
    userName: String,
    date: Date,
}, {
    timestamps: true
});
// Compile model from schema
// When you call mongoose.model() on a schema, Mongoose compiles a model for you.
// The first argument is the singular name of the collection your model is for. 
// ** Mongoose automatically looks for the plural, lower cased version of your model name.
// ** Thus, for the example above, the model Tank is for the tanks collection in the database.
var Answer = mongoose.model('Answer', AnswerSchema);

//Export function to create "Answer" model class
module.exports = Answer;