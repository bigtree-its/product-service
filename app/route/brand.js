module.exports = (app) => {
    const collection = require('../controller/brand');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    const path = process.env.CONTEXT_PATH + '/brands';

    // Retrieve all brand
    app.get(path, collection.findAll);

    // Retrieve a single brand with Id
    app.get(path + '/:id', collection.findOne);

    // Create a new brand
    app.post(path,
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 2, max: 20 })
        ],
        collection.create);

    // Update a brand with id
    app.put(path + '/:id',
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 2, max: 20 })
        ],
        collection.update);

    // Delete a brand with id
    app.delete(path + '/:id',
        // verifyToken,
        collection.delete);

    //Delete All 
    app.delete(path, collection.deleteEverything);
}