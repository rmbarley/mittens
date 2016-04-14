var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

var Post = mongoose.model("Post");

router.use(function(req, res, next) {

  if (req.method === "GET") {
    // Let all users see posts
    return next();
  }

  if (!req.isAuthenticated()) {
    // User not authenticated, redirect to login
    return res.redirect("#/login");
  }

  return next();
});

router.route("/posts")
  // Return all posts
  .get(function(req, res) {
    Post.find(function(err, data) {
      if (err) {
        return res.send(500, err);
      }
      return res.send(data);
    });
  })
  // Create new post
  .post(function(req, res) {
    var post = new Post();
    post.text = req.body.text;
    post.username = req.body.created_by;
    post.save(function(err, post) {
      if (err) {
        return res.send(500, err);
      }
      return res.json(post);
    });
  });

router.route("/posts/:id")
  // Return particular post
  .get(function(req, res) {
    Post.findById(req.params.id, function(err, post) {
    	if(err) {
    		return res.send(err);
    	}
    	return res.json(post);
    });
  })
  // Updates existing post
  .put(function(req, res) {
    Post.findById(req.params.id, function(err, post) {
    	if(err) {
    		return res.send(err);
    	}
    	post.username = req.body.username;
    	post.text = req.body.text;
    	post.save(function(err, post) {
    		if(err) {
    			return res.send(err);
    		}
    		return res.json(post);
    	});
    });
  })
  // Deletes a post
  .delete(function(req, res) {
  	Post.remove({
  		_id: req.params.id
  	}, function(err) {
  		if(err) {
  			return res.send(err);
  		}
  		return res.json("deleted");
  	});
  });

module.exports = router;
