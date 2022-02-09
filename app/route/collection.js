module.exports = (app) => {
    const collection = require('../controller/collection');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    const path = process.env.CONTEXT_PATH + '/collections';

    // Retrieve all collection
    app.get(path, collection.findAll); 

    // Retrieve a single collection with Id
    app.get(path + '/:id', collection.findOne);

    // Create a new collection
    app.post(path,
        // verifyToken, 
        [
            check('name').notEmpty().withMessage('Name is mandatory'),
            check('image').notEmpty().withMessage('Image is mandatory')
        ],
        collection.create);

    // Update a collection with id
    app.put(path + '/:id',
        // verifyToken, 
        [
            // check('name').exists().withMessage('Name is not valid')
        ],
        collection.update);

    // Delete a collection with id
    app.delete(path + '/:id',
        // verifyToken,
        collection.delete);

    //Delete All 
    app.delete(path, collection.deleteEverything);
}