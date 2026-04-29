const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
    try {
        const { search } = req.query;
        let posts;

        if (search) {
            posts = await Post.find({
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } }
                ]
            }).populate('author', 'name');
        } else {
            posts = await Post.find().populate('author', 'name').sort('-createdAt');
        }

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name');
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        req.body.author = req.user.id;
        const post = await Post.create(req.body);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'User not authorized to update this post' });
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'User not authorized to delete this post' });
        }

        await post.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        let alreadyLikedIndex = -1;
        for (let i = 0; i < post.likes.length; i++) {
            if (post.likes[i].toString() === req.user.id) {
                alreadyLikedIndex = i;
                break;
            }
        }

        if (alreadyLikedIndex !== -1) {
            post.likes.splice(alreadyLikedIndex, 1);
        } else {
            post.likes.unshift(req.user.id);
        }

        await post.save();

        res.status(200).json({ success: true, data: post.likes });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
