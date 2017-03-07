var Products = require('../models/Products');
var Comments = require('../models/Comments');

var storeAuth = {
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // puede pasar
    }
    return res.redirect('/login');
  },

  isProductOwner: function(req, res, next) {
    // Check product author == logged in user
    Products.findById(req.params.id, function (err, data) {
    if (err) return;

    if (String(req.user._id) == String(data.author)) {
        req.product = data;
        return next(); // puede pasar
      }  else
          res.send("Usuario no autorizado.");
    });
  },

  isCommentOwner: function(req, res, next) {
    // Check product author == logged in user
    Comments.findById(req.params.cid, function (err, data) {
      if (err) return;
        
      if (String(req.user._id) == String(data.author)) {
        req.comment = data;
        return next(); // puede pasar
      } else
          res.send("Usuario no autorizado.");
    })
  }
}

module.exports = storeAuth;