const Collection = require("../models/collection");
const express = require('express');
const router = express.Router();

// INDEX //
router.get('/', async (req, res)=>{
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
    const collection = await Collection.findById(req.params.id).populate('user')
    res.render('collections/show.ejs', {
        collection: collection
    })
})
// CREATE
router.post('/', async (req, res) => {
    req.body.user = req.session.userId
    const newCollection = await Collection.create(req.body)
    console.log(newCollection)
    res.redirect('/collections')
})
// EDIT
router.get('/:id/edit', async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id)
        res.render('collections/edit.ejs', {
            collection: collection
        })
    } catch(err) {
            res.sendStatus(500)     
    }
})
// UPDATE
router.put('/:id', async (req, res) => {
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