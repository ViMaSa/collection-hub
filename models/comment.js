const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true}
}, {timestamps: true})

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;



