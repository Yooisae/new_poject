const express = require('express');
const router = express.Router();

// mysql setting //
const mysql = require('mysql2/promise');
const connInfo = require('./db/db_login_info').dev;
const conn = mysql.createPool(connInfo);


//get
router.get('/', function(req, res, next) {
	//여기서 미리 프로젝트의 정보를 받아서 같이 보내
	
	res.render('my_project_setting');
});


router.get('/view/:article_id', async function(req, res) {
	let data = [];
	let flag;
	let id = req.params.article_id;
	
	
	// MySQL에서 데이터 받기
	let results = [];
	results = await loadData(id);
	//console.log(results);
	
	if (results[0]) {
		data = results[1];
		flag = 1;
	}
	else {
		data = [{'id': '',
				'title':'',
				'writer': '',
				'content': ''}]
		flag = 0;
	}
	
	//4. 받은 데이터를 ajax를 통해서 front-end(ejs)로 보내기
	res.render('contentview',
			   {
				'data': data,
				'flag': flag
			},
			  'listview', 
			   {
				'data': data,
				'flag': flag
			});
});
	

router.post('/proloadDataList',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	//추가
	//const {id} = JSON.parse(localStorage.getItem("user-info"));
	//localStorage.remove("user-info");
	//console.log(id); // 아이디 이름 비밀번호
	
	let data= [];
	let flag;
	//3.mysql에서 데이터 받기.로드데이타 함수를 만들어서 데이터 받아옴.저번에 세이브 데이터 함수 만든 것처럼.
	let results=[];
	let id =req.body.id;
	results = await loadData(id);//보내는게 없으면 속이 비워져 있음.
	console.log(id);

	//console.log(results);
	//results에 받아온걸 data에 넣어서 보내야함.
	//results[0] = true or false
	//results[1] =[~~~] 즉,tmp 데이터 자체
	
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

router.post('/proList',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	//추가
	//const {id} = JSON.parse(localStorage.getItem("user-info"));
	//localStorage.remove("user-info");
	//console.log(id); // 아이디 이름 비밀번호
	
	let data1= [];
	let data2 = [];
	let flag;
	//3.mysql에서 데이터 받기.로드데이타 함수를 만들어서 데이터 받아옴.저번에 세이브 데이터 함수 만든 것처럼.
	let results=[];
	let regis = [];
	//let user_data = [];
	let pro_id =req.body.pro_id;
	//user_id='jicong';
	let user_id = req.body.user_id;
	console.log(pro_id);
	
	results = await proloadData(pro_id);//보내는게 없으면 속이 비워져 있음.
	regis = await loadData(user_id);
	
	
	//results에 받아온걸 data에 넣어서 보내야함.
	//results[0] = true or false
	//results[1] =[~~~] 즉,tmp 데이터 자체
	//console.log("test");
	if (results[0]){ //if true
		data1 = results[1];
		flag=1;
	}
	else{//if false
		data1=[{'nickname': '',
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
	if (regis[0]){ //if true
		data2 = regis[1];
		flag=1;
	}
	else{//if false
		data2=[{'nickname': '',
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
	// if (user_data[0]) {
	// 	data2 = user_data[1];
	// 	flag = 1;
	// }
	// else {
	// 	data2 = [{'id': '',
	// 			'title':'',
	// 			'writer': '',
	// 			'content': ''}]
	// 	flag = 0;
	// };
	
	res.json({
		'data1':data1,
		'data2':data2,
		'flag':flag
	});
});

	const proloadData = async(pro_id)=>{
	try{
		const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
		
		try{
			await connection.beginTransaction(); //connection됐으면 transaction을 시작
			//query생성.이건 그냥 이런거 보여줄거다 하는 안내문이고
			let select_query = '';  //join_db로 부터 다음의 네가지를 받아오겠다.별표는 모든걸 받아오겠다는것.
			if (pro_id === null)
				select_query = "SELECT * FROM project_db LIMIT 0, 10";
			else
				select_query = "SELECT project_id, title, category, descript_S, descript_L, phone_num, team_max_num, team_present_num, tags, nickname_H, nickname_P, status, agree_user, test_image FROM project_db WHERE project_id = '"+ pro_id +"'";
			
			
			//query의 결과를 tmp에 넣기
			let tmp=[];
			[tmp] = await connection.query(select_query);
			await connection.commit();
			await connection.release();
			
			console.log(tmp); //여기서 출력하는게 우리가 실질적으로 보고 싶어하는 그 받아온 데이터 결과.
			console.log('successfully loaded');
			
			return [true,tmp];
			
		}catch(err){
			await connection.rollback();//커밋에서 문제가 생기면 롤백. 방금 입력한 모든걸 취소하는 것. 안전하도록.카드결제 완료를 갑자기 취소하면, 임의로 넣은 정보를 다없앰. 롤백.
			connection.release();
			console.log(' [DB output error in <loadData> function] '+ err);
			return [false];
			
		}
	}catch(err){
		console.log(' [DB connection error in <saveData> function] '+ err);
		return [false];
		
	}
}
	
	const loadData = async(id)=>{
	try{
		const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
		
		try{
			await connection.beginTransaction(); //connection됐으면 transaction을 시작
			//query생성.이건 그냥 이런거 보여줄거다 하는 안내문이고
			let select_query = '';  //join_db로 부터 다음의 네가지를 받아오겠다.별표는 모든걸 받아오겠다는것.
			if (id === null)
				select_query = "SELECT register_project FROM user_db LIMIT 0, 10";   //id가 null이면 다 받아오고.
			else
				select_query = "SELECT register_project,nickname, age, phone, mbti, position, introduction, major, portfolio_name, portfolio_detail, portfolio_file, user_image FROM user_db WHERE user_id ='" + id +"'";   //id에 해당하는 값을 받아온다는 것.
 
			console.log(select_query);
			//query의 결과를 tmp에 넣기
			let tmp=[];
			[tmp] = await connection.query(select_query);
			await connection.commit();
			await connection.release();
			
			console.log(tmp); //여기서 출력하는게 우리가 실질적으로 보고 싶어하는 그 받아온 데이터 결과.
			console.log('successfully loaded');
			
			return [true,tmp];
			
		}catch(err){
			await connection.rollback();//커밋에서 문제가 생기면 롤백. 방금 입력한 모든걸 취소하는 것. 안전하도록.카드결제 완료를 갑자기 취소하면, 임의로 넣은 정보를 다없앰. 롤백.
			connection.release();
			console.log(' [DB output error in <loadData> function] '+ err);
			return [false];
			
		}
	}catch(err){
		console.log(' [DB connection error in <saveData> function] '+ err);
		return [false];
		
	}
}



//post
router.post('/projectlist', async function(req, res) {
	let data1 = [];
	let data2 = [];
	let flag;
	let id1 = null;
	let id2 = null;
	//3. mysql에서 데이터 받기
	let results = await Data(id1);
	let user_data = await idData(id2);
	//let user = await idData(id);
	console.log(results);
	
	if (results[0]) {
		data1 = results[1];
		flag = 1;
	}
	else {
		data1 = [{'id': '',
				'title':'',
				'writer': '',
				'content': ''}]
		flag = 0;
	};
	
	if (user_data[0]) {
		data2 = user_data[1];
		flag = 1;
	}
	else {
		data2 = [{'id': '',
				'title':'',
				'writer': '',
				'content': ''}]
		flag = 0;
	};
	
	// if (user[0]) {
	// 	data2 = user[1];
	// 	flag = 1;
	// }
	// else {
	// 	data2 = [{'id': '',
	// 			'title':'',
	// 			'writer': '',
	// 			'content': ''}]
	// 	flag = 0;
	// };
	
	//4. 받은 데이터를 ajax를 통해서 front-end(ejs)로 보내기
	res.json({
		'data1': data1,
		'data2': data2,
		'flag': flag
	});
});

const Data = async (id1) => {	
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			// query 생성
			let select_query = '';
			
			if (id1 === null)
				select_query = "SELECT * FROM project_db LIMIT 0, 10";
			else
				select_query = "SELECT * FROM project_db WHERE id = '"+ id1 +"'";
			
			// query를 mysql에 입력하기
			let tmp = [];
			[tmp] = await connection.query(select_query);
			
			await connection.commit();
			connection.release();

			console.log("successfully saved!")
			return [true, tmp];
		}
		catch(err) {
			await connection.rollback();
			connection.release();
			console.log("[DB input error in <listData> function] " + err);
			return [false];
		}
	}
	catch(err) {
		console.log("[DB connection error in <listData> function] " + err);
		return [false];
	}
}

const idData = async (id2) => {	
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			// query 생성
			let select_query = '';
			if (id2 === null)
				select_query = "SELECT * FROM user_db LIMIT 0, 10";
			else
				select_query = "SELECT * FROM user_db WHERE id = '"+ id +"'";
			
			
			
			// query를 mysql에 입력하기
			let tmp = [];
			[tmp] = await connection.query(select_query);
			console.log('test3');
			await connection.commit();
			connection.release();
			console.log('test4');
			console.log("successfully saved!")
			return [true, tmp];
		}
		catch(err) {
			await connection.rollback();
			connection.release();
			console.log("[DB input error in <listData> function] " + err);
			return [false];
		}
	}
	catch(err) {
		console.log("[DB connection error in <listData> function] " + err);
		return [false];
	}
}


router.post('/userList',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	//추가
	//const {id} = JSON.parse(localStorage.getItem("user-info"));
	//localStorage.remove("user-info");
	//console.log(id); // 아이디 이름 비밀번호
	
	let data1= [];
	let data2 = [];
	let flag;
	//3.mysql에서 데이터 받기.로드데이타 함수를 만들어서 데이터 받아옴.저번에 세이브 데이터 함수 만든 것처럼.
	let results=[];
	//let user_data = [];
	let user_id =req.body.user_id;
	let pro_num = [];
	let id = 'jicong';
	
	//console.log(user_id);
	//pro_num = await userData(id);
	results = await agreeuserData(user_id);//보내는게 없으면 속이 비워져 있음.
	

	
	//results에 받아온걸 data에 넣어서 보내야함.
	//results[0] = true or false
	//results[1] =[~~~] 즉,tmp 데이터 자체
	console.log(results[1],'결과1을 확인합니다');
	if (results[0]){ //if true
		data1 = results[1];
		flag=1;
	}
	else{//if false
		data1=[{'nickname': '',
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
		'data1':data1,
		'flag':flag
	});
});

const agreeuserData = async (user_id) => {	
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			// query 생성
			let select_query = '';
			
			if (user_id === null)
				select_query = "SELECT * FROM user_db LIMIT 0, 10";
			else
				select_query = "SELECT user_num, user_id, mbti, nickname, position, age, major, user_image FROM user_db WHERE user_id = '"+ user_id +"'";
			
			// query를 mysql에 입력하기
			let tmp = [];
			[tmp] = await connection.query(select_query);
			console.log('test3');
			await connection.commit();
			connection.release();
			console.log('test4');
			console.log("successfully saved!")
			return [true, tmp];
		}
		catch(err) {
			await connection.rollback();
			connection.release();
			console.log("[DB input error in <listData> function] " + err);
			return [false];
		}
	}
	catch(err) {
		console.log("[DB connection error in <listData> function] " + err);
		return [false];
	}
}



router.post('/updateList',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	//추가
	//const {id} = JSON.parse(localStorage.getItem("user-info"));
	//localStorage.remove("user-info");
	//console.log(id); // 아이디 이름 비밀번호
	
	let data1= [];
	//let data2 = [];
	let flag;
	//3.mysql에서 데이터 받기.로드데이타 함수를 만들어서 데이터 받아옴.저번에 세이브 데이터 함수 만든 것처럼.
	let results=[];
	
	//let user_data = [];
	let project_id =req.body.project_id;
	let status = req.body.status;
	
	console.log(project_id);
	
	results = await saveData(project_id, status);//보내는게 없으면 속이 비워져 있음.
	
	

	
	//results에 받아온걸 data에 넣어서 보내야함.
	//results[0] = true or false
	//results[1] =[~~~] 즉,tmp 데이터 자체
	console.log(results);
	if (results[0]){ //if true
		data1 = results[1];
		flag=1;
	}
	else{//if false
		data1=[{'nickname': '',
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
		'data1':data1,
		'flag':flag
	});
});

const saveData = async(project_id, status)=>{
	try{
		const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
		
		try{
			await connection.beginTransaction(); //connection됐으면 transaction을 시작
			//query생성
		let insert_query = "UPDATE project_db SET status='" + status +"' WHERE project_id ='" + project_id +"'";	
		console.log(insert_query);	
	
			//query를 mysql에 입력하기
			await connection.query(insert_query);
			await connection.release();
			//query를 mysql에 입력하기
			
			await connection.commit(); //입력한다고 끝나는게 아니라 커밋해야함.
			connection.release(); //연결 끊기. 불필요하게 mysql에 연결할 필요없으니까.
			console.log('successfully saved');
			return true;
			
		}catch(err){
			await connection.rollback();//커밋에서 문제가 생기면 롤백. 방금 입력한 모든걸 취소하는 것. 안전하도록.카드결제 완료를 갑자기 취소하면, 임의로 넣은 정보를 다없앰. 롤백.
			connection.release();
			console.log(' [DB input error in <saveData> function] '+ err);
			return false;
			
		}
	}catch(err){
		console.log(' [DB connection error in <saveData> function] '+ err);
		return false;
		
	}
}

router.post('/agreeuser',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	//추가
	//const {id} = JSON.parse(localStorage.getItem("user-info"));
	//localStorage.remove("user-info");
	//console.log(id); // 아이디 이름 비밀번호
	
	let data = [];
	let data2 = [];
	let flag;
	//3.mysql에서 데이터 받기.로드데이타 함수를 만들어서 데이터 받아옴.저번에 세이브 데이터 함수 만든 것처럼.
	let results=[];
	let update_nickname_P = []
	//let user_data = [];
	let project_id =req.body.project_id;
	let user_id = req.body.user_id;
	let update_user = req.body.update_nick_P;
	
	results = await agreeuser(project_id, user_id);
	update_nickname_P = update_nick_P(project_id, update_user);
	//보내는게 없으면 속이 비워져 있음.
		
	//results에 받아온걸 data에 넣어서 보내야함.
	//results[0] = true or false
	//results[1] =[~~~] 즉,tmp 데이터 자체
	console.log(results);
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
	
	if (update_nickname_P[0]){ //if true
		data2 = update_nickname_P[1];
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
		'data2': data2,
		'flag':flag
	});
});

const agreeuser = async(project_id, user_id)=>{
	try{
		const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
		
		try{
			await connection.beginTransaction(); //connection됐으면 transaction을 시작
			//query생성
			
		// 	//새로추가한 부분 입니다*****************************
		//  let agree = String(user_id);   
		//  let agree_json = {
		// agree_user_id: [agree]
         
		// }
		//  let agreeJsonString=JSON.stringify(agree_json);
        
		// //데이터가 있는지 확인
        
       
		// let aaa= "SELECT test_agree_user FROM project_db WHERE project_id='"+project_id+"'";
		// let bbb = await connection.query(aaa);
		// let ccc = JSON.stringify(bbb); 
		  
		// console.log(ccc,'확인해보겠습니당'); 
		
		// //데이터가 있으면 추가
		// if(ccc){
		// 	  let insert_query= "UPDATE project_db SET test_agree_user = json_array_append(test_agree_user,'$.agree_user_id','"+agree+"') WHERE project_id='"+project_id+"'";	 
		// 	   await connection.query(insert_query);
		// 	 console.log(insert_query);
		// 	 await connection.query(insert_query);
		//  //없으면 새로 만들기
		//  }else{
		// 		let insert_query="UPDATE project_db SET test_agree_user = '"+agreeJsonString+"' WHERE project_id='"+project_id+"'"; 
		//  		 await connection.query(insert_query);
		// 	 console.log(insert_query,"테스트중 왑왑와바ㅏㅏ");
		// 	 await connection.query(insert_query);
		//  }
		//새로 추가한 부분 끝입니다 **********************************	
		
			//이게 원래 거입니다**************************
		let insert_query = "UPDATE project_db SET agree_user='" + user_id +"' WHERE project_id ='" + project_id +"'";	
		console.log(insert_query);	
	
			//query를 mysql에 입력하기
			await connection.query(insert_query);
			await connection.release();
			//query를 mysql에 입력하기
			
			await connection.commit(); //입력한다고 끝나는게 아니라 커밋해야함.
			connection.release(); //연결 끊기. 불필요하게 mysql에 연결할 필요없으니까.
			console.log('successfully saved');
			return true;
			
		}catch(err){
			await connection.rollback();//커밋에서 문제가 생기면 롤백. 방금 입력한 모든걸 취소하는 것. 안전하도록.카드결제 완료를 갑자기 취소하면, 임의로 넣은 정보를 다없앰. 롤백.
			connection.release();
			console.log(' [DB input error in <saveData> function] '+ err);
			return false;
			
		}
	}catch(err){
		console.log(' [DB connection error in <saveData> function] '+ err);
		return false;
		
	}
}

const update_nick_P = async(project_id, update_user)=>{
	try{
		const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
		
		try{
			await connection.beginTransaction(); //connection됐으면 transaction을 시작
			//query생성
		let insert_query = "UPDATE project_db SET nickname_P='" + update_user +"' WHERE project_id ='" + project_id +"'";	
		console.log(insert_query);	
	
			//query를 mysql에 입력하기
			await connection.query(insert_query);
			await connection.release();
			//query를 mysql에 입력하기
			
			await connection.commit(); //입력한다고 끝나는게 아니라 커밋해야함.
			connection.release(); //연결 끊기. 불필요하게 mysql에 연결할 필요없으니까.
			console.log('successfully saved');
			return true;
			
		}catch(err){
			await connection.rollback();//커밋에서 문제가 생기면 롤백. 방금 입력한 모든걸 취소하는 것. 안전하도록.카드결제 완료를 갑자기 취소하면, 임의로 넣은 정보를 다없앰. 롤백.
			connection.release();
			console.log(' [DB input error in <saveData> function] '+ err);
			return false;
			
		}
	}catch(err){
		console.log(' [DB connection error in <saveData> function] '+ err);
		return false;
		
	}
}

router.post('/deleteuser',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	//추가
	//const {id} = JSON.parse(localStorage.getItem("user-info"));
	//localStorage.remove("user-info");
	//console.log(id); // 아이디 이름 비밀번호
	
	let data = [];
	let flag;
	let user_update = [];
	
	let project_id =req.body.project_id;
	let delete_id = req.body.delete_id;
	
	let user = req.body.nick_P;
	console.log(project_id,delete_id,user,"받아온값 확인중")
	user_update = await deleteuser(project_id, user);
	
	
	if (user_update[0]){ //if true
		data = user_update[1];
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

const deleteuser = async(project_id, user_update)=>{
	try{
		const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
		
		try{
			await connection.beginTransaction(); //connection됐으면 transaction을 시작
			//query생성
		let insert_query = "UPDATE project_db SET nickname_P='" + user_update +"' WHERE project_id ='" + project_id +"'";	
		console.log(insert_query);	
	
			//query를 mysql에 입력하기
			await connection.query(insert_query);
			await connection.release();
			//query를 mysql에 입력하기
			
			await connection.commit(); //입력한다고 끝나는게 아니라 커밋해야함.
			connection.release(); //연결 끊기. 불필요하게 mysql에 연결할 필요없으니까.
			console.log('successfully saved');
			return true;
			
		}catch(err){
			await connection.rollback();//커밋에서 문제가 생기면 롤백. 방금 입력한 모든걸 취소하는 것. 안전하도록.카드결제 완료를 갑자기 취소하면, 임의로 넣은 정보를 다없앰. 롤백.
			connection.release();
			console.log(' [DB input error in <saveData> function] '+ err);
			return false;
			
		}
	}catch(err){
		console.log(' [DB connection error in <saveData> function] '+ err);
		return false;
		
	}
}

router.post('/rejectuser',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	//추가
	//const {id} = JSON.parse(localStorage.getItem("user-info"));
	//localStorage.remove("user-info");
	//console.log(id); // 아이디 이름 비밀번호
	
	let data = [];
	let flag;
	let user_update = [];
	
	let project_id =req.body.project_id;
	let delete_id = req.body.delete_id;
	let user_id = req.body.nick_P;
	
	user_update = await rejectuser(project_id, delete_id);
	
	
	if (user_update==true){ //if true
		
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
		
		'flag':flag
	});
});

const rejectuser = async(project_id, delete_id)=>{
	try{
		const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
		
		try{
			await connection.beginTransaction(); //connection됐으면 transaction을 시작
			//query생성
			
			let aaa= "SELECT reject_user FROM project_db WHERE project_id='"+project_id+"'";
		    let bbb = await connection.query(aaa);
		   var isEmpty = function(value){
            if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){             
              return true                 
            }else{            
              return false      
          
            }
             
          };
			console.log(isEmpty(bbb),"값이 비었는지 확인중");
		    if (isEmpty(bbb)==false){
		    let insert_query ="UPDATE project_db SET reject_user= CONCAT_WS(',',reject_user,'"+delete_id+"') WHERE project_id ='"+project_id+"'";
		       await connection.query(insert_query);
		    }else{
		      let insert_query ="UPDATE project_db SET reject_user= '"+delete_id+"' WHERE project_id ='"+project_id+"'";  
		    await connection.query(insert_query);
		    }
		
			//query를 mysql에 입력하기
		
			await connection.release();
			//query를 mysql에 입력하기
			
			await connection.commit(); //입력한다고 끝나는게 아니라 커밋해야함.
			connection.release(); //연결 끊기. 불필요하게 mysql에 연결할 필요없으니까.
			console.log('successfully saved');
			return true;
			
		}catch(err){
			await connection.rollback();//커밋에서 문제가 생기면 롤백. 방금 입력한 모든걸 취소하는 것. 안전하도록.카드결제 완료를 갑자기 취소하면, 임의로 넣은 정보를 다없앰. 롤백.
			connection.release();
			console.log(' [DB input error in <saveData> function] '+ err);
			return false;
			
		}
	}catch(err){
		console.log(' [DB connection error in <saveData> function] '+ err);
		return false;
		
	}
}



module.exports = router;