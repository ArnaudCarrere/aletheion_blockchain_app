
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    console.log("company: "+req.query);
    res.render('company.html', {company: req.query});
});

module.exports = router;
