const Category = require('../model/category');

// Create and Save a new Category
exports.create = (req, res) => {
    console.log("Creating new Category " + JSON.stringify(req.body));
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: "Category body can not be empty"
        });
    }
    if (!req.body.name) {
        return res.status(400).send({
            message: "Category name can not be empty"
        });
    }
    if (req.body.parent) {
        Category.exists({"_id":req.body.parent}, function(err, result){
            if (err) {
                return res.status(500).send({
                    message: "Error while finding Category with id " + req.body.parent
                });
            } else if (result) {
                checkDuplicateAndPersist(req, res);
            } else {
                console.log("Cannot create category. The parent category " + req.body.parent+" not found");
                return res.status(400).send({
                    message: "Cannot create category. The parent category " + req.body.parent+" not found"
                });
            }
        });
    }else{
        checkDuplicateAndPersist(req, res);
    }
};


function checkDuplicateAndPersist(req, res) {
    console.log("Checking if a Category already exist with name " + req.body.name);
    Category.exists({ name: req.body.name }, function (err, result) {
        if (err) {
            return res.status(500).send({
                message: "Error while finding Category with name " + req.body.name
            });
        }
        else if (result) {
            console.log("Category already exist with name " + req.body.name);
            res.status(400).send({ message: "Category already exist with name " + req.body.name });
        }
        else {
            persist(req, res);
        }
    });
}

function persist(req, res) {
    const category = new Category({
        name: req.body.name,
        slug: req.body.slug || req.body.name.split(" ").join("-").trim().toLowerCase(),
        parent: req.body.parent
    });
    // Save Note in the database
    category.save()
        .then(data => {
            console.log("Persisted Category: " + data._id);
            res.status(201).send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Category."
            });
        });
}

// Retrieve and return all categories from the database.
exports.findAll = (req, res) => {
    console.log("Received request to get all categories");
    Category.find()
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

// Find a single Category with a BrandId
exports.findOne = (req, res) => {
    console.log("Received request get a Category with id " + req.params.id);
    Category.findById(req.params.id)
        .then(Category => {
            if (!Category) {
                return res.status(404).send({ message: "Category not found with id " + req.params.id });
            }
            res.send(Category);
        }
        )
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: "Category not found with id " + req.params.id });
            }
            return res.status(500).send({ message: "Error while retrieving Category with id " + req.params.id });
        });
};

// Update a Category identified by the BrandId in the request
exports.update = (req, res) => {
    console.log("Updating Category "+ JSON.stringify(req.body));
    // Validate Request
   if(!req.body) {
       return res.status(400).send({
           message: "Category body can not be empty"
       });
   }
   if(!req.body.name) {
       return res.status(400).send({
           message: "Category name can not be empty"
       });
   }
   // Find Category and update it with the request body
   Category.findByIdAndUpdate(req.params.id, {
       name: req.body.name,
       slug: req.body.slug || req.body.name.split(" ").join("-").trim().toLowerCase()
   }, {new: true})
   .then(Category => {
       if(!Category) {
           return res.status(404).send({
               message: "Category not found with id " + req.params.id
           });
       }
       res.send(Category);
   }).catch(err => {
       if(err.kind === 'ObjectId') {
           return res.status(404).send({
               message: "Category not found with id " + req.params.id
           });                
       }
       return res.status(500).send({
           message: "Error updating Category with id " + req.params.id
       });
   });
};

// Delete a Category with the specified BrandId in the request
exports.delete = (req, res) => {
    Category.findByIdAndRemove(req.params.id)
    .then(Category => {
        if(!Category) {
            return res.status(404).send({
                message: "Category not found with id " + req.params.id
            });
        }
        res.send({message: "Category deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Category not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete Category with id " + req.params.id
        });
    });
};