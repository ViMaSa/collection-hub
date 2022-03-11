// const User = require("../models/user")
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, unique: true, required: true, minlength: 2},
    password: {type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String, unique: true, required: true},
    collectionId: {type: Schema.Types.ObjectId, ref: 'Collection'}
}, {timestamps: true})

const User = mongoose.model('User', userSchema);

module.exports = User;