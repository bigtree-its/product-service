module.exports = (app) => {
    const categories = require('../controller/category');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    const path = process.env.CONTEXT_PATH + "/categories";

    // Retrieve all categories
    app.get(path, categories.findAll);

    // Retrieve a single category with Id
    app.get(path +'/:id', categories.findOne);

    // Create a new Category
    app.post(path,
        // verifyToken,
        [
            check('name').notEmpty().isLength({ min: 2, max: 40 }),
            check('parent').optional().isMongoId().withMessage('Parent Category ID is not valid'),
            check('department').optional().isMongoId().withMessage('Department ID is not valid')
        ],
        categories.create);

    // Update a category with id
    app.put(path +'/:id',
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 2, max: 20 }),
            check('parent').optional().isMongoId().withMessage('Parent Category ID is not valid'),
            check('department').optional().isMongoId().withMessage('Department ID is not valid')
        ],
        categories.update);

    // Delete a category with id
    app.delete(path +'/:id',
        // verifyToken,
        categories.delete);

    app.delete(path, categories.deleteAll);
}