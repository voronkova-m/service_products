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
            //res.json(products);
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

    app.get('/products/:id', function (req, res, next) {
        Product.findById(req.params.id, function (err, product) {
            if (product == undefined) {
                res.render('error', {message: "Продукта с таким id нет"});
            } else {
                res.render('product', {products: product, typeSearch: "_id", search: req.params.id})
            }
            res.json(product);
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
            var typeSearch = [];
            var search = [];
            j = 0;
            if (article != undefined) {
                typeSearch[j] = 'article';
                search[j] = article;
                j++;
            }
            if (type != undefined) {
                typeSearch[j] = 'type';
                search[j] = type;
                j++;
            }
            if (name != undefined) {
                typeSearch[j] = 'name';
                search[j] = name;
                j++;
            }
            if (trademark != undefined) {
                typeSearch[j] = 'trademark';
                search[j] = trademark;
                j++;
            }
            //res.render('product', {products: filtrProducts, typesSearch: typeSearch, searches: search});
            res.send(filtrProducts);
            return filtrProducts;
        });
    });

    app.get("/add_product", function (req, res) {
        res.render('addProduct');
    });

    app.post('/addProduct', function (req, res) {
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
            //res.render('product', {products: filtrProducts, typesSearch: typeSearch, searches: search});
            res.send(filtrProducts);
            return filtrProducts;
        });
    });

};