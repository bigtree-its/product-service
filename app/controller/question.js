
// Require Question Model
const Question = require('../model/question');

// Require Underscore JS ( Visit: http://underscorejs.org/#)
const _ = require('underscore');

// Require Mongoose
var mongoose = require('mongoose');

// Require Validation Utils
const { validationResult, errorFormatter } = require('./validation');

// Create and Save a new Question
exports.create = (req, res) => {
    
    console.log("Creating new Question " + JSON.stringify(req.body));
    
    // Validate Request
    const errors = validationResult(req).formatWith(errorFormatter);
    
    if (!errors.isEmpty()) {
        var err = _.uniq(errors.array());
        console.log('Cannot create question: ' + err);
        return res.json({ errors: err });
    }
    checkDuplicateAndPersist(req, res);
};

function checkDuplicateAndPersist(req, res) {
    
    console.log(`Checking if a question already exist for product ${req.body.product}`);
    
    Question.exists({ question: req.body.question, product: req.body.product }, function(err, result) {
        if (err) {
            return res.status(500).send({ message: `Error while finding Question for product:${req.body.product}` });
        } else if (result) {
            console.log(`Question already exist for Product:${req.body.product}`);
            res.status(400).send({ message: `You have already posted this question for this product` });
        } else {
            persist(req, res);
        }
    });
}

// Retrieve and return all Questions from the database.
exports.findAll = (req, res, next) => {
    
    var query = Question.find();
    
    if (req.query.product) {
        query.where("product").equals(req.query.product);
    }
    
    if (req.query.userName) {
        query.where("userName").equals(req.query.userName);
    }
    
    Question.find(query).sort({ date: -1 }).then(result => {
        if (result) {
            console.log(`Returning ${result.length} questions.`);
            res.send(result);
        } else {
            console.log("Returning no Questions");
            res.send({});
        }
    }).catch(err => { res.status(500).send({ message: err.message }) });
};

// Find a single Question with a ID
exports.findOne = (req, res) => {
    
    Question.findById(req.params.id)
        .then(Question => {
            if (!Question) {
                return res.status(404).send({ message: `Question not found with id ${req.params.id}` });
            }
            res.send(Question);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Question not found with id ${req.params.id}` });
            }
            return res.status(500).send({ message: `Error while retrieving Question with id ${req.params.id}` });
        });
};

// Update a Question identified by the BrandId in the request
exports.update = (req, res) => {
    
    console.log("Updating Question " + JSON.stringify(req.body));
    
    // Validate Request
    if (!req.body) {
        return res.status(400).send({ message: "Question body can not be empty" });
    }

    // Find Question and update it with the request body
    Question.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .then(Question => {
            if (!Question) {
                return res.status(404).send({ message: `Question not found with id ${req.params.id}` });
            }
            res.send(Question);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Question not found with id ${req.params.id}` });
            }
            return res.status(500).send({ message: `Error updating Question with id ${req.params.id}` });
        });
};

// Delete a Question with the specified BrandId in the request
exports.delete = (req, res) => {
    Question.findByIdAndRemove(req.params.id)
        .then(Question => {
            if (!Question) {
                return res.status(404).send({ message: `Question not found with id ${req.params.id}` });
            }
            res.send({ message: "Question deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({ message: `Question not found with id ${req.params.id}` });
            }
            return res.status(500).send({
                message: `Could not delete Question with id ${req.params.id}`
            });
        });
};

exports.deleteAll = (req, res) => {
    
    Question.remove().then(result => {
        res.send({ message: "Deleted all questions" });
    }).catch(err => {
        return res.status(500).send({
            message: `Could not delete all Questions. ${err.message}`
        });
    });
}

/**
 * Persists new Question Model 
 * 
 * @param {Request} req The HTTP Request 
 * @param {*Response} res The HTTP Response
 */
function persist(req, res) {
    
    console.log(`Attempting to persist Question ` + JSON.stringify(req.body));
    
    const Question = buildQuestion(req);
    
    // Save Question in the database
    Question.save()
        .then(data => {
            console.log(`Persisted Question: ${data._id}`);
            res.status(201).send(data);
        }).catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while creating the Question." });
        });
}

/**
 * Builds Question from incoming Request.
 
 * @returns Question Model
 * @param {*} req 
 */
function buildQuestion(req) {
    return new Question(buildQuestionJson(req));
}

/**
 * Builds Question JSON incoming Request.
 * 
 * @returns {String} Question JSON
 * @param {Request} req 
 */
function buildQuestionJson(req) {
    var data = _.pick(req.body, 'question', 'answer', 'date', 'userName', 'product',)
    if (!data.date) {
        data.date = new Date();
    }
    
    if (!data.userName) {
        data.userName = 'Anonymous';
    }

    return data;
}