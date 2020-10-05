var express = require('express');
var config = require('./config/index');

var app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

require('./routes')(app);


app.listen(config.get('port'));
