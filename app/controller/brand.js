const Brand = require('../model/brand');
// Require Validation Utils
const { validationResult, errorFormatter } = require('./validation');

// Create and Save a new Brand
exports.create = (req, res) => {
    console.log("Creating new brand " + JSON.stringify(req.body));
    // Validate Request
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.json({ errors: _.uniq(errors.array()) });
    }
    console.log(`Finding if a brand already exist with name ${req.body.name}`);
    Brand.exists({ name: req.body.name }, function(err, result) {
        if (err) {
            return res.status(500).send({ message: `Error while finding Brand with name ${req.body.name}` });
        } else if (result) {
            console.log(`Brand already exist with name ${req.body.name}`);
            res.status(400).send({ message: `Brand already exist with name ${eq.body.name}` });
        } else {
            persist(req, res);
        }
    });

};


// Retrieve and return all Brands from the database.
exports.findAll = (req, res) => {
    console.log("Received request to get all brands");
    Brand.find()
        .then(data => {
            if (data) {
                console.log("Returning " + data.length + " brands.");
                res.send(data);
            } else {
                console.log("Returning no brands ");
                res.send({});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving brands."
            });
        });
};

// Find a single Brand with a BrandId
exports.findOne = (req, res) => {
    console.log("Received request get a brand with id " + req.params.id);
    Brand.findById(req.params.id)
        .then(brand => {
            if (!brand) {
                return brandNotFoundWithId(req, res);
            }
            res.send(brand);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return brandNotFoundWithId(req, res);
            }
            return res.status(500).send({ message: "Error while retrieving Brand with id " + req.params.id });
        });
};

// Update a Brand identified by the BrandId in the request
exports.update = (req, res) => {
    console.log("Updating brand " + JSON.stringify(req.body));
    // Validate Request
    if (!req.body) {
        return res.status(400).send({ message: "Brand body can not be empty" });
    }
    // Find Brand and update it with the request body
    Brand.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .then(brand => {
            if (!brand) {
                return brandNotFoundWithId(req, res);
            }
            res.send(brand);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return brandNotFoundWithId(req, res);
            }
            return res.status(500).send({
                message: "Error updating Brand with id " + req.params.id
            });
        });
};

// Delete a Brand with the specified BrandId in the request
exports.delete = (req, res) => {
    Brand.findByIdAndRemove(req.params.id)
        .then(brand => {
            if (!brand) {
                return brandNotFoundWithId(req, res);
            }
            res.send({ message: "Brand deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return brandNotFoundWithId(req, res);
            }
            return res.status(500).send({
                message: "Could not delete Brand with id " + req.params.id
            });
        });
};

/**
 * Persists new Brand document
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function persist(req, res) {
    const brand = buildBrandObject(req);
    // Save Brand in the database
    brand.save()
        .then(data => {
            res.status(201).send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Brand."
            });
        });
}

/**
 * Sends 404 HTTP Response with Message
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function brandNotFoundWithId(req, res) {
    res.status(404).send({ message: `Brand not found with id ${req.params.id}` });
}

/**
 * Builds Brand object from Request
 * 
 * @param {Request} req 
 */
function buildBrandObject(req) {
    return new Brand(buildBrandJson(req));
}

/**
 * Builds Brand Json from Request
 * 
 * @param {Request} req 
 */
function buildBrandJson(req) {
    return {
        name: req.body.name,
        slug: req.body.slug || req.body.name.trim().replace(/[\W_]+/g, "-").toLowerCase(),
        logo: req.body.logo,
        manufacturer: req.body.manufacturer,
        exporter: req.body.exporter,
        importer: req.body.importer
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