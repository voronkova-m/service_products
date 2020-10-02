var Product = require('../models/product').Product;

module.exports = function(app) {
    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/products', function (req, res, next) {
        Product.find({}, function (err, products) {
            if (err) return next(err);
            //res.json(products);
            res.render('allProducts', {products: products});
        });
    });

    app.get('/products/:article', function (req, res, next) {
        Product.find({article: req.params.article}, function (err, product) {
            if (err) return next(err);
            if (!product) {
                next(new HttpError(404, "Product not found"));
            }
            res.json(product);
        });
    });

};