const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const connInfo = require('./db/db_login_info').dev;
//mysql setting//
const conn = mysql.createPool(connInfo);


router.get('/', function(req, res, next) {
  res.render('test');
});

router.post('/userphoto',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	//추가
	//const {id} = JSON.parse(localStorage.getItem("user-info"));
	//localStorage.remove("user-info");
	//console.log(id); // 아이디 이름 비밀번호
	
	let data = [];
	let flag;
	//3.mysql에서 데이터 받기.로드데이타 함수를 만들어서 데이터 받아옴.저번에 세이브 데이터 함수 만든 것처럼.

	//let user_data = [];
	let results = [];
	let user_id = req.body.user_id;

	

	results = await userphoto(user_id);
	console.log(results);

	//results에 받아온걸 data에 넣어서 보내야함.
	//results[0] = true or false
	//results[1] =[~~~] 즉,tmp 데이터 자체
	//console.log("test");
	if (results[0]){ //if true
		data = results[1];
		flag=1;
	}
	else{//if false
		data=[{'nickname': '',
			'age':'',
			'phone':'',
			'mbti':'',
			'position':'',
			'introduction':'',
			'certification':'',
			'portfolio_name':'',
			'portfolio_detail':'',
			'portfolio_file':''}];    //내용이 없더라도 json에서 플래그랑 데이터 둘다 보내기 때문에 빈거라도 보냄.가짜로
		flag=0;
	}

	
	res.json({
		'data':data,
		'flag':flag
	});
});
const userphoto = async (user_id) => {
	try{
		const connection = await conn.getConnection(async conn=>conn);
		try{
			await connection.beginTransaction();
			//query 생성
			let select_query ='';
		    select_query = "SELECT nickname,user_image FROM user_db WHERE user_id ='" + user_id +"'";   //id에 
		    let tmp=[];
			[tmp]=await connection.query(select_query);
		
			
			//원래 쿼리문
			//[tmp] = await connection.query(select_query);
			await connection.commit();
			connection.release();
			
			// console.log(tmp);
			
			console.log("successfully loaded participateData!")
			return [true, tmp];
		}
		
		catch(err){
			await connection.rollback();
			connection.release();
			console.log("[DB mysql input error in <participateData> function]" + err);
			console.log("false")
			return [false];
		}
	}
	
	catch(err){
		console.log("[DB connection error in <participateData> function]" + err);
		return [false];
	}
}
module.exports = router;