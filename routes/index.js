var Product = require('../models/product').Product;
var bodyParser = require('body-parser');


module.exports = function (app) {
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

    app.get("/addProduct", function (req, res) {
        res.render('addProduct');
    });

    app.post('/addProduct', function (req, res) {
        var article = req.body.article;
        var type = req.body.type;
        var name = req.body.name;
        var trademark = req.body.trademark;
        console.log(article);
        var newProduct = new Product({article: article, type: type, name: name, trademark: trademark});
        console.log('ccccccccccccccccccccccccccc');
        newProduct.save(function (err) {
            if (err) {
                res.render('error', {message: err.message});
                console.log(err.message);
                return;
            }
            console.log(newProduct);
            res.send(new Product);
        });
    });
};