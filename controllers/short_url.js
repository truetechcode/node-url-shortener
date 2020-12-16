const express = require('express');
const urlService = require('../services/short_url');

let router = express.Router();

// router.get('/:shortcode', urlService.getUserById);

// router.get('/:shortcode/stats', urlService.getUserById);

router.post('/', urlService.createShortUrl);

module.exports = router;