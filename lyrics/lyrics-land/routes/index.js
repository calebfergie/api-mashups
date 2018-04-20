var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('index');
});

/* GET analyzer page page. */
router.get('/analyzer', function(req, res, next) {
  res.render('corpus');
});

module.exports = router;
