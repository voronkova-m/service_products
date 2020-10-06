var Product = require('../models/product').Product;
var errorhandler = require('errorhandler');
const request = require('request');


module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/products', function (req, res, next) {
        Product.find({}, function (err, products) {
            if (err) return next(err);
            res.render('allProducts', {products: products});
        });
    });

    app.get('/get_products', function (req, res, next) {
        Product.find({}, function (err, products) {
            if (err) return next(err);
            res.send(products);
            return products;
        });
    });

    app.get('/product/:id', function (req, res, next) {
        Product.findById(req.params.id, function (err, product) {
            if (product == undefined) {
                res.render('error', {message: "Продукта с таким id нет"});
            } else {
                res.json(product);
            }
        });
    });

    app.get('/search', function (req, res) {
        var article = req.query.article;
        var type = req.query.type;
        var name = req.query.name;
        var trademark = req.query.trademark;
        request('http://127.0.0.1:3000/get_products', function (err, res2, body) {
            if (err) {
                app.use(errorhandler());
                return;
            }
            var products = body;
            products = JSON.parse(products);
            var filtrProducts = [];
            var j = 0;
            products.forEach(function (product) {
                if (((product.article === article) || (article === undefined)) &&
                    ((product.type === type) || (type === undefined)) &&
                    ((product.name === name) || (name === undefined)) &&
                    ((product.trademark === trademark) || (trademark === undefined))) {
                    filtrProducts[j] = product;
                    j++;
                }
            });
            res.send(filtrProducts);
            return filtrProducts;
        });
    });

    app.get('/add_product', function (req, res) {
        res.render('addProduct');
    });

    app.post('/add_product', function (req, res) {
        var article = req.body.article;
        var type = req.body.type;
        var name = req.body.name;
        var trademark = req.body.trademark;
        console.log(article);
        var newProduct = new Product({article: article, type: type, name: name, trademark: trademark});
        newProduct.save(function (err) {
            if (err) {
                res.render('error', {message: err.message});
                console.log(err.message);
                return;
            }
            res.redirect("http://127.0.0.1:3000/products")
        });
    });

    app.get('/edit_product/:id', function (req, res) {
        request('http://127.0.0.1:3000/product/' + req.params.id, function (err, res2, body) {
            if (err) {
                res2.render('error', {message: err.message});
                console.log(err.message);
                return;
            }
            var product = body;
            product = JSON.parse(product);
            res.render('editProduct', {product: product});
        });
    });

    app.post('/edit_product/:id', function (req, res) {
        var article = req.body.article;
        var type = req.body.type;
        var name = req.body.name;
        var trademark = req.body.trademark;
        Product.updateOne({_id: req.params.id}, {
            $set: {
                article: article,
                type: type,
                name: name,
                trademark: trademark
            }
        }, function (err) {
            if (err) {
                res.render('error', {message: err.message});
                console.log(err.message);
                return;
            }
            res.redirect("http://127.0.0.1:3000/products")
        });
    });

    app.post('/delete_product/:id', function (req, res) {
        Product.remove({_id: req.params.id}, function (err) {
            if (err) {
                res.render('error', {message: err.message});
                console.log(err.message);
                return;
            }
            res.redirect("http://127.0.0.1:3000/products")
        });
    });
};