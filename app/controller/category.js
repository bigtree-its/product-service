//Require Category Model
const Category = require('../model/category');
//Require Underscore JS ( Visit: http://underscorejs.org/#)
const _ = require('underscore');
//Require Mongoose
var mongoose = require('mongoose');
// Require Validation Utils
const { validationResult, errorFormatter } = require('./validation');

// Create and Save a new Category
exports.create = (req, res) => {
    console.log("Creating new Category " + JSON.stringify(req.body));
    // Validate Request
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.json({ errors: _.uniq(errors.array()) });
    }
    // if (req.body.parent) {
    //     Category.exists({ "_id": req.body.parent }, function(err, result) {
    //         if (err) {
    //             return res.status(400).send({ message: `Parent Category: ${req.body.parent} not found.` });
    //         } else if (result) {
    //             checkDuplicateAndPersist(req, res);
    //         } else {
    //             console.log(`Cannot create category. The parent category ${req.body.parent} not found`);
    //             return res.status(400).send({ message: `Cannot create category. The parent category ${req.body.parent} not found` });
    //         }
    //     });
    // } else {
    // }
    checkDuplicateAndPersist(req, res);
};

function checkDuplicateAndPersist(req, res) {
    console.log(`Checking if a Category already exist with name ${req.body.name}`);
    Category.exists({ name: req.body.name }, function(err, result) {
        if (err) {
            return res.status(500).send({ message: `Error while finding Category with name ${req.body.name}` });
        } else if (result) {
            console.log(`Category already exist with name ${req.body.name}`);
            res.status(400).send({ message: `Category ${req.body.name} already exist.` });
        } else {
            persist(req, res);
        }
    });
}

// Retrieve and return all categories from the database.
exports.findAll = (req, res, next) => {
    if (req.query.top) {
        findTop(req, res, next);
    } else if (req.query.parent) {
        findAllByParent(req, res, next);
    } else if (req.query.name) {
        findByName(req, res);
    } else if (req.query.tree) {
        getCategoryTree(req, res);
    } else if (req.query.department) {
        findAllByDepartment(req, res);
    } else {
        Category.find()
            .then(data => {
                if (data) {
                    console.log(`Returning ${data.length} categories.`);
                    res.send(data);
                } else {
                    console.log("Returning no categories ");
                    res.send({});
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving categories."
                });
            });
    }
};

function findTop(req, res) {
    Category.find({ parent: null }).then(result => {
        if (result) {
            console.log(`Returning ${result.length} categories.`);
            res.send(result);
        } else {
            console.log("Returning no categories ");
            res.send({});
        }
    }).catch(err => { res.status(500).send({ message: err.message }) });
}

function findAllByParent(req, res) {
    var parent = req.query.parent;
    if (mongoose.Types.ObjectId.isValid(parent)) {
        console.log(`Received request to get all sub categories of ${req.query.parent}`);
        Category.find({ parent: parent }).then(data => {
            console.log('Returning ' + data.length + ' sub categories of ' + parent);
            res.send(data);
        }).catch(err => { res.status(500).send({ message: err.message }) });
    } else {
        console.error(`Parent id ${parent} is not valid ObjectId`);
        return res.status(400).send({ message: `Parent id ${parent} is not valid` });
    }
}

async function findAllByDepartment(req, res) {
    var department = req.query.department;
    if (mongoose.Types.ObjectId.isValid(department)) {
        Category.find({ department: req.query.department })
            .then(data => {
                res.send(data);
            })
            .catch(err => { res.status(500).send({ message: err.message }) });
    } else {
        console.error(`Department id ${department} is not valid`);
        return res.status(400).send({ message: `Department id ${department} is not valid` });
    }
}

function getCategoryTree(req, res) {
    Category.getChildrenTree({}).then(data => { res.send(data); }).catch(err => { res.status(500).send({ message: err.message }) });
}

function findByName(req, res) {
    console.log(`Received request to get category with name ${req.query.name}`);
    Category.find({ name: req.query.name }).then(data => { res.send(data); }).catch(err => { res.status(500).send({ message: err.message }) });
}

// Find a single Category with a BrandId
exports.findOne = (req, res) => {
    console.log(`Received request get a Category with id ${req.params.id}`);
    Category.findById(req.params.id)
        .then(Category => {
            if (!Category) {
                return res.status(404).send({ message: `Category not found with id ${req.params.id}` });
            }
            res.send(Category);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Category not found with id ${req.params.id}` });
            }
            return res.status(500).send({ message: `Error while retrieving Category with id ${req.params.id}` });
        });
};

// Update a Category identified by the BrandId in the request
exports.update = (req, res) => {
    console.log("Updating Category " + JSON.stringify(req.body));
    // Validate Request
    if (!req.body) {
        return res.status(400).send({ message: "Category body can not be empty" });
    }

    // Find Category and update it with the request body
    Category.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .then(Category => {
            if (!Category) {
                return res.status(404).send({ message: `Category not found with id ${req.params.id}` });
            }
            res.send(Category);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Category not found with id ${req.params.id}` });
            }
            return res.status(500).send({ message: `Error updating Category with id ${req.params.id}` });
        });
};

// Delete a Category with the specified BrandId in the request
exports.delete = (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then(Category => {
            if (!Category) {
                return res.status(404).send({ message: `Category not found with id ${req.params.id}` });
            }
            res.send({ message: "Category deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({ message: `Category not found with id ${req.params.id}` });
            }
            return res.status(500).send({
                message: `Could not delete Category with id ${req.params.id}`
            });
        });
};

exports.deleteAll = (req, res) => {
    Category.remove().then(result => {
        res.send({ message: "Deleted all categories" });
    }).catch(err => {
        return res.status(500).send({
            message: `Could not delete all Category. ${err.message}`
        });
    });
}

/**
 * Persists new Category Model 
 * 
 * @param {Request} req The HTTP Request 
 * @param {*Response} res The HTTP Response
 */
function persist(req, res) {
    console.log(`Attempting to persist Category ` + JSON.stringify(req.body));
    const category = buildCategory(req);
    // Save Category in the database
    category.save()
        .then(data => {
            console.log(`Persisted Category: ${data._id}`);
            res.status(201).send(data);
        }).catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while creating the Category." });
        });
}

/**
 * Builds Category from incoming Request.
 * @returns Category Model
 * @param {*} req 
 */
function buildCategory(req) {
    return new Category(buildCategoryJson(req));
}

/**
 * Builds Category JSON incoming Request.
 * 
 * @returns {String} Category JSON
 * @param {Request} req 
 */
function buildCategoryJson(req) {
    var data = _.pick(req.body, 'name', 'slug', 'parent', 'department')
    if (data.parent && !mongoose.Types.ObjectId.isValid(data.parent)) {
        console.debug(`Parent id is not valid. Hence removing it.`);
        data.parent = "";
    }
    if (data.department && !mongoose.Types.ObjectId.isValid(data.department)) {
        console.debug(`Department id is not valid. Hence removing it.`);
        data.department = "";
    }

    return {
        name: data.name,
        slug: data.slug || getSlug(data.name),
        parent: data.parent,
        department: data.department,
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
    return name.trim().replace(/[\W_]+/g, "-").toLowerCase()
}