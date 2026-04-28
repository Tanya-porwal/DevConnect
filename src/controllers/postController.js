const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
    try {
        const { search } = req.query;
        let posts;

        if (search) {
            // Simple search with regex
            posts = await Post.find({
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } }
                ]
            }).populate('author', 'name');
        } else {
            // Just get all posts
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

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
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

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
    try {
        req.body.author = req.user.id;
        const post = await Post.create(req.body);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update post
// @route   PATCH /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check ownership
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

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check ownership
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'User not authorized to delete this post' });
        }

        await post.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if the post has already been liked by this user
        const alreadyLiked = post.likes.find(like => like.toString() === req.user.id);

        if (alreadyLiked) {
            // Unlike
            post.likes = post.likes.filter(like => like.toString() !== req.user.id);
        } else {
            // Like
            post.likes.unshift(req.user.id);
        }

        await post.save();

        res.status(200).json({ success: true, data: post.likes });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
