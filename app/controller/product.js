//Require Product Model
const Product = require('../model/product');
const Category = require('../model/category');
const Brand = require('../model/brand');
//Require Underscore JS ( Visit: http://underscorejs.org/#)
const _ = require('underscore');
//Require Mongoose
var mongoose = require('mongoose');
var generateSafeId = require('generate-safe-id');

// Create and Save a new Product
exports.create = (req, res) => {
    console.log("Creating new Product " + JSON.stringify(req.body));
    // Validate Request
    if (!req.body) {
        return res.status(400).send({ message: "Product body cannot be empty" });
    }
    if (!req.body.name) {
        return res.status(400).send({ message: "Product name cannot be empty" });
    }
    if (req.body.categories && req.body.categories.length > 0) {
        console.log("Categories " + req.body.categories);
        validateCategories(req.body.categories, res);
        Category.find({ '_id': { $in: req.body.categories } }, function (err, result) {
            if (err) {
                return res.status(400).send({ message: `Some of the Categories : ${req.body.categories} not found.` });
            } else if (result && result.length == req.body.categories.length) {
                validateBrand(req, res);
            } else {
                return res.status(400).send({ message: `Some of the Categories : ${req.body.categories} not found.` });
            }
        });
    } else {
        validateBrand(req, res);
    }
};

function validateBrand(req, res) {
    var brand = req.body.brand;
    if (brand) {
        if (!mongoose.Types.ObjectId.isValid(brand)) {
            return res.status(400).send({ message: `Brand : ${brand} not valid.` });
        } else {
            Brand.exists({ _id: brand }, function (err, result) {
                if (err) {
                    return res.status(400).send({ message: `Brand : ${brand} not valid.` });
                } else if (result) {
                    checkDuplicateAndPersist(req, res);
                } else {
                    return res.status(400).send({ message: `Brand : ${brand} not valid.` });
                }
            });
        }
    } else {
        return res.status(400).send({ message: `Brand value is mandatory!` });
    }
}

function validateCategories(categories, res){
    for (let CategoryId of categories) {
        console.log("Validating Category " + CategoryId);
        if (!mongoose.Types.ObjectId.isValid(CategoryId)) {
            console.error(`Category Id ${CategoryId} is not a valid ObjectId`);
            return res.status(400).send({ message: `Category Id ${CategoryId} is not a valid ObjectId` });
        }
    }
}
function checkDuplicateAndPersist(req, res) {
    console.log(`Checking for duplicate.. Name: ${req.body.name}`);
    Product.exists({ name: req.body.name }, function (err, result) {
        if (err) {
            return res.status(500).send({ message: `Error while finding Product with name ${req.body.name}` });
        }
        else if (result) {
            console.log(`Product already exist with name ${req.body.name}`);
            res.status(400).send({ message: `Product ${req.body.name} already exist.` });
        }
        else {
            persist(req, res);
        }
    });
}

// Retrieve and return all products from the database.
exports.findAll = (req, res) => {
    if (req.query.categories) {
        console.log("Search Query "+ req.query.categories)
        findByCategory(req.query.categories, res);
    } else if (req.query.name) {
        findByName(req, res);
    } else {
        console.log("Received request to get all products");
        Product.find()
            .then(data => {
                if (data) {
                    console.log(`Returning ${data.length} products.`);
                    res.send(data);
                } else {
                    console.log("Returning no products ");
                    res.send({});
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving products."
                });
            });
    }
};

function findByCategory(categories, res) {
    validateCategories(categories, res, function(err, result){

        Product.find({ categories: {$in: categories} }).then(data => { res.send(data); }).catch(err => { res.status(500).send({ message: err.message }) });
    });
}

function findByName(req, res) {
    console.log(`Received request to get product ${req.query.name}`);
    Product.find({ name: req.query.name }).then(data => { res.send(data); }).catch(err => { res.status(500).send({ message: err.message }) });
}

// Find a single Product with a BrandId
exports.findOne = (req, res) => {
    Product.findById(req.params.id)
        .then(Product => {
            if (!Product) {
                return res.status(404).send({ message: `Product not found with id ${req.params.id}` });
            }
            res.send(Product);
        }
        )
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Product not found with id ${req.params.id}` });
            }
            return res.status(500).send({ message: `Error while retrieving Product with id ${req.params.id}` });
        });
};

// Update a Product identified by the BrandId in the request
exports.update = (req, res) => {
    console.log("Updating Product " + JSON.stringify(req.body));
    // Validate Request
    if (!req.body) {
        return res.status(400).send({ message: "Product body cannot be empty" });
    }
    if (!req.body.name) {
        return res.status(400).send({ message: "Product name cannot be empty" });
    }
    // Find Product and update it with the request body
    Product.findByIdAndUpdate(req.params.id, buildProductJson(req), { new: true })
        .then(Product => {
            if (!Product) {
                return res.status(404).send({ message: `Product not found with id ${req.params.id}` });
            }
            res.send(Product);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Product not found with id ${req.params.id}` });
            }
            return res.status(500).send({ message: `Error updating Product with id ${req.params.id}` });
        });
};

// Delete a Product with the specified BrandId in the request
exports.delete = (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then(Product => {
            if (!Product) {
                return res.status(404).send({ message: `Product not found with id ${req.params.id}` });
            }
            res.send({ message: "Product deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({ message: `Product not found with id ${req.params.id}` });
            }
            return res.status(500).send({
                message: `Could not delete Product with id ${req.params.id}`
            });
        });
};

/**
 * Persists new Product Model 
 * 
 * @param {Request} req The HTTP Request 
 * @param {*Response} res The HTTP Response
 */
function persist(req, res) {
    console.log(`Attempting to persist Product ` + JSON.stringify(req.body));
    const product = buildProduct(req);
    // Save Product in the database
    product.save()
        .then(data => {
            console.log(`Persisted Product: ${data._id}`);
            res.status(201).send(data);
        }).catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while creating the Product." });
        });
}

/**
 * Builds Product from incoming Request.
 * @returns Product Model
 * @param {Request} req 
 */
function buildProduct(req) {
    return new Product(buildProductJson(req));
}

/**
 * Builds Product JSON incoming Request.
 * 
 * @returns {String} Product JSON
 * @param {Request} req 
 */
function buildProductJson(req) {
    var data = req.body;
    var randomId = generateSafeId();
    return {
        name: data.name,
        categories: data.categories,
        brand: data.brand,
        description: data.description,
        storage: data.storage,
        slug: data.slug || getSlag(data.name),
        pin: data.pin || randomId,
        sku: data.sku || randomId,
        availability: data.availability || 'Out of Stock',
        salePrice: data.salePrice || 0.00,
        listPrice: data.listPrice || 0.00,
        stock: data.stock || 0,
        kids: data.kids || true,
        edible: data.edible || true,
        adultsOnly: data.adultsOnly || false
    };
}
/**
 * Returns the slog from the given name
 * e.g if name = M & S Foods then Slug = m-s-foods
 * Replaces special characters and replace space with -
 * 
 * @param {String} name 
 */
function getSlag(name) {
    return name.trim().replace(/[\W_]+/g, "-").toLowerCase()
}
