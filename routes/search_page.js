var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
var connInfo = require('./db/db_login_info').dev; //개발자에 관한 정보라는것. dev로 정의해놔서.이름은 바꿔도됨.db_login_info를 통해 내가 만든 db의 정보를 가져오는것.

//mysql setting//
var conn = mysql.createPool(connInfo);

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('search_page');
});

module.exports = router;
