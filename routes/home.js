/**
 * Created by eakporo on 8/16/17
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index.html', {
        title : 'Bank Accounts Network (Running on Hyperledger Fabric/Composer framework)',
        items : []
    });
});

module.exports = router;
