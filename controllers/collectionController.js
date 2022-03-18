const Collection = require("../models/collection");
const User = require('../models/user');
const Comment = require('../models/comment');
const express = require('express');
const router = express.Router();

const multer = require('multer')
const upload = multer({ dest: '/collection-hub/uploads'})
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
    const user = await User.findById(collection.userId)
    res.render('collections/show.ejs', {
        collection: collection,
        user: user
    })
})

// CREATE
router.post('/', upload.single('myFile'), async (req, res) => {
    console.log(req.file)
    try{
        req.body.userId = req.session.userId.toString();
        // cloudinary.uploader.upload(req.file.path, (result) => {
        //     console.log('this is the img result\n', result)
        //     req.body.img = result.url;
        // })
        const newCollection = await Collection.create(req.body)
        console.log(newCollection)
        res.redirect(`collections/${newCollection._id}`)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})



// EDIT
router.get('/:id/edit', async (req, res) => {
    try {
        const collection = await Collection.find({userid: req.params.id})
        console.log(collection)
        res.render('collections/edit.ejs', {
            collection: collection
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
        res.redirect('/collections')
    } catch (err) {
        res.sendStatus(500)
    }
})

module.exports = router;