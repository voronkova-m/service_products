var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    article: {
        type: String,
        unique: true,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    trademark: {
        type: String,
    },
    name: {
        type: String,
        required: true
    }
});

exports.Product = mongoose.model('Product', schema);