module.exports = (app) => {
    const reviews = require('../controller/review.js');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    // Public routes
    // Retrieve all Review
    app.get('/reviews', reviews.findAll);

    // Retrieve a single Review with Id
    app.get('/reviews/:id', reviews.findOne);

    // Private routes
    // Creates a new Review
    app.post('/reviews',
        // verifyToken, 
        [
            check('userEmail').exists().withMessage('User is mandatory'),
            check('title').exists().withMessage('Title is mandatory '),
            check('product').exists().isMongoId().withMessage('Product is not valid')
        ],
        reviews.create);

    // Update a Review with id
    app.put('/reviews/:id', reviews.update);

    // Delete a Review with id
    app.delete('/reviews/:id', reviews.delete);

    //Delete All -- only for non production and can only be done by an admin
    app.delete('/reviews', reviews.deleteAll);
}