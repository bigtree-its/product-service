//Require Department Model
const Department = require('../model/department');
//Require Underscore JS ( Visit: http://underscorejs.org/#)
const _ = require('underscore');
//Require Mongoose
var mongoose = require('mongoose');
// Require Validation Utils
const { validationResult, errorFormatter } = require('./validation');

// Create and Save a new Department
exports.create = (req, res) => {
    console.log("Creating new Department " + JSON.stringify(req.body));
    // Validate Request
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.json({ errors: _.uniq(errors.array()) });
    }

    checkDuplicateAndPersist(req, res);
};

function checkDuplicateAndPersist(req, res) {
    console.log(`Checking if a Department already exist with name ${req.body.name}`);
    var slug = getSlug(req.body.name);
    Department.exists({ slug: slug }, function(err, result) {
        if (err) {
            return res.status(500).send({ message: `Error while finding Department with name ${req.body.name}` });
        } else if (result) {
            console.log(`Department ${req.body.name} already exist`);
            res.status(400).send({ message: `Department ${req.body.name} already exist.` });
        } else {
            persist(req, res);
        }
    });
}

// Retrieve and return all departments from the database.
exports.findAll = (req, res, next) => {
    if (req.query.name) {
        findByName(req, res);
    } else {
        Department.find()
            .then(data => {
                if (data) {
                    console.log(`Returning ${data.length} departments.`);
                    res.send(data);
                } else {
                    console.log("Returning no departments ");
                    res.send({});
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving departments."
                });
            });
    }
};



function findByName(req, res) {
    console.log(`Received request to get Department with name ${req.query.name}`);
    var slug = getSlug(req.query.name);
    Department.find({ slug: slug }).then(data => { res.send(data); }).catch(err => { res.status(500).send({ message: err.message }) });
}

// Find a single Department with a BrandId
exports.findOne = (req, res) => {
    console.log(`Received request get a Department with id ${req.params.id}`);
    Department.findById(req.params.id)
        .then(Department => {
            if (!Department) {
                return res.status(404).send({ message: `Department not found with id ${req.params.id}` });
            }
            res.send(Department);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Department not found with id ${req.params.id}` });
            }
            return res.status(500).send({ message: `Error while retrieving Department with id ${req.params.id}` });
        });
};

// Deletes all
exports.deleteEverything = (req, res) => {
    Department.remove().then(result => {
        res.send({ message: "Deleted all Department" });
    }).catch(err => {
        return res.status(500).send({
            message: `Could not delete all Department. ${err.message}`
        });
    });
};

// Update a Department identified by the BrandId in the request
exports.update = (req, res) => {
    console.log("Updating Department " + JSON.stringify(req.body));
    // Validate Request
    if (!req.body) {
        return res.status(400).send({ message: "Department body can not be empty" });
    }
    if (!req.body.name) {
        return res.status(400).send({ message: "Department name can not be empty" });
    }
    // Find Department and update it with the request body
    Department.findByIdAndUpdate(req.params.id, buildDepartmentJson(req), { new: true })
        .then(Department => {
            if (!Department) {
                return res.status(404).send({ message: `Department not found with id ${req.params.id}` });
            }
            res.send(Department);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Department not found with id ${req.params.id}` });
            }
            return res.status(500).send({ message: `Error updating Department with id ${req.params.id}` });
        });
};

// Delete a Department with the specified BrandId in the request
exports.delete = (req, res) => {
    Department.findByIdAndRemove(req.params.id)
        .then(Department => {
            if (!Department) {
                return res.status(404).send({ message: `Department not found with id ${req.params.id}` });
            }
            res.send({ message: "Department deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({ message: `Department not found with id ${req.params.id}` });
            }
            return res.status(500).send({
                message: `Could not delete Department with id ${req.params.id}`
            });
        });
};

exports.deleteAll = (req, res) => {
    Department.remove().then(result => {
        res.send({ message: "Deleted all departments" });
    }).catch(err => {
        return res.status(500).send({
            message: `Could not delete all Department. ${err.message}`
        });
    });
}

/**
 * Persists new Department Model 
 * 
 * @param {Request} req The HTTP Request 
 * @param {*Response} res The HTTP Response
 */
function persist(req, res) {
    console.log(`Attempting to persist Department ` + JSON.stringify(req.body));
    const Department = buildDepartment(req);
    // Save Department in the database
    Department.save()
        .then(data => {
            console.log(`Persisted Department: ${data._id}`);
            res.status(201).send(data);
        }).catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while creating the Department." });
        });
}

/**
 * Builds Department from incoming Request.
 * @returns Department Model
 * @param {*} req 
 */
function buildDepartment(req) {
    return new Department(buildDepartmentJson(req));
}

/**
 * Builds Department JSON incoming Request.
 * 
 * @returns {String} Department JSON
 * @param {Request} req 
 */
function buildDepartmentJson(req) {
    return {
        name: req.body.name,
        slug: req.body.slug || getSlug(req.body.name)
    };
}
/**
 * Returns the slog from the given name
 * e.g if name = M & S Foods then Slug = m-s-foods
 * Replaces special characters and replace space with -
 * 
 * @param {String} name 
 */
function getSlug(name) {
    console.log(`Converting ${name} to slug`);
    return name.trim().replace(/[\W_]+/g, "-").toLowerCase()
}