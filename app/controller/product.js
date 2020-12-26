//Require Product Model
const Product = require('../model/product');
const Category = require('../model/category');
const Brand = require('../model/brand');
const Department = require('../model/department');
//Require Underscore JS ( Visit: http://underscorejs.org/#)
const _ = require('underscore');
//Require Mongoose
var mongoose = require('mongoose');
//Require Generate Safe Id for Random unique id Generation
var generateSafeId = require('generate-safe-id');
// Require Validation Utils
const { validationResult, errorFormatter } = require('./validation');

// Create and Save a new Product
exports.create = async(req, res) => {

    console.log("Creating new Product " + JSON.stringify(req.body));
    /** Check for validation errors */
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.json({ errors: _.uniq(errors.array()) });
    }

    /** Validate if the given department is correct */
    this.validateDepartment(res, req.body.department);
    /** Validate if the given Categories are correct */
    this.validateCategory(res, req.body.categories);
    /** Validate if the given brand is correct */
    this.validateBrand(res, req.body.brand);

    /** Persist */
    checkDuplicateAndPersist(req, res);
};

/**
 * Model.find()..exec() returns Promise.
 * Promise can be either resolved or rejected
 * If it rejected then we must catch the rejection reason.
 * The await keyword converts promise rejections to catchable errors
 */
exports.validateCategory = async(res, categories) => {
    try {
        var cats = [];
        cats.push(categories);
        var categoriesUniq = _.uniq(cats);
        console.log(`Verifying category Id's ${categories}`);
        var result = await Category.find().where('_id').in(categoriesUniq).exec();
        if (result.length != categoriesUniq.length) {
            console.log(`Cannot find one or more categories in [${categoriesUniq}]`);
            return res.status(400).send({ message: `Cannot find one or more categories in [${categoriesUniq}]` });
        } else {
            console.log(`Category [${categoriesUniq}] are valid`);
        }
    } catch (error) {
        console.log("Error: " + error);
        return res.status(400).send({ message: `Cannot find one or many categories mentioned [${categoriesUniq}]` });
    }
};

exports.validateBrand = async(res, ...brands) => {
    try {
        var records = await Brand.find().where('_id').in(brands).exec();
        console.log("Verified brand Id(s): " + records);
        if (!records) {
            return res.status(400).send({ message: `Brand Id(s) : ${brands} not valid.` });
        }
    } catch (error) {
        console.log("Error: " + error);
        return res.status(400).send({ message: `Cannot find Brand Id(s) mentioned [${brands}]` });
    }
};

exports.validateDepartment = async(res, ...departments) => {
    try {
        console.log(`Validating department ${departments}`);
        var records = await Department.find().where('_id').in(departments).exec();
        console.log("Verified department id(s): " + JSON.stringify(records));
        if (!records) {
            return res.status(400).send({ message: `Department Id(s): ${departments} not valid.` });
        }
    } catch (error) {
        console.log("Error: " + error);
        return res.status(400).send({ message: `Cannot find department Id(s) [${departments}]` });
    }
};

function checkDuplicateAndPersist(req, res) {
    console.log(`Checking if product ${req.body.name} already exist..`);
    Product.exists({ name: req.body.name }, function(err, result) {
        if (err) {
            return res.status(500).send({ message: `Error while finding Product with name ${req.body.name}` });
        } else if (result) {
            console.log(`Product already exist with name ${req.body.name}`);
            res.status(400).send({ message: `Product ${req.body.name} already exist. Pick a new one.` });
        } else {
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
        this.validateCategory(res, req.query.categories);
        query.where('categories', { $in: req.query.categories })
    }
    Product.aggregatePaginate(query, options, function(err, result) {
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
    if (req.query.featured) {
        query.where('featured', 'true')
    }
    if (req.query.categories) {
        console.log(`looking up for categories.. ${req.query.categories}`);
        this.validateCategory(res, req.query.categories);
        query.where('categories', { $in: req.query.categories })
    }
    if (req.query.brands) {
        this.validateBrand(res, req.query.brands);
        query.where('brand', { $in: req.query.brands })
    }
    if (req.query.department) {
        this.validateDepartment(res, req.query.department);
        query.where('department', { $in: req.query.department })
    }
    Product.find(query).populate("brand", "name").populate("categories", "name").then(result => {
        console.log(`Returning ${result.length} products.`);
        res.send(result);
    }).catch(error => {
        console.log("Error while fetching from database. " + error.message);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving products."
        });
    });
};

// Retrieve and return all products from the database.
exports.featured = (req, res) => {
    console.log('Fetching featured product');
    let query = Product.find();
    query.where('featured', 'true')
    Product.find(query).populate("brand", "name").populate("categories", "name").then(result => {
        console.log(`Returning featured product ${result}`);
        res.send(result);
    }).catch(error => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving featured product."
        });
    });
};


// Find a single Product with a BrandId
exports.findOne = (req, res) => {
    Product.findById(req.params.id).populate("brand", "name").populate("categories", "name")
        .then(Product => {
            if (!Product) {
                return res.status(404).send({ message: `Product not found with id ${req.params.id}` });
            }
            res.send(Product);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Product not found with id ${req.params.id}` });
            }
            return res.status(500).send({ message: `Error while retrieving Product with id ${req.params.id}` });
        });
};

// Update a Product 
exports.update = (req, res) => {
    console.log("Updating Product " + JSON.stringify(req.body));
    // Validate Request
    if (!req.body) {
        return res.status(400).send({ message: "Product body cannot be empty" });
    }
    if (req.body.brand) {
        this.validateBrand(res, req.body.brand);
    }
    if (req.body.department) {
        console.log('Call to validate department...')
        this.validateDepartment(res, req.body.department);
    }
    if (req.body.categories) {
        this.validateCategory(res, req.body.categories);
    }
    // Find Product and update it with the request body
    Product.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
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

// Deletes a Product with the specified BrandId in the request
exports.deleteEverything = (req, res) => {
    Product.remove().then(result => {
        res.send({ message: "Deleted all products" });
    }).catch(err => {
        return res.status(500).send({
            message: `Could not delete all products. ${err.message}`
        });
    });
};

/**
 * Persists new Product Model 
 * 
 * @param {Request} req The HTTP Request 
 * @param {Response} res The HTTP Response
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
    var safeId = generateSafeId();
    return {
        name: data.name,
        categories: data.categories,
        summary: data.summary,
        attributes: data.attributes,
        brand: data.brand,
        department: data.department,
        type: data.type,
        description: data.description,
        storage: data.storage,
        slug: data.slug || getSlag(data.name),
        pin: data.pin || safeId,
        sku: data.sku || safeId,
        picture: data.picture,
        availability: data.availability || 'Out of Stock',
        salePrice: data.salePrice || 0.00,
        listPrice: data.listPrice || 0.00,
        stock: data.stock || 0,
        kids: data.kids || true,
        edible: data.edible || true,
        featured: data.featured || false,
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