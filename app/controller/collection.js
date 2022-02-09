const Collection = require('../model/collection');

//Require Underscore JS ( Visit: http://underscorejs.org/#)
const _ = require('underscore');

// Require Validation Utils
const { validationResult, errorFormatter } = require('./validation');

// Create and Save a new Collection
exports.create = (req, res) => {
    console.log("Creating new collection " + JSON.stringify(req.body));
    // Validate Request
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.json({ errors: _.uniq(errors.array()) });
    }
    console.log(`Finding if a collection already exist  ${req.body.name}`);
    Collection.exists({ name: req.body.name }, function (err, result) {
        if (err) {
            return res.status(500).send({ message: `Error while finding Collection for name ${req.body.name}` });
        } else if (result) {
            console.log(`Collection already exist for name ${req.body.name}`);
            res.status(400).send({ message: `Collection already exist for name ${req.body.name}` });
        } else {
            if (req.body.active == true) {
                activeCheck(req, res);
            } else {
                persist(req, res);
            }
        }
    });

};

// Deletes all
exports.deleteEverything = (req, res) => {
    Collection.remove().then(result => {
        res.send({ message: "Deleted all Collection" });
    }).catch(err => {
        return res.status(500).send({
            message: `Could not delete all Collection. ${err.message}`
        });
    });
};


/**
 * Check if an active collection already exist.
 * Maximum one active collection allowed
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function activeCheck(req, res) {
    Collection.exists({ active: true }, function (err, result) {
        if (err) {
            console.log(`Error while finding Active Collection: ${err}`);
            return res.status(500).send({ message: `Cannot create collection. Internal Server Error` });
        } else if (result) {
            console.log(`An active collection already exist`);
            res.status(400).send({ message: `An active collection already exist` });
        } else {
            persist(req, res);
        }
    });
}


// Retrieve and return all collections from the database.
exports.findAll = (req, res) => {
    console.log("Received request to get all collections");
    Collection.find()
        .then(data => {
            if (data) {
                console.log("Returning " + data.length + " collections.");
                res.send(data);
            } else {
                console.log("Returning no collections ");
                res.send({});
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving collections."
            });
        });
};

// Find a single Collection with a Id
exports.findOne = (req, res) => {
    console.log("Received request get a collection with id " + req.params.id);
    Collection.findById(req.params.id)
        .then(collection => {
            if (!collection) {
                return carouselNotFoundWithId(req, res);
            }
            res.send(collection);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return carouselNotFoundWithId(req, res);
            }
            return res.status(500).send({ message: "Error while retrieving Collection with id " + req.params.id });
        });
};

// Update a Collection identified by the BrandId in the request
exports.update = (req, res) => {
    console.log("Updating collection " + JSON.stringify(req.body));
    // Validate Request
    if (!req.body) {
        return res.status(400).send({ message: "Collection body can not be empty" });
    }
    // Find Collection and update it with the request body
    Collection.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .then(collection => {
            if (!collection) {
                return carouselNotFoundWithId(req, res);
            }
            res.send(collection);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return carouselNotFoundWithId(req, res);
            }
            return res.status(500).send({
                message: "Error updating Collection with id " + req.params.id
            });
        });
};

// Delete a Collection with the specified BrandId in the request
exports.delete = (req, res) => {
    Collection.findByIdAndRemove(req.params.id)
        .then(collection => {
            if (!collection) {
                return carouselNotFoundWithId(req, res);
            }
            res.send({ message: "Collection deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return carouselNotFoundWithId(req, res);
            }
            return res.status(500).send({
                message: "Could not delete Collection with id " + req.params.id
            });
        });
};

/**
 * Persists new Collection document
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function persist(req, res) {
    const collection = buildCarouselObject(req);
    // Save Collection in the database
    collection.save()
        .then(data => {
            res.status(201).send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Collection."
            });
        });
}

/**
 * Sends 404 HTTP Response with Message
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function carouselNotFoundWithId(req, res) {
    res.status(404).send({ message: `Collection not found with id ${req.params.id}` });
}

/**
 * Builds Collection object from Request
 * 
 * @param {Request} req 
 */
function buildCarouselObject(req) {
    return new Collection(buildCollectionJson(req));
}

/**
 * Builds Collection Json from Request
 * 
 * @param {Request} req 
 */
function buildCollectionJson(req) {
    return {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        active: req.body.active
    };
}

/**
 * Returns the slug from the given name
 * e.g if name = M & S Foods then Slug = m-s-foods
 * Replaces special characters and replace space with -
 * 
 * @param {String} name 
 */
function getSlug(name) {
    return name.trim().replace(/[\W_]+/g, "-").toLowerCase()
}