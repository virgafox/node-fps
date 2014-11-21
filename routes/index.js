var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'NodeFPS' });
});

router.get('/demo', function(req, res) {
  res.render('index', { title: 'NodeFPS' });
});

router.post('/demo', function(req, res) {
  res.render('demo', { 
	  title: 'NodeFPS - Demo',
	  nickname: req.param('nickname')
  });
});

module.exports = router;
