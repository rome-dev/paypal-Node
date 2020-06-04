var express = require('express');
var router = express.Router();
var mainController = require('../controllers/main.controller')
var main = new mainController();
var bodyParser = require('body-parser');

router.use(bodyParser.json());
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Payment Page', result: {} });
});

router.get('/test', main.index);
router.post('/pay', main.oneTimePayment);
router.get('/success', main.success);
router.get('/subscription-success', main.subscriptionSuccess)


module.exports = router;
