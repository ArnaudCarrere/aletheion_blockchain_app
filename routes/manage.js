
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    console.log("account: "+req.query);
    res.render('manage.html', {account: req.query, company:req.query.company});
});

module.exports = router;
