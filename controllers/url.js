const express = require('express');
const urlService = require('../services/url');

let router = express.Router();

router.get('/:shortcode', urlService.redirectToLongUrl);

router.get('/:shortcode/stats', urlService.getShortCodeStats);

router.post('/', urlService.createShortUrl);

module.exports = { router, urlController: urlService };