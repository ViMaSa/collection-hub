const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    name: {type: String, required: true},
    category: {type: Number, required: true},
    description: {type: String},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true}
}, {timestamps: true})

const Collection = mongoose.model('collection', collectionSchema);

module.exports = Collection;

