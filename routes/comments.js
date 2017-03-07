var express = require('express');
var router = express.Router({mergeParams: true}); // Needed to have parent rout parameters available (product id)

var storeAuth = require('../middleware/storeAuth');
var Products = require('../models/Products');
var Comments = require('../models/Comments');

/** Post comment  */
router.post('/', storeAuth.isLoggedIn, function(req, res, next) {
    // Create comment
    var newComment = new Comments({ 
        body: req.body.body, 
        author: req.user._id,
    });

    Comments.create(newComment).then(function(comment) {
        // Push new comment to product comments array
        Products.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } }, { new: true }, function(err) {
            if (err) return;
            res.json({user: req.user, product: { _id: req.params.id}, comment: newComment});
        });
    }, function(err) {
        console.log('Error: Posting comment: ' + req.body.body  + ': ', err);
    })
});
/** Remove comment  */
router.delete('/:cid', storeAuth.isLoggedIn, storeAuth.isCommentOwner, function(req, res, next) {
    Comments.findByIdAndRemove(req.params.cid, function(err, data) {
        if (err) return;
        // Push new comment to product comments array
        Products.findByIdAndUpdate(req.params.id, { $pull: { comments: String(req.comment._id) } }, { safe: true }, function(err) {
            if (err) return;
            res.sendStatus(200);
        });
    });
});
/** Edit comment  */
router.put('/:cid', storeAuth.isLoggedIn, storeAuth.isCommentOwner, function(req, res, next) {
    Comments.findByIdAndUpdate(req.params.cid, { $set: { body: req.body.body } }, { new: true }, function(err, data) {
        if (err) return;
        res.json({ comment: data });
    });
});

module.exports = router;
