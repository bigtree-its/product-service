module.exports = (app) => {
    const categories = require('../controller/category');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    // Retrieve all categories
    app.get('/categories', categories.findAll);

    // Retrieve a single category with Id
    app.get('/categories/:id', categories.findOne);

    // Create a new Category
    app.post('/categories',
        // verifyToken,
        [
            check('name').notEmpty().isLength({ min: 2, max: 40 }),
            check('parent').optional().isMongoId().withMessage('Parent Category ID is not valid'),
            check('department').optional().isMongoId().withMessage('Department ID is not valid')
        ],
        categories.create);

    // Update a category with id
    app.put('/categories/:id',
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 2, max: 20 }),
            check('parent').optional().isMongoId().withMessage('Parent Category ID is not valid'),
            check('department').optional().isMongoId().withMessage('Department ID is not valid')
        ],
        categories.update);

    // Delete a category with id
    app.delete('/categories/:id',
        // verifyToken,
        categories.delete);

    app.delete('/categories', categories.deleteAll);
}