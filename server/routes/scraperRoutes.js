var express = require('express');
var router = express.Router();
var scraperController = require('../controllers/scraperController.js');

router.get('/scrapeStart', scraperController.scrapeStartCallback);
router.get('/scrapeStop', scraperController.scrapeStopCallback);
router.get('/scrapeQuit', scraperController.scrapeQuitCallback);
router.get('/scrapeSetQuery', scraperController.scrapeSetQuery);

module.exports = router;