module.exports = (app) => {
    const reviews = require('../controller/review.js');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    const path = process.env.CONTEXT_PATH + "/reviews";

    // Public routes
    // Retrieve all Review
    app.get(path, reviews.findAll);

    // Retrieve a single Review with Id
    app.get(path + '/:id', reviews.findOne);

    // Private routes
    // Creates a new Review
    app.post(path,
        // verifyToken, 
        [
            check('userEmail').exists().withMessage('User is mandatory'),
            check('headline').exists().withMessage('Headline is mandatory '),
            check('product').exists().isMongoId().withMessage('Product is not valid')
        ],
        reviews.create);

    // Update a Review with id
    app.put(path + '/:id', reviews.update);

    // Delete a Review with id
    app.delete(path + '/:id', reviews.delete);

    //Delete All -- only for non production and can only be done by an admin
    app.delete(path, reviews.deleteAll);
}