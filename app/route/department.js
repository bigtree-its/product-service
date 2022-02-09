module.exports = (app) => {
    const collection = require('../controller/department');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    const path = process.env.CONTEXT_PATH + "/departments";

    // Retrieve all departments
    app.get(path, collection.findAll);

    // Retrieve a single category with Id
    app.get(path + '/:id', collection.findOne);

    // Create a new Category
    app.post(path,
        // verifyToken,
        [
            check('name').notEmpty().isLength({ min: 2, max: 30 })
        ],
        collection.create);

    // Update a category with id
    app.put(path + '/:id',
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 2, max: 30 })
        ],
        collection.update);

    // Delete a category with id
    app.delete(path + '/:id',
        // verifyToken,
        collection.delete);

    //Delete All 
    app.delete(path, collection.deleteEverything);
}