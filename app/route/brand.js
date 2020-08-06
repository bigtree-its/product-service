module.exports = (app) => {
    const brands = require('../controller/brand');
    const { verifyToken } = require('../security/security');
    const { check } = require('express-validator');

    // Retrieve all brand
    app.get('/brands', brands.findAll);

    // Retrieve a single brand with Id
    app.get('/brands/:id', brands.findOne);

    // Create a new brand
    app.post('/brands',
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 2, max: 20 })
        ],
        brands.create);

    // Update a brand with id
    app.put('/brands/:id',
        // verifyToken, 
        [
            check('name').notEmpty().isLength({ min: 2, max: 20 })
        ],
        brands.update);

    // Delete a brand with id
    app.delete('/brands/:id',
        // verifyToken,
        brands.delete);
}