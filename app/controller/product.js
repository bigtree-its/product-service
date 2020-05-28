//Require Product Model
const Product = require('../model/product');
const Category = require('../model/category');
const Brand = require('../model/brand');
//Require Underscore JS ( Visit: http://underscorejs.org/#)
const _ = require('underscore');
//Require Mongoose
var mongoose = require('mongoose');
//Require Generate Safe Id for Random unique id Generation
var generateSafeId = require('generate-safe-id');

// Create and Save a new Product
exports.create = async (req, res) => {
    console.log("Creating new Product " + JSON.stringify(req.body));
    // Validate Request
    if (!req.body) {
        return res.status(400).send({ message: "Product body cannot be empty" });
    }
    if (!req.body.name) {
        return res.status(400).send({ message: "Product name cannot be empty" });
    }
    if (req.body.categories && req.body.categories.length > 0) {
        var categories = _.uniq(req.body.categories);
        if (!validateCategories(categories, res)) {
            return res.status(400).send({ message: `Category Id(s) not a valid ObjectId` });
        }
        /**
         * Model.find()..exec() returns Promise.
         * Promise can be either resolved or rejected
         * If it rejected then we must catch the rejection reason.
         * The await keyword converts promise rejections to catchable errors
         */
        try {
            var result = await Category.find().where('_id').in(categories).exec();
            if (result.length != categories.length) {
                console.log(`Cannot find one or many categories mentioned [${categories}]`);
                return res.status(400).send({ message: `Cannot find one or many categories mentioned [${categories}]` });
            }
        } catch (error) {
            console.log("Error: " + error);
            return res.status(400).send({ message: `Cannot find one or many categories mentioned [${categories}]` });
        }
    }
    this.validateBrand(req, res);
    checkDuplicateAndPersist(req, res);
};

exports.validateBrand = async (req, res) => {
    var brand = req.body.brand;
    if (brand) {
        if (!mongoose.Types.ObjectId.isValid(brand)) {
            return res.status(400).send({ message: `Brand : ${brand} not valid.` });
        } else {
            var records = await Brand.find().where('_id', brand).exec();
            console.log("Verified brand: " + records);
            if (!records) {
                return res.status(400).send({ message: `Brand : ${brand} not valid.` });
            }
        }
    }
};

function validateCategories(categories) {
    console.log("Validating categories " + categories);
    for (let CategoryId of categories) {
        console.log("Validating Category " + CategoryId);
        if (!mongoose.Types.ObjectId.isValid(CategoryId)) {
            console.log(`Category Id ${CategoryId} is not a valid ObjectId`);
            return false;
        }
    }
    return true;
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

exports.paginate = (req, res) => {
    req.query.page = req.query.page || 1;
    req.query.limit = req.query.limit || 25;
    const options = { page: req.query.page, limit: req.query.limit };
    let query = Product.find();
    if (req.query.name) {
        query.where('name', { $regex: '.*' + req.query.name + '.*' })
    }
    if (req.query.categories) {
        validateCategories(req.query.categories, res);
        query.where('categories', { $in: req.query.categories })
    }
    Product.aggregatePaginate(query, options, function (err, result) {
        if (result) {
            console.log(`Returning ${result.docs.length} products.`);
            res.send(result);
        } else if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving products."
            });
        }
    });

}   

// Retrieve and return all products from the database.
exports.findAll = (req, res) => {

    let query = Product.find();
    if (req.query.name) {
        query.where('name', { $regex: '.*' + req.query.name + '.*' })
    }
    if (req.query.categories) {
        validateCategories(req.query.categories, res);
        query.where('categories', { $in: req.query.categories })
    }
    Product.find(query, function (err, result) {
        if (result) {
            console.log(`Returning ${result.length} products.`);
            res.send(result);
        } else if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving products."
            });
        }
    });
};

function findByCategory(categories, res) {
    validateCategories(categories, res, function (err, result) {
        Product.find({ categories: { $in: categories } }).then(data => { res.send(data); }).catch(err => { res.status(500).send({ message: err.message }) });
    });
}

function findByName(req, res) {
    console.log(`Received request to get product ${req.query.name}`);
    Product.find({ name: { $regex: '.*' + req.query.name + '.*' } }).then(data => { res.send(data); }).catch(err => { res.status(500).send({ message: err.message }) });
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

// Deletes a Product with the specified BrandId in the request
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
