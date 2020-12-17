const express = require('express');
let router = express.Router();
const urlController = require('../../controllers/url');

router.use('/', urlController);

module.exports = router;