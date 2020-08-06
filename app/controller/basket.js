//Require Basket Model
const Basket = require('../model/basket');
//Require Underscore JS ( Visit: http://underscorejs.org/#)
const _ = require('underscore');
//Require Mongoose
var mongoose = require('mongoose');
//Require Generate Safe Id for Random unique id Generation
var generateSafeId = require('generate-safe-id');
// Require Validation Utils
const { validationResult, errorFormatter } = require('./validation');

// Create and Save a new Basket
exports.create = async(req, res) => {

    console.log("Creating new Basket " + JSON.stringify(req.body));
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.json({ errors: _.uniq(errors.array()) });
    }
    /**
     * Model.find()..exec() returns Promise.
     * Promise can be either resolved or rejected
     * If it rejected then we must catch the rejection reason.
     * The await keyword converts promise rejections to catchable errors
     */
    console.log(`Checking for duplicate Basket for ClientIp: ${req.body.clientIp}, User: ${req.body.userEmail }`);
    Basket.exists({ $or: [{ client_ip: req.body.clientIp }, { email: req.body.email }] }, function(err, result) {
        if (err) {
            res.status(500).send({ message: `Error while finding Basket` });
        } else if (result) {
            console.log(`Basket already exist for user from ${req.body.client_ip} or for user ${req.body.email}`);
            res.status(400).send({ message: `Basket ${req.body.name} already exist.` });
        } else {
            const Basket = buildBasket(req);
            // Save Basket in the database
            Basket.save()
                .then(data => {
                    console.log(`Persisted Basket: ${data._id}, Reference: ${data.reference}`);
                    res.status(201).send(data);
                }).catch(err => {
                    res.status(500).send({ message: err.message || "Some error occurred while creating the Basket." });
                });
        }
    });

};


// Retrieve and return all Baskets from the database.
exports.findAll = (req, res) => {

    let query = Basket.find();
    if (req.query.clientIp) {
        query.where('clientIp').equals(req.query.clientIp)
    }
    if (req.query.userEmail) {
        query.where('userEmail').equals(req.query.userEmail)
    }
    if (req.query.reference) {
        query.where('reference').equals(req.query.reference)
    }
    Basket.find(query).populate("items").then(result => {
        console.log(`Returning Basket ${result.reference}`);
        res.send(result);
    }).catch(error => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Baskets."
        });
    });
};

// Find a single Basket with a BrandId
exports.findOne = (req, res) => {
    Basket.findById(req.params.id).populate("items")
        .then(Basket => {
            if (!Basket) {
                return res.status(404).send({ message: `Basket not found with id ${req.params.id}` });
            }
            res.send(Basket);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Basket not found with id ${req.params.id}` });
            }
            return res.status(500).send({ message: `Error while retrieving Basket with id ${req.params.id}` });
        });
};

// Update a Basket identified by the BrandId in the request
exports.update = (req, res) => {
    console.log("Updating Basket " + JSON.stringify(req.body));
    // Validate Request
    if (!req.body) {
        return res.status(400).send({ message: "Basket body cannot be empty" });
    }
    if (!req.body.clientIp && !req.body.userEmail) {
        return res.status(400).send({ message: "Basket must contain either clientIp or userEmail" });
    }
    // Find Basket and update it with the request body
    Basket.findByIdAndUpdate(req.params.id, buildBasketJson(req), { new: true })
        .then(Basket => {
            if (!Basket) {
                return res.status(404).send({ message: `Basket not found with id ${req.params.id}` });
            }
            res.send(Basket);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Basket not found with id ${req.params.id}` });
            }
            return res.status(500).send({ message: `Error updating Basket with id ${req.params.id}` });
        });
};

// Deletes a Basket with the specified BrandId in the request
exports.delete = (req, res) => {
    Basket.findByIdAndRemove(req.params.id)
        .then(Basket => {
            if (!Basket) {
                return res.status(404).send({ message: `Basket not found with id ${req.params.id}` });
            }
            res.send({ message: "Basket deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({ message: `Basket not found with id ${req.params.id}` });
            }
            return res.status(500).send({
                message: `Could not delete Basket with id ${req.params.id}`
            });
        });
};


/**
 * Builds Basket from incoming Request.
 * @returns Basket Model
 * @param {Request} req 
 */
function buildBasket(req) {
    return new Basket(buildBasketJson(req));
}

/**
 * Builds Basket JSON incoming Request.
 * 
 * @returns {String} Basket JSON
 * @param {Request} req 
 */
function buildBasketJson(req) {
    var data = req.body;
    var safeId = generateSafeId();
    return {
        clientIp: data.clientIp,
        userEmail: data.email,
        reference: data.reference || safeId,
        items: data.items,
        subTotal: data.subTotal || 0.00,
        delivery: data.delivery || 0.00,
        total: data.total || 0.00,
        discountAmount: data.discountAmount || 0.00,
        discountPercentage: data.discountPercentage || 0
    };
}