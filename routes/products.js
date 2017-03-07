var express = require('express');
var router = express.Router();

var storeAuth = require('../middleware/storeAuth');
var Products = require('../models/Products');
var Comments = require('../models/Comments');

/** Products list */
router.get('/', function(req, res, next) {
  Products.find()
    .populate('author')
    .exec(function (err, data) {
      if (err) return console.log(err);

      res.render('products', { title: 'Catalog', products: data, user: req.user });
    })
});

/** Process product form */
router.post('/', storeAuth.isLoggedIn, function(req, res, next) {
  Products.create(new Products({ 
    name: req.body.name, 
    description: req.body.description, 
    price: req.body.price,
    author: req.user._id,
    comments: []
  }
  )).then(function(product) {
      res.redirect('/products');
  }, function(err) {
      console.log('Error: Inserting adding product: ' + req.body.name  + ': ', err);
  })
});

/** Delete product */
router.delete('/:id', storeAuth.isLoggedIn, storeAuth.isProductOwner, function(req, res, next) {
  Products.findOne({ _id: req.params.id }, function(err, data) {
    // Cascade delete all related comments
    var commentIds = data.comments.map(function(elem) { return String(elem) });
    Comments.remove({ _id: { $in: commentIds } }, function(err) {
      if (err) return console.log("Error: While deleting product comments " + err.message);
      
      // Delete product
      Products.findByIdAndRemove(req.params.id, function(err, data) {
        if (err) return console.log("Error: While deleting product" + err.message);

        res.sendStatus(200);
      })
    })
  })
});

/** New product form  */
router.get('/new', storeAuth.isLoggedIn, function(req, res, next) {
  res.render('new', { title: 'Add product', user: req.user });
});

/** Product edit form  */
router.get('/:id/edit', storeAuth.isLoggedIn, storeAuth.isProductOwner, function(req, res, next) {
  res.render('edit', { title: 'Edit product', product: req.product, user: req.user });
});

/** Get a product  */
router.get('/:id', function(req, res, next) {
  Products.findOne({ _id: req.params.id })
    .populate('author') // Populate product author
    .populate({ // Populate comments and comments' authors
      path: 'comments',
      model: 'Comments',
      populate: {
        path: 'author',
        model: 'Users'
      }
    })
    .exec(function (err, data) {
      if (err) return console.log(err);
      res.render('product', { title: 'A product', product: data, user: req.user });
    })
});

/** Edit a product */
router.put('/:id', storeAuth.isLoggedIn, storeAuth.isProductOwner, function(req, res, next) {
  Products.findByIdAndUpdate(req.params.id, { name: req.body.name, description: req.body.description, price: req.body.price }, {},function(err) {
      if (err) return;
      res.redirect('/products/' + req.params.id);
  });
});

module.exports = router;
