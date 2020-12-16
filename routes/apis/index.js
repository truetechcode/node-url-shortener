const express = require('express');
let router = express.Router();
const urlController = require('../../controllers/short_url');

router.use('/', urlController);

module.exports = router;