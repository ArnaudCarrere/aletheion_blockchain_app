
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index.html', {
        title : 'Aletheion blockchain (Running on Hyperledger Fabric/Composer framework)',
        items : []
    });
});

module.exports = router;
