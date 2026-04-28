const express = require('express');
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost
} = require('../controllers/postController');
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Nested routes for comments
router.route('/:postId/comments')
    .get(getComments)
    .post(protect, addComment);

router.route('/')
    .get(getPosts)
    .post(protect, createPost);

router.route('/:id')
    .get(getPost)
    .patch(protect, updatePost)
    .delete(protect, deletePost);

router.put('/:id/like', protect, likePost);

module.exports = router;
// Original commented code preserved:
// const postController = require("../controllers/postController");
// router.get("/", postController.getPostList);
// router.post("/", postController.addNewPost);
// router.put("/:id", postController.sendPostById);
