module.exports = (app) => {
    const departments = require('../controller/department');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    const path = process.env.CONTEXT_PATH + "/departments";

    // Retrieve all departments
    app.get(path, departments.findAll);

    // Retrieve a single category with Id
    app.get(path + '/:id', departments.findOne);

    // Create a new Category
    app.post(path,
        // verifyToken,
        [
            check('name').notEmpty().isLength({ min: 2, max: 30 })
        ],
        departments.create);

    // Update a category with id
    app.put(path + '/:id',
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 2, max: 30 })
        ],
        departments.update);

    // Delete a category with id
    app.delete(path + '/:id',
        // verifyToken,
        departments.delete);

    app.delete(path, departments.deleteAll);
}