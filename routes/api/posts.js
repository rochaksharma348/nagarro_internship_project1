const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Post = require('../../models/post');
const isLoggedIn = require('../../middleware');

router.get("/api/post", isLoggedIn, async (req, res) => {
    const filter = req.query;
  
    const results = await Post.find(filter).populate("postedBy").populate("replyTo");
  
    let posts = await User.populate(results, { path: "replyTo.postedBy" });
  
    res.json(posts);
  });
  
  router.get("/api/posts/:id", async (req, res) => {
    const post = await Post.findById(req.params.id).populate("postedBy");
  
    res.status(200).json(post);
  });
// router.get('/api/post', isLoggedIn, async (req, res) => {
//     const post = await Post.find({}).populate('postedBy').populate('replyTo');
//     res.json(post);
// });

// router.get('/api/post/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     const user = await User.findById(userId);
//     const post = await Post.find({postedBy : user}).populate('postedBy');
//     res.json(post);
// });

// like button functionality
router.patch('/api/post/:postId/like', isLoggedIn, async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;

    const isLiked = req.user.likes && req.user.likes.includes(postId);

    const option = isLiked ? '$pull' : '$addToSet';

    req.user = await User.findByIdAndUpdate(userId, {[option]:{likes:postId}}, {new:true});
    const post = await Post.findByIdAndUpdate(postId, {[option]:{likes:userId}}, {new:true});

    res.json(post);

});

router.post('/api/post', async (req, res) => {
    console.log(req.body);
    console.log(req.user);
    let post = {
        content: req.body.content,
        postedBy: req.user
    }

    if (req.body.replyTo) {
        post = {
            ...post,
            replyTo : req.body.replyTo
        }
    }

    const newPost = await Post.create(post);
    res.json(newPost);
})

module.exports = router;