const Collection = require("../models/collection");
const Comment = require("../models/comment");
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const { collection } = require("../models/collection");
const upload = multer({ dest: '/tmp/uploads'})
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// INDEX //
router.get('/showall', async (req, res)=>{
    if(!req.session.visits){
        req.session.visits = 1;
    }else{
        req.session.visits += 1
    }
    const collections = await Collection.find();
    // Demo that res.locals is the same as the object passed to render
    res.locals.visits = req.session.visits;
    res.locals.collections = collections;
    res.render('collections/index.ejs');
})
// NEW
router.get('/new', (req, res)=> {
    res.render('collections/new.ejs')
})
// SHOW
router.get('/:id', async (req, res) => {
    const collection = await Collection.findById(req.params.id)
    console.log(collection)
    const user = await User.findById(collection.userId)
    const comment = await Comment.findById(collection.comments)
    res.render('collections/show.ejs', {
        collection: collection,
        user: user,
        comment: comment
    })
})

// CREATE
router.post('/', upload.single('img'), async (req, res) => {
    let collectionData = req.body
    console.log(collectionData)
    const imgUpload = await cloudinary.uploader.upload(req.file.path, res => {
        console.log("This is the request\n", req.file.path)
    })
    collectionData.img = imgUpload.url
    collectionData.userId = req.session.userId
    console.log(collectionData)
    const newCollection = await Collection.create(collectionData)
    console.log(newCollection)
    res.redirect(`collections/${newCollection._id}`)
})


// EDIT
router.get('/:id/edit', async (req, res) => {
    try {
        const collection = await Collection.find({userid: req.params.id})
        console.log(collection)
        res.render('collections/edit.ejs', {
            collection: collection,
        })
    } catch(err) {
            res.sendStatus(500)     
    }
})
// UPDATE
router.put('/:id', async (req, res) => {
    console.log("hello")
    try {
        await Collection.findByIdAndUpdate(req.params.id, req.body)
        res.redirect(`/collections/${req.params.id}`)
    } catch (err) {
        res.sendStatus(500)
    }
})
// DELETE
router.delete('/:id', async (req, res) => {
    try{
        await Collection.findByIdAndDelete(req.params.id)
        res.redirect('/collections/showall')
    } catch (err) {
        res.sendStatus(500)
    }
})

module.exports = router;