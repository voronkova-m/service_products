var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config/index');

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false});

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

require('./routes')(app);



/*app.get('/news/:id', function (req, res) {
    var obj = {title: "Новость", id: 5, paragraphs: ['Параграф', 'Обычный текст', 'Числа 1, 2, 3', 99]};
    console.log(req.query);
    res.render('news', {newsID: req.params.id, newParam: 234, obj: obj});
});
*/

app.use(function (err, req, res, next) {
    if (app.get('env') == 'development'){
        var errorHandler = express.errorHandler();
        errorHandler(err, req, res, next);
    }
    else {
        res.send(500);
    }
});

app.listen(config.get('port'));
