const Comment = require("../models/comment");
const Collection = require("../models/collection");
const User = require('../models/user');
const express = require('express');
const router = express.Router();



// // CREATE - POST ROUTE
// router.post('/:id/comments', async (req, res) => {
//     // const collection = await Collection.findById(req.params.id)

//     // store data submitted in the request body to a variable
//    let commentData = req.body
//    console.log(commentData);
//     // set the current users ID and make it equal to the sessions ID
//     commentData.userId = req.session.userId
//     // set a new variable and CREATE a new object from collectionData above 
//     const newComment = await Comment.create(commentData)
//     res.redirect(`/collections/${req.params.id}`)
// });


// CREATE Comment
router.post('/:id/comments', (req, res) => {

    // INSTANTIATE INSTANCE OF MODEL
    const comment = new Comment(req.body);
    comment.userId = req.session.userId
    console.log(comment.content);
    console.log(comment);

    // Collection
    // .findById(req.params.id).lean().populate('comments')
    // .then((collection) => res.render('/collections/show.ejs', { collection }))

    // SAVE INSTANCE OF Comment MODEL TO DB
    comment
      .save()
      .then(() =>  Collection.findById(req.params.id))
      .then((collection) => {
        collection.comments.unshift(comment);
        return collection.save();
      })
      .then(() => res.redirect('/'))
      .catch((err) => {
        console.log(err);
      });
  });
module.exports = router;

