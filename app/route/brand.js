module.exports = (app) => {
    const brands = require('../controller/brand');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    const path = process.env.CONTEXT_PATH + '/brands';

    // Retrieve all brand
    app.get(path, brands.findAll);

    // Retrieve a single brand with Id
    app.get(path + '/:id', brands.findOne);

    // Create a new brand
    app.post(path,
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 2, max: 20 })
        ],
        brands.create);

    // Update a brand with id
    app.put(path + '/:id',
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 2, max: 20 })
        ],
        brands.update);

    // Delete a brand with id
    app.delete(path + '/:id',
        // verifyToken,
        brands.delete);
}