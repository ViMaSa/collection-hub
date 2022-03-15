const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    profilephoto: {type: String, unique: true, required: true, minlength: 2},
    description: {type: String}
}, {timestamps: true})

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;