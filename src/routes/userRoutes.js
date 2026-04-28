const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/profile')
    .get(protect, getProfile)
    .patch(protect, updateProfile);

module.exports = router;
