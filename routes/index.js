let Product = require('../models/product').Product;
const request = require('request');
const passport = require('passport');

let auth = passport.authenticate('jwt', {
    session: false
});

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/products', auth, function (req, res, next) {
        Product.find({}, function (err, products) {
            if (err){
                res.render('error', {message: err.message});
                return;
            }
            res.render('allProducts', {products: products});
        });
    });

    app.get('/get-products', auth, function (req, res, next) {
        Product.find({}, function (err, products) {
            if (err){
                res.render('error', {message: err.message});
                return;
            }
            res.send(products);
            return products;
        });
    });

    
    app.get('/get-list-products', auth, function (req, res) {
        var array = req.body["arr"];
        Product.find({_id: array}, function (err, products) {
            if (products == undefined) {
                res.send(err.message);
            } else {
                res.send(products);
            }
        });
    });

    app.get('/get-list-products-arr', auth, function (req, res) {
        var array = req.body["arr"];
        Product.find({$or: [{name: array}, {type: array}, {trademark: array}]}, function (err, products) {
            if (products == undefined) {
                res.send(err.message);
            } else {
                res.send(products);
            }
        });
    });

    app.get('/product/:id', auth, function (req, res) {
        Product.findById(req.params.id, function (err, product) {
            if (product == undefined) {
                res.render('error', {message: "Продукта с таким id нет"});
            } else {
                res.json(product);
            }
        });
    });

    app.get('/search', auth, function (req, res) {
        let article = req.query.article;
        let type = req.query.type;
        let name = req.query.name;
        let trademark = req.query.trademark;
        const url = {
            uri: 'http://127.0.0.1:3000/get-products',
            method: 'GET',
            headers: {'Authorization': req.headers.Authorization}
        };
        request(url, function (err, res2, body) {
            if (err) {
                res.render('error', {message: err.message});
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

    app.get('/add-product', auth, function (req, res) {
        res.render('addProduct');
    });

    app.post('/add-product', auth, function (req, res) {
        var article = req.body.article;
        var type = req.body.type;
        var name = req.body.name;
        var trademark = req.body.trademark;
        var newProduct = new Product({article: article, type: type, name: name, trademark: trademark});
        newProduct.save(function (err) {
            if (err) {
                res.render('error', {message: err.message});
                return;
            }
            res.redirect("http://127.0.0.1:3000/products")
        });
    });

    app.post('/add-product-storage', auth, function (req, res) {
        var article = req.body.article;
        var type = req.body.type;
        var name = req.body.name;
        var trademark = req.body.trademark;
        var newProduct = new Product({article: article, type: type, name: name, trademark: trademark});
        newProduct.save(function (err, product) {
            if (err) {
                res.render('error', {message: err.message});
                return;
            }
            res.send(product)
        });
    });

    app.get('/edit-product/:id', auth, function (req, res) {
        request('http://127.0.0.1:3000/product/' + req.params.id, req.headers.Authorization, function (err, res2, body) {
            if (err) {
                res2.render('error', {message: err.message});
                return;
            }
            var product = body;
            product = JSON.parse(product);
            res.render('editProduct', {product: product});
        });
    });

    app.post('/edit-product/:id', auth, function (req, res) {
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
                return;
            }
            res.redirect("http://127.0.0.1:3000/products")
        });
    });

    app.post('/delete-product/:id', auth, function (req, res) {
        Product.remove({_id: req.params.id}, function (err) {
            if (err) {
                res.render('error', {message: err.message});
                return;
            }
            res.redirect("http://127.0.0.1:3000/products")
        });
    });
};