const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {type: String},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true}
}, {timestamps: true})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;



