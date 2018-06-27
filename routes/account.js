
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    console.log("account: "+req.query);
    res.render('account.html', {account: req.query});
});

module.exports = router;
