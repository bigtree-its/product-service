const Product = require('../model/product');

// Create and Save a new Product
exports.create = (req, res) => {
    console.log("Creating new Product " + JSON.stringify(req.body));
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: "Product body can not be empty"
        });
    }
    if (!req.body.name) {
        return res.status(400).send({
            message: "Product name can not be empty"
        });
    }
    if (req.body.parent) {
        Product.exists({"_id":req.body.parent}, function(err, result){
            if (err) {
                return res.status(500).send({
                    message: "Error while finding Product with id " + req.body.parent
                });
            } else if (result) {
                checkDuplicateAndPersist(req, res);
            } else {
                console.log("Cannot create Product. The parent Product " + req.body.parent+" not found");
                return res.status(400).send({
                    message: "Cannot create Product. The parent Product " + req.body.parent+" not found"
                });
            }
        });
    }else{
        checkDuplicateAndPersist(req, res);
    }
};


function checkDuplicateAndPersist(req, res) {
    console.log("Checking if a Product already exist with name " + req.body.name);
    Product.exists({ name: req.body.name, parent: req.body.parent }, function (err, result) {
        if (err) {
            return res.status(500).send({
                message: "Error while finding Product with name " + req.body.name
            });
        }
        else if (result) {
            console.log("Product already exist with name " + req.body.name);
            res.status(400).send({ message: "Product already exist with name " + req.body.name });
        }
        else {
            persist(req, res);
        }
    });
}

function persist(req, res) {
    const Product = new Product({
        name: req.body.name,
        slug: req.body.slug || req.body.name.split(" ").join("-").trim().toLowerCase(),
        parent: req.body.parent
    });
    // Save Note in the database
    Product.save()
        .then(data => {
            console.log("Persisted Product: " + data._id);
            res.status(201).send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Product."
            });
        });
}

// Retrieve and return all categories from the database.
exports.findAll = (req, res) => {
    console.log("Received request to get all categories");
    Product.find()
        .then(data => {
            if (data) {
                console.log("Returning " + data.length + " categories.");
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
};

// Find a single Product with a BrandId
exports.findOne = (req, res) => {
    console.log("Received request get a Product with id " + req.params.id);
    Product.findById(req.params.id)
        .then(Product => {
            if (!Product) {
                return res.status(404).send({ message: "Product not found with id " + req.params.id });
            }
            res.send(Product);
        }
        )
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: "Product not found with id " + req.params.id });
            }
            return res.status(500).send({ message: "Error while retrieving Product with id " + req.params.id });
        });
};

// Update a Product identified by the BrandId in the request
exports.update = (req, res) => {
    console.log("Updating Product "+ JSON.stringify(req.body));
    // Validate Request
   if(!req.body) {
       return res.status(400).send({
           message: "Product body can not be empty"
       });
   }
   if(!req.body.name) {
       return res.status(400).send({
           message: "Product name can not be empty"
       });
   }
   // Find Product and update it with the request body
   Product.findByIdAndUpdate(req.params.id, {
       name: req.body.name,
       slug: req.body.slug || req.body.name.split(" ").join("-").trim().toLowerCase(),
       parent: req.body.parent
   }, {new: true})
   .then(Product => {
       if(!Product) {
           return res.status(404).send({
               message: "Product not found with id " + req.params.id
           });
       }
       res.send(Product);
   }).catch(err => {
       if(err.kind === 'ObjectId') {
           return res.status(404).send({
               message: "Product not found with id " + req.params.id
           });                
       }
       return res.status(500).send({
           message: "Error updating Product with id " + req.params.id
       });
   });
};

// Delete a Product with the specified BrandId in the request
exports.delete = (req, res) => {
    Product.findByIdAndRemove(req.params.id)
    .then(Product => {
        if(!Product) {
            return res.status(404).send({
                message: "Product not found with id " + req.params.id
            });
        }
        res.send({message: "Product deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Product not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete Product with id " + req.params.id
        });
    });
};