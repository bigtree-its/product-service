//Require Review Model
const Review = require('../model/review');
//Require Underscore JS ( Visit: http://underscorejs.org/#)
const _ = require('underscore');
//Require Mongoose
var mongoose = require('mongoose');
// Require Validation Utils
const { validationResult, errorFormatter } = require('./validation');

// Create and Save a new Review
exports.create = (req, res) => {
    console.log("Creating new Review " + JSON.stringify(req.body));
    // Validate Request
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        var err = _.uniq(errors.array());
        console.log('Cannot create review: ' + err);
        return res.json({ errors: err });
    }
    checkDuplicateAndPersist(req, res);
};

function checkDuplicateAndPersist(req, res) {
    console.log(`Checking if a Review already exist for product ${req.body.product} from user ${req.body.userEmail}`);
    Review.exists({ userEmail: req.body.userEmail, product: req.body.product }, function(err, result) {
        if (err) {
            return res.status(500).send({ message: `Error while finding Review for product:${req.body.product} from user: ${req.body.userEmail}` });
        } else if (result) {
            console.log(`Review already exist for Product:${req.body.product} from user: ${req.body.userEmail}`);
            res.status(400).send({ message: `You have already reviewed this product` });
        } else {
            persist(req, res);
        }
    });
}

// Retrieve and return all reviews from the database.
exports.findAll = (req, res, next) => {
    var query = Review.find();
    if (req.query.product) {
        query.where("product").equals(req.query.product);
    }
    if (req.query.userEmail) {
        query.where("userEmail").equals(req.query.userEmail);
    }
    Review.find(query).sort({ date: -1 }).then(result => {
        if (result) {
            console.log(`Returning ${result.length} reviews.`);
            res.send(result);
        } else {
            console.log("Returning no reviews ");
            res.send({});
        }
    }).catch(err => { res.status(500).send({ message: err.message }) });
};

// Deletes all
exports.deleteEverything = (req, res) => {
    Review.remove().then(result => {
        res.send({ message: "Deleted all Reviews" });
    }).catch(err => {
        return res.status(500).send({
            message: `Could not delete all Reviews. ${err.message}`
        });
    });
};

// Find a single Review with a ID
exports.findOne = (req, res) => {
    Review.findById(req.params.id)
        .then(Review => {
            if (!Review) {
                return res.status(404).send({ message: `Review not found with id ${req.params.id}` });
            }
            res.send(Review);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Review not found with id ${req.params.id}` });
            }
            return res.status(500).send({ message: `Error while retrieving Review with id ${req.params.id}` });
        });
};

// Update a Review identified by the BrandId in the request
exports.update = (req, res) => {
    console.log("Updating Review " + JSON.stringify(req.body));
    // Validate Request
    if (!req.body) {
        return res.status(400).send({ message: "Review body can not be empty" });
    }

    // Find Review and update it with the request body
    Review.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .then(Review => {
            if (!Review) {
                return res.status(404).send({ message: `Review not found with id ${req.params.id}` });
            }
            res.send(Review);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Review not found with id ${req.params.id}` });
            }
            return res.status(500).send({ message: `Error updating Review with id ${req.params.id}` });
        });
};

// Delete a Review with the specified BrandId in the request
exports.delete = (req, res) => {
    Review.findByIdAndRemove(req.params.id)
        .then(Review => {
            if (!Review) {
                return res.status(404).send({ message: `Review not found with id ${req.params.id}` });
            }
            res.send({ message: "Review deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({ message: `Review not found with id ${req.params.id}` });
            }
            return res.status(500).send({
                message: `Could not delete Review with id ${req.params.id}`
            });
        });
};

exports.deleteAll = (req, res) => {
    Review.remove().then(result => {
        res.send({ message: "Deleted all reviews" });
    }).catch(err => {
        return res.status(500).send({
            message: `Could not delete all Review. ${err.message}`
        });
    });
}

/**
 * Persists new Review Model 
 * 
 * @param {Request} req The HTTP Request 
 * @param {*Response} res The HTTP Response
 */
function persist(req, res) {
    console.log(`Attempting to persist Review ` + JSON.stringify(req.body));
    const Review = buildReview(req);
    // Save Review in the database
    Review.save()
        .then(data => {
            console.log(`Persisted Review: ${data._id}`);
            res.status(201).send(data);
        }).catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while creating the Review." });
        });
}

/**
 * Builds Review from incoming Request.
 * @returns Review Model
 * @param {*} req 
 */
function buildReview(req) {
    return new Review(buildReviewJson(req));
}

/**
 * Builds Review JSON incoming Request.
 * 
 * @returns {String} Review JSON
 * @param {Request} req 
 */
function buildReviewJson(req) {
    var data = _.pick(req.body, 'userEmail', 'userName', 'product', 'headline', 'date', 'rating', 'content')
    if (!data.date) {
        data.date = new Date();
    }
    return data;
}