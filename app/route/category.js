module.exports = (app) => {
    const collection = require('../controller/category');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    const path = process.env.CONTEXT_PATH + "/categories";

    // Retrieve all categories
    app.get(path, collection.findAll);

    // Retrieve a single category with Id
    app.get(path +'/:id', collection.findOne);

    // Create a new Category
    app.post(path,
        // verifyToken,
        [
            check('name').notEmpty().isLength({ min: 2, max: 40 }),
            check('parent').optional().isUUID().withMessage('Parent Category ID is not valid'),
            check('department').optional().isUUID().withMessage('Department ID is not valid')
        ],
        collection.create);

    // Update a category with id
    app.put(path +'/:id',
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 2, max: 20 }),
            check('parent').optional().isUUID().withMessage('Parent Category ID is not valid'),
            check('department').optional().isUUID().withMessage('Department ID is not valid')
        ],
        collection.update);

    // Delete a category with id
    app.delete(path +'/:id',
        // verifyToken,
        collection.delete);

    //Delete All 
    app.delete(path, collection.deleteEverything);
}