const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'name');
        res.status(200).json({ success: true, count: comments.length, data: comments });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        req.body.post = req.params.postId;
        req.body.author = req.user.id;

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const comment = await Comment.create(req.body);

        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'User not authorized to delete this comment' });
        }

        await comment.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
