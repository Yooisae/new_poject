var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
var connInfo = require('./db/db_login_info').dev; //개발자에 관한 정보라는것. dev로 정의해놔서.이름은 바꿔도됨.db_login_info를 통해 내가 만든 db의 정보를 가져오는것.

//mysql setting//
var conn = mysql.createPool(connInfo);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('my_participating_project');
});

router.post('/participateUser',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	
	
	let data = [];
	let flag;
	//3.mysql에서 데이터 받기.로드데이타 함수를 만들어서 데이터 받아옴.저번에 세이브 데이터 함수 만든 것처럼.

	//let user_data = [];
	let results = [];
	let user_id = req.body.user_id;
	let apply_project_id = req.body.project_id;

	

	results = await checkUserData(apply_project_id,user_id);
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
			'major':'',
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

const checkUserData = async (apply_project_id,user_id) => {
	try{
		const connection = await conn.getConnection(async conn=>conn);
		try{
			await connection.beginTransaction();
			//query 생성
			let select_query ='';
			let tmp=[];
			//원래 쿼리문
			//select_query = "SELECT * FROM project_db WHERE project_id='"+like_project_id+"' AND LOCATE('"+user_id+"',interest_user ) > 0 " ;
			select_query= 'SELECT JSON_EXTRACT(test_apply_project,"$.apply_projects") AS TEST FROM user_db WHERE user_id="' + user_id + '"';
			//select_query= 'SELECT JSON_EXTRACT(test_like_project,"$.like_project_id") AS TEST FROM user_db WHERE user_id="' + user_id + '"';
			let ddd= await connection.query(select_query);
		
			[tmp]= ddd[0];
			console.log(tmp,"apply프로젝트 체크합니다")
			
			//원래 쿼리문
			//[tmp] = await connection.query(select_query);
			await connection.commit();
			connection.release();
			
			// console.log(tmp);
			
			console.log("successfully loaded checkUserData!")
			return [true, tmp];
		}
		
		catch(err){
			await connection.rollback();
			connection.release();
			console.log("[DB mysql input error in <checkUserData> function]" + err);
			console.log("false")
			return [false];
		}
	}
	
	catch(err){
		console.log("[DB connection error in <checkUserData> function]" + err);
		return [false];
	}
}

router.post('/deleteUser',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	
	
	let data = [];
	let flag;
	//3.mysql에서 데이터 받기.로드데이타 함수를 만들어서 데이터 받아옴.저번에 세이브 데이터 함수 만든 것처럼.

	//let user_data = [];
	let results = [];
	let user_id = req.body.user_id;
	let apply_project_id = req.body.project_id;
    let apply_idx = req.body.apply_idx;

	results = await deleteData(apply_idx,apply_project_id,user_id);
	
	
	
   if (results === true) flag = 1;
   else flag = 0 ;


	
	
	res.json({
		
		'flag':flag
	});
});

const deleteData = async (apply_idx,apply_project_id,user_id) => {
	try{
		const connection = await conn.getConnection(async conn=>conn);
		try{
			await connection.beginTransaction();
			//query 생성
			let select_query ='';
		    
			select_query = "UPDATE user_db SET test_apply_project = JSON_REMOVE(test_apply_project, '$.apply_projects[0].apply_project_id["+apply_idx+"]') WHERE user_id='"+user_id+"'";
		
			//select_query = "SELECT * FROM project_db WHERE project_id='"+like_project_id+"' AND LOCATE('"+user_id+"',interest_user ) > 0 " ;
			
			//query 입력
			await connection.query(select_query);
			await connection.commit();
			connection.release();
			
			// console.log(tmp);
			
			console.log("successfully loaded deleteData!")
			return true;
		}
		
		catch(err){
			await connection.rollback();
			connection.release();
			console.log("[DB mysql input error in <deleteData> function]" + err);
			console.log("false")
			return false;
		}
	}
	
	catch(err){
		console.log("[DB connection error in <deleteData> function]" + err);
		return false;
	}
}


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
			'major':'',
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
router.post('/participateList',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
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

	

	results = await participateData(user_id);
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
			'major':'',
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

const participateData = async (user_id) => {
	try{
		const connection = await conn.getConnection(async conn=>conn);
		try{
			await connection.beginTransaction();
			//query 생성
			let select_query ='';
			let tmp=[];
			
			select_query= 'SELECT JSON_EXTRACT(test_apply_project,"$.apply_projects") AS TEST FROM user_db WHERE user_id="' + user_id + '"';
			let ddd= await connection.query(select_query);
		
			[tmp]= ddd[0];
			console.log(tmp,"tmp체크합니다")
			
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

router.post('/showproject', async function(req, res) {
  	let data =[];
	let flag;
	//(위) 3. mysql에서 데이터 받기
	let results = [];


	let project_id = req.body.apply_project;  
	results = await loadData(project_id);
	
	
	//console.log(results);
	
	//[ true, [ ~~~~ ]]
	//results[0] = true or false
	//results[1] = [ ~~~~ ]
	//3. data = results[1]; 
	if (results[0]) { //if true
		data = results[1];
		flag = 1;
	}
	
	else { //if false
		data = [];
	}
	
	//4. 받은 데이터를 ajax를 통해서 fornt-end로 보내기
	res.json({
		'data':data,
		'flag':flag
	});
});

const loadData = async (project_id) => {
	try{
		const connection = await conn.getConnection(async conn=>conn);
		try{
			await connection.beginTransaction();
			//query 생성
			let select_query='';
			if (project_id === null)
				select_query = "SELECT reject_user,agree_user,project_id,title,descript_S,phone_num,team_max_num,status,team_present_num,tags,nickname_H,nickname_P,test_image FROM project_db";
			else
				select_query = "SELECT reject_user,agree_user,project_id,title,category,descript_S,phone_num,team_max_num,status,team_present_num,tags,nickname_H,nickname_P,test_image FROM project_db WHERE project_id= '" + project_id + "'";
			
			
			//query 입력
			let tmp=[];
			[tmp] = await connection.query(select_query);
			console.log(tmp,"tmp호출합니다")
			await connection.commit();
			connection.release();
			
			// console.log(tmp);
			
			console.log("successfully loaded!")
			return [true, tmp];
		}
		
		catch(err){
			await connection.rollback();
			connection.release();
			console.log("[DB mysql input error in <loadData> function]" + err);
			console.log("false")
			return [false];
		}
	}
	
	catch(err){
		console.log("[DB connection error in <loadData> function]" + err);
		return [false];
	}
}

module.exports = router;