const mongoose = require('mongoose');
var config = require('../config');

//mongoose.connect(config.get('mongoose: uri'), config.get('mongoose: options'));
mongoose.connect("mongodb://localhost:27017/dbProducts", {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = mongoose;

