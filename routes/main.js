const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const connInfo = require('./db/db_login_info').dev;
//mysql setting//
const conn = mysql.createPool(connInfo);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main_page_copy0');
});


//post - 게시판 전체를 보여주는 것 
router.post('/showDataList', async function(req, res) {
  	let data =[];
	let flag;
	//(위) 3. mysql에서 데이터 받기
	let results = [];

    let inputType = req.body.inputType;
	let inputDepart = req.body.inputDepart;
	let inputTopic = req.body.inputTopic;
	let id=null;

	results = await main_loadData(id);
	
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

router.post('/testshowDataList', async function(req, res) {
  	let data =[];
	let flag;
	//(위) 3. mysql에서 데이터 받기
	let results = [];

    let inputType = req.body.inputType;
	let inputDepart = req.body.inputDepart;
	let inputTopic = req.body.inputTopic;

	console.log(inputType,inputDepart,inputTopic,"세개다 테스트 출력");

	results = await test_load(inputType,inputDepart,inputTopic);
	
	console.log(results[1],"결과가 모임..?");
	
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
router.post('/checkApply', async function(req, res) {
  	let data =[];
	let flag;
	//(위) 3. mysql에서 데이터 받기
	let results = [];

    let user_id = req.body.user_id;
	let project_id = req.body.project_id;

	results = await checkApply(project_id,user_id);
	
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
const checkApply = async (project_id,user_id) => {
	try{
		const connection = await conn.getConnection(async conn=>conn);
		try{
			await connection.beginTransaction();
			//query 생성
			let select_query='';
		
            select_query = "SELECT COUNT(*) AS flag FROM project_db WHERE project_id= '"+project_id+"' AND LOCATE('"+user_id+"', nickname_P) > 0 ";

		
			
			
			
			
			//query 입력
			let tmp=[];
			[tmp] = await connection.query(select_query);
			
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

router.post('/checkLike', async function(req, res) {
  	let data =[];
	let flag;
	//(위) 3. mysql에서 데이터 받기
	let results = [];

    let user_id = req.body.user_id;
	let project_id = req.body.project_id;

	results = await checkLike(project_id,user_id);
	
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
const checkLike = async (project_id,user_id) => {
	try{
		const connection = await conn.getConnection(async conn=>conn);
		try{
			await connection.beginTransaction();
			//query 생성
			
		
            

		
			
			//let aa= "SELECT JSON_CONTAINS_PATH(test_like_project,'"+project_id+"','$.like_projects[0].like_project_id')AS TEST FROM user_db WHERE user_id='"+user_id+"'";
			
		    //let aa= "SELECT * AS TEST FROM user_db WHERE test_like_project->'$.like_projects[0].like_project_id' = '"+project_id+"'";
     		
			//let aa= "SELECT * FROM user_db WHERE user_id= '"+user_id+"' AND JSON_ARRAY_CONTAINS(JSON_EXTRACT(test_like_project, '$.like_projects[0].like_project_id'), '"+project_id+"')";
			let aa= "SELECT JSON_EXTRACT(test_like_project,'$.like_projects[0].like_project_id')AS TEST FROM user_db WHERE user_id='"+user_id+"'";
			//query 입력
			let tmp=[];
			console.log("라이크 프로젝트 확인");
			[tmp] = await connection.query(aa);
			console.log(tmp);
			
			await connection.commit();
			connection.release();
			
			// console.log(tmp);
			
			console.log("successfully loaded!")
			return [true, tmp];
		}
		
		catch(err){
			await connection.rollback();
			connection.release();
			console.log("[DB mysql input error in <checkLike> function]" + err);
			console.log("false")
			return [false];
		}
	}
	
	catch(err){
		console.log("[DB connection error in <checkLike> function]" + err);
		return [false];
	}
}


router.post('/showAnoterList', async function(req, res) {
  	let data =[];
	let flag;
	//(위) 3. mysql에서 데이터 받기
	let results = [];


	let id='test';

	results = await main_loadData(id);
	
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

//정보 있는지 확인하는 곳
router.post('/searchKeyword', async function(req, res) {
  	let data =[];
	let flag;
	//(위) 3. mysql에서 데이터 받기
	let results = [];


	let search_input= req.body.search_input;  
	results = await searchData(search_input);
	
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
	console.log(data);
	//4. 받은 데이터를 ajax를 통해서 fornt-end로 보내기
	
	res.json({
		'data':data,
		'flag':flag
	});

});

//이게 찐 정보 불러오는 곳
router.post('/search_Keyword', async function(req, res) {
  	let data =[];
	let flag;
	//(위) 3. mysql에서 데이터 받기
	let results = [];


	let search_input= req.body.search_input;  
	results = await searchData(search_input);
	
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
	console.log(data);
	//4. 받은 데이터를 ajax를 통해서 fornt-end로 보내기
	
	res.json({
		'data':data,
		'flag':flag
	});

});
router.post('/showProfile', async function(req, res) {
  	let data =[];
	let flag;
	//(위) 3. mysql에서 데이터 받기
	let results = [];


	let id= req.body.user_id;  
	results = await profileData(id);
	
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
router.post('/participantUpdate',async function(req, res){

 
    let nick_P = req.body.nickname_P;
	console.log(nick_P,"nick_p출력해보기이이이ㅣ");
	let project_id = req.body.project_id;

  
   //변수를 mysql에 저장
   //저장된 결과가 성공적이면 flag변수에 1넣기
   //mysql에 저장 실패하면 flag에 0을 넣음
   
   let results = await saveData(project_id, nick_P);  //여기 await안하면 results안들어갔는데, 그냥 다음으로 넘어가서 실패했는데도 성공했다뜸.
   
	
 
	
	let flag;
   if (results === true) flag = 1;
   else flag = 0 ;
	
	let state_data=[];
	let state_flag;
   

   let data = [];
	
    res.json({
     
       'message':'returned', //아무튼 리턴 됏다. 결과가 보내지긴 함. flag가 0이면 실패인거고
       'flag':flag,
    });
});
router.post('/TESTparticipantUpdate',async function(req, res){

 
    let nickname_P = req.body.nickname_P;
	let project_id = req.body.project_id;
  
	
	
	

   //변수를 mysql에 저장
   //저장된 결과가 성공적이면 flag변수에 1넣기
   //mysql에 저장 실패하면 flag에 0을 넣음
   
   let results = await TESTsaveData(project_id, nickname_P);  //여기 await안하면 results안들어갔는데, 그냥 다음으로 넘어가서 실패했는데도 성공했다뜸.
   
   let secon_results = await TESTpartyData(project_id, nickname_P);
 
	
	let flag;
   if (results  === true && secon_results=== true) flag = 1;
   else flag = 0 ;
	
	let state_data=[];
	let state_flag;
   

   let data = [];
	
    res.json({
     
       'message':'returned', //아무튼 리턴 됏다. 결과가 보내지긴 함. flag가 0이면 실패인거고
       'flag':flag,
    });
});


router.post('/likeProjectUpdate',async function(req, res){

 
    let pre_user = req.body.user;
	let like_project_id = req.body.like_project_id;
	
	
  
  
   //변수를 mysql에 저장
   //저장된 결과가 성공적이면 flag변수에 1넣기
   //mysql에 저장 실패하면 flag에 0을 넣음
   
   let results = await likeData(like_project_id,pre_user);  //여기 await안하면 results안들어갔는데, 그냥 다음으로 넘어가서 실패했는데도 성공했다뜸.
   
	
 
	
	let flag;
   if (results[0] === true){
	   flag=0;
	   if(results[1]==1){
		   console.log("이미 존재하는 값");
		   flag=1;
	   }else{
		   console.log("추가 되었습니다!");
		   flag=0;
	   }
   }else{
	   flag=1;
   }


   
	
    res.json({
     
       'message':'returned', //아무튼 리턴 됏다. 결과가 보내지긴 함. flag가 0이면 실패인거고
       'flag':flag,
    });
});
// router.post('/interestUserUpdate',async function(req, res){

 
//     let pre_user = req.body.user;
// 	let like_project_id = req.body.like_project_id;
	
	
  
  
//    //변수를 mysql에 저장
//    //저장된 결과가 성공적이면 flag변수에 1넣기
//    //mysql에 저장 실패하면 flag에 0을 넣음
   
//   let results = await interestData(like_project_id,pre_user);
 
	
// 	let flag;
//    if (results === true) flag = 1;
//    else flag = 0 ;
	
// 	let state_data=[];
// 	let state_flag;
   

//    let data = [];
	
//     res.json({
     
//        'message':'returned', //아무튼 리턴 됏다. 결과가 보내지긴 함. flag가 0이면 실패인거고
//        'flag':flag,
//     });
// });



router.post('/showProjectList', async function(req, res) {
  	let data =[];
	let flag;
	//(위) 3. mysql에서 데이터 받기
	let results = [];
	console.log("showProjectList");

	let id= req.body.project_id;  
	results = await loadData(id);
	
	console.log(results);
	
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

router.post('/userList',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	//추가
	//const {id} = JSON.parse(localStorage.getItem("user-info"));
	//localStorage.remove("user-info");
	//console.log(id); // 아이디 이름 비밀번호
	
	let user_Data= [];
	let flag;
	//3.mysql에서 데이터 받기.로드데이타 함수를 만들어서 데이터 받아옴.저번에 세이브 데이터 함수 만든 것처럼.
	let results=[];
	//let user_data = [];
	let user_id =req.body.user_id;
	//let project_id=req.body.project_id;
	
	console.log(user_id);
	
	results = await totalData(user_id);//보내는게 없으면 속이 비워져 있음.
	

	
	//results에 받아온걸 data에 넣어서 보내야함.
	//results[0] = true or false
	//results[1] =[~~~] 즉,tmp 데이터 자체
	
	if (results[0]){ //if true
		user_Data = results[1];
		flag=1;
	}
	else{//if false
		user_Data=[{'nickname': '',
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
	

	
	res.json({                    //원래 project_detail적혀있었음.
			'user_Data':user_Data,
			'flag':flag
	});
});

router.post('/addHost',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	//추가
	//const {id} = JSON.parse(localStorage.getItem("user-info"));
	//localStorage.remove("user-info");
	//console.log(id); // 아이디 이름 비밀번호
	
	let user_Data= [];
	let flag;
	//3.mysql에서 데이터 받기.로드데이타 함수를 만들어서 데이터 받아옴.저번에 세이브 데이터 함수 만든 것처럼.
	let results=[];
	//let user_data = [];
	let host_id =req.body.host_id;

	results = await hostData(host_id);//보내는게 없으면 속이 비워져 있음.
	

	
	//results에 받아온걸 data에 넣어서 보내야함.
	//results[0] = true or false
	//results[1] =[~~~] 즉,tmp 데이터 자체
	
	if (results[0]){ //if true
		user_Data = results[1];
		flag=1;
	}
	else{//if false
		user_Data=[{'nickname': '',
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
	

	
	res.json({                    //원래 project_detail적혀있었음.
			'user_Data':user_Data,
			'flag':flag
	});
});

//게시판 -> 게시물 세부내용
router.get('/post/:article_id', async function(req,res) { //:id, 변수처리 : ejs 주소는 이게 됨.
	//(위) 얘는 받아오는거임. ejs로부터.
	let data =[];
	let flag;
	//(위) 3. mysql에서 데이터 받기
	let results = [];
	let id=req.params.article_id;
	results = await loadData(id);
	console.log(results);
	
	
	
	if (results[0]) { //if true
		data = results[1];
		flag = 1;
	}
	
	else { //if false
		data = [];
	}
	

	res.render( 'project_detail', //project_detail.ejs로 
			   {
					'data':data, //data바로 전달
					'flag':flag
				});
});


router.get('/test/post/:user_num', async function(req,res) { //:id, 변수처리 : ejs 주소는 이게 됨.
	//(위) 얘는 받아오는거임. ejs로부터.
	let data =[];
	let flag;
	//(위) 3. mysql에서 데이터 받기
	let results = [];
	let id=req.params.user_num;
	console.log(id);
	results = await USERData(id);
	console.log(results,"나는 클럽데이터를 알고싶다제발 알려줘라");
	
	
	if (results[0]) { //if true
		data = results[1];
		flag = 1;
	}
	
	else { //if false
		data = [];
	}
	
	//4. 받은 데이터를 ajax를 통해서 fornt-end(ejs파일)로 보내기
	res.render( 'test', //얘를 열어서
			   {
					'data':data, //얘들을 보내라
					'flag':flag
				});
});

//functions//

const loadData = async (id) => {
	try{
		const connection = await conn.getConnection(async conn=>conn);
		try{
			await connection.beginTransaction();
			//query 생성
			let select_query='';
			if (id === null){
				//select_query = "SELECT agree_user,title,category,descript_S,descript_L,team_max_num,status,tags,CONVERT(image using utf8) as image,test_image FROM project_db";
			    

				select_query = "SELECT agree_user,project_id,title,category,descript_S,descript_L,phone_num,team_max_num,status,team_present_num,tags,nickname_H,nickname_P,test_image,open_chat,contest_link FROM project_db";
			}
				
			else{
				select_query = "SELECT agree_user,project_id,title,category,descript_S,descript_L,phone_num,team_max_num,status,team_present_num,tags,nickname_H,nickname_P,test_image,open_chat,contest_link FROM project_db WHERE project_id= '" + id + "'";

			}
			
			
			
			//query 입력
			let tmp=[];
			[tmp] = await connection.query(select_query);
			
			await connection.commit();
			connection.release();
			
			// console.log(tmp);
			console.log(tmp);
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

const test_load = async (inputType,inputDepart,inputTopic) => {
	try{
		const connection = await conn.getConnection(async conn=>conn);
		try{
			await connection.beginTransaction();
			//query 생성
			let select_query='';
		
			
			console.log(inputDepart,"rufhrkkkkkkkkkkkkkkkkk");
            if(inputDepart!=0&&inputTopic==0){
				
				select_query = "SELECT agree_user,project_id,title,category,descript_S,descript_L,phone_num,team_max_num,status,team_present_num,tags,nickname_H,nickname_P,test_image FROM project_db WHERE project_type='"+inputType+"'AND department='"+inputDepart+"'";

			}else if(inputDepart==0&&inputTopic!=0){
			   select_query = "SELECT agree_user,project_id,title,category,descript_S,descript_L,phone_num,team_max_num,status,team_present_num,tags,nickname_H,nickname_P,test_image FROM project_db WHERE project_type='"+inputType+"'AND FIND_IN_SET('"+inputTopic+"', detail_topic) > 0 ";

			}else if(inputDepart==0&&inputTopic==0){
				console.log(inputDepart==0&&inputTopic==0)
				select_query = "SELECT agree_user,project_id,title,category,descript_S,descript_L,phone_num,team_max_num,status,team_present_num,tags,nickname_H,nickname_P,test_image FROM project_db WHERE project_type='"+inputType+"'";

			}else{
				select_query = "SELECT agree_user,project_id,title,category,descript_S,descript_L,phone_num,team_max_num,status,team_present_num,tags,nickname_H,nickname_P,test_image FROM project_db WHERE project_type='"+inputType+"' AND department='"+inputDepart+"' AND FIND_IN_SET('"+inputTopic+"', detail_topic) > 0";

			}
			
			
			
			
			//query 입력
			let tmp=[];
			[tmp] = await connection.query(select_query);
			
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

const main_loadData = async (id) => {
	try{
		const connection = await conn.getConnection(async conn=>conn);
		try{
			await connection.beginTransaction();
			//query 생성
			let select_query='';
			if (id == null){
				//select_query = "SELECT agree_user,title,category,descript_S,descript_L,team_max_num,status,tags,CONVERT(image using utf8) as image,test_image FROM project_db";
			    
				select_query = "SELECT * FROM project_db WHERE category = 1";
				// select_query = "SELECT agree_user,project_id,title,category,descript_S,descript_L,phone_num,team_max_num,status,team_present_num,tags,nickname_H,nickname_P,test_image FROM project_db WHERE category=1";
			}
				
			else{
				// select_query = "SELECT agree_user,project_id,title,category,descript_S,descript_L,phone_num,team_max_num,status,team_present_num,tags,nickname_H,nickname_P,test_image FROM project_db WHERE category IN ('2','3','4','5')";
				select_query = "SELECT * FROM project_db WHERE category IN ('2','3','4','5')";

			}
			
			
			//query 입력
			let tmp=[];
			[tmp] = await connection.query(select_query);
			
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
const profileData = async (id) => {
	try{
		const connection = await conn.getConnection(async conn=>conn);
		try{
			await connection.beginTransaction();
			//query 생성
			let select_query='';
			if (id === null)
				select_query = "SELECT user_id,user_image FROM user_db";
			else
				select_query = "SELECT user_id,user_image FROM user_db  WHERE user_id= '" + id + "'";
			
			
			//query 입력
			let tmp=[];
			[tmp] = await connection.query(select_query);
			console.log(tmp);
			await connection.commit();
			connection.release();
			
			// console.log(tmp);
			
			console.log("프로필 이미지 성공적으로 불러옴!")
			return [true, tmp];
		}
		
		catch(err){
			await connection.rollback();
			connection.release();
			console.log("[DB mysql input error in <profileData> function]" + err);
			console.log("false")
			return [false];
		}
	}
	
	catch(err){
		console.log("[DB connection error in <profileData> function]" + err);
		return [false];
	}
}
const saveData = async(project_id, nick_P)=>{
   try{
      const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
      
      try{
         await connection.beginTransaction(); //connection됐으면 transaction을 시작
         //query생성
		   var isEmpty = function(value){
            if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){             
              return true                 
            }else{            
              return false      
          
            }
             
          };
      
		  let aaa= "SELECT nickname_P FROM project_db WHERE project_id='"+project_id+"'";
          let bbb = await connection.query(aaa);
		 
		  console.log(bbb[0][0].nickname_P,"닉네임에 왜 콤마들어가는지 확인...",isEmpty(bbb))
        
          if (isEmpty(bbb[0][0].nickname_P)==true){
			 let user_query ="UPDATE project_db SET nickname_P = '"+nick_P+"' WHERE project_id ='"+project_id+"'";  
			  await connection.query(user_query);
          }else{
            let user_query ="UPDATE project_db SET nickname_P= CONCAT_WS(',',nickname_P,'"+nick_P+"') WHERE project_id ='"+project_id+"'";
                await connection.query(user_query);
			 
			  
          }
		  
		 let apply = String(project_id);   
		 let apply_json = {
			 "apply_projects" :[
					 {"apply_project_id":[apply]}	 
				 
			 				  ]     
         
                        };
		 let new_json = {
			 "apply_project_id": apply
				 

         
		 };
		  

		 let applyJsonString =JSON.stringify(apply_json);
		 let newJsonString=JSON.stringify(new_json);
		  
		  //console.log(newJsonString,"뉴제이슨 스트링 확인")
        
        //데이터가 있는지 확인
        let aa= "SELECT JSON_EXTRACT(test_apply_project,'$.apply_projects')AS TEST FROM user_db WHERE user_id='"+nick_P+"'";
        //let aaa= "SELECT JSON_EXTRACT(test_like_project,'$.like_project_id') AS TEST FROM user_db WHERE user_id='"+pre_user+"'";
        
        let bb = await connection.query(aa);
		  //빈 값인지 확인하는 함수
		  //let ccc = JSON.stringify(bbb);
		 
		  //지금 값에 접근을 못하는 중..
		  console.log(isEmpty(bb[0][0].TEST),"applyproject추가중")
		  
	     //데이터가 없으면 새로만들기
		 if(isEmpty(bb[0][0].TEST)==true){
			  	 let user_query="UPDATE user_db SET test_apply_project = '"+applyJsonString+"' WHERE user_id='"+nick_P+"'"; 
		 		 await connection.query(user_query);
			
		
		 //있으면 추가
		 }else{
		    let user_query= "UPDATE user_db SET test_apply_project = json_array_append(test_apply_project,'$.apply_projects[0].apply_project_id','"+apply+"') WHERE user_id='"+nick_P+"'";	 
			 
			 //2번째 버전 let user_query= "UPDATE user_db SET test_like_project = json_array_append(test_like_project,'$.like_projects','"+newJsonString+"') WHERE user_id='"+pre_user+"'";	 
			 
			 await connection.query(user_query);
		  
		
		 }

        
         //query를 mysql에 입력하기
       
         //await connection.query(user_query);

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
const TESTsaveData = async(project_id, nickname_P)=>{
   try{
      const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
      
      try{
         await connection.beginTransaction(); //connection됐으면 transaction을 시작
         //query생성
		  
		  //solution1)json으로 시도
		 let apply = String(project_id);   
		 let apply_json = {
			 "apply_projects" :[
					 {"apply_project_id":apply}	 
				 
			 				  ]     
         
                        };
		 let new_json = {
			 "apply_project_id": apply
				 

         
		 };
		  

		 let applyJsonString =JSON.stringify(apply_json);
		 let newJsonString=JSON.stringify(new_json);
		  
		  //console.log(newJsonString,"뉴제이슨 스트링 확인")
        
        //데이터가 있는지 확인
        let aaa= "SELECT JSON_EXTRACT(test_apply_project,'$.apply_projects')AS TEST FROM user_db WHERE user_id='"+nickname_P+"'";
        //let aaa= "SELECT JSON_EXTRACT(test_like_project,'$.like_project_id') AS TEST FROM user_db WHERE user_id='"+pre_user+"'";
        
        let bbb = await connection.query(aaa);
		  //빈 값인지 확인하는 함수
		  //let ccc = JSON.stringify(bbb);
		  var isEmpty = function(value){
            if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){             
              return true                 
            }else{            
              return false      
          
            }
             
          };
		  //지금 값에 접근을 못하는 중..
		  console.log(isEmpty(bbb[0][0].TEST),"applyproject추가중")
		  
	     //데이터가 없으면 새로만들기
		 if(isEmpty(bbb[0][0].TEST)==true){
			  	 let user_query="UPDATE user_db SET test_apply_project = '"+applyJsonString+"' WHERE user_id='"+nickname_P+"'"; 
		 		 await connection.query(user_query);
			
		
		 //있으면 추가
		 }else{
		    let user_query= "UPDATE user_db SET test_apply_project = json_array_append(test_apply_project,'$.apply_projects[0].apply_project_id','"+apply+"') WHERE user_id='"+nickname_P+"'";	 
			 
			 //2번째 버전 let user_query= "UPDATE user_db SET test_like_project = json_array_append(test_like_project,'$.like_projects','"+newJsonString+"') WHERE user_id='"+pre_user+"'";	 
			 
			 await connection.query(user_query);
		  
		
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
         console.log(' [DB input error in <TESTsaveData> function] '+ err);
         return false;
         
      }
   }catch(err){
      console.log(' [DB connection error in <TESTsaveData> function] '+ err);
      return false;
      
   }
}
const TESTpartyData = async(project_id, nickname_P)=>{
   try{
      const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
      
      try{
         await connection.beginTransaction(); //connection됐으면 transaction을 시작
         //query생성
		  
		  //solution1)json으로 시도
		 let party = String(project_id);   
		 let party_json = {
			 "party_users" :[
					 {"party_user_id":party}	 
				 
			 				  ]     
         
                        };
		 let new_json = {
			 "party_user_id": party
				 

         
		 };
		  

		 let partyJsonString =JSON.stringify(party_json);
		 let newJsonString=JSON.stringify(new_json);
		  
		  //console.log(newJsonString,"뉴제이슨 스트링 확인")
        
        //데이터가 있는지 확인
        let aaa= "SELECT JSON_EXTRACT(test_nickname_P,'$.party_users')AS TEST FROM project_db WHERE project_id='"+project_id+"'";
        //let aaa= "SELECT JSON_EXTRACT(test_like_project,'$.like_project_id') AS TEST FROM user_db WHERE user_id='"+pre_user+"'";
        
        let bbb = await connection.query(aaa);
		  //빈 값인지 확인하는 함수
		  //let ccc = JSON.stringify(bbb);
		  var isEmpty = function(value){
            if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){             
              return true                 
            }else{            
              return false      
          
            }
             
          };
		  //지금 값에 접근을 못하는 중..
		  console.log(isEmpty(bbb[0][0].TEST),"참여자 이름 추가중")
		  
	     //데이터가 없으면 새로만들기
		 if(isEmpty(bbb[0][0].TEST)==true){
			  	 let user_query="UPDATE project_db SET test_nickname_P = '"+partyJsonString+"' WHERE project_id='"+project_id+"'"; 
		 		 await connection.query(user_query);
			
		
		 //있으면 추가
		 }else{
		    let user_query= "UPDATE project_db SET test_nickname_P = json_array_append(test_nickname_P,'$.party_users[0].party_user_id','"+party+"') WHERE project_id='"+project_id+"'";	 
			 
			 
			 await connection.query(user_query);
		  
		
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
         console.log(' [DB input error in <TESTpartyData> function] '+ err);
         return false;
         
      }
   }catch(err){
      console.log(' [DB connection error in <TESTpartyData> function] '+ err);
      return false;
      
   }
}
//관심등록 버튼 누르면 user_db에서 해당 사용자의 like_project 칼럼에 관심등록한 프로젝트 번호가 추가됨
const likeData = async(like_project_id,pre_user)=>{
   try{
      const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
      
      try{
         await connection.beginTransaction(); //connection됐으면 transaction을 시작
         //query생성
		  
		  //pre_user가 현재 사용자. like_project_id가 관심등록으로 추가되어야 할 id번호, like_project 칼럼이 해당 id번호가 추가되어야 할 칼럼.
           let flag;
		  
		//solution1)json으로 시도
		  
		 let like_json = {
			 "like_projects" :[
					 {"like_project_id":[like_project_id]}	 
				 
			 				  ]     
         
                        };
		 let new_json = {
			 "like_project_id": like_project_id
				 

         
		 };
		  

		 let likeJsonString =JSON.stringify(like_json);
		 let newJsonString=JSON.stringify(new_json);
		  
		  //console.log(newJsonString,"뉴제이슨 스트링 확인")
        
        //데이터가 있는지 확인
        let aaa= "SELECT JSON_EXTRACT(test_like_project,'$.like_projects')AS TEST FROM user_db WHERE user_id='"+pre_user+"'";
        //let aaa= "SELECT JSON_EXTRACT(test_like_project,'$.like_project_id') AS TEST FROM user_db WHERE user_id='"+pre_user+"'";
        
        let bbb = await connection.query(aaa);
		  //빈 값인지 확인하는 함수
		  //let ccc = JSON.stringify(bbb);
		  var isEmpty = function(value){
            if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){             
              return true                 
            }else{            
              return false      
          
            }
             
          };
		  //지금 값에 접근을 못하는 중..
		  console.log(isEmpty(bbb[0][0].TEST),"와라랄ㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹ라라")
		  
	     //데이터가 없으면 새로만들기
		 if(isEmpty(bbb[0][0].TEST)==true){
			
                
			     let user_query="UPDATE user_db SET test_like_project = '"+likeJsonString+"' WHERE user_id='"+pre_user+"'"; 
		 		 await connection.query(user_query);
			     flag=0;
			
		
		 //있으면 추가
		 }else{
			let str_like_project_id = String(like_project_id);
			 let check_query= "SELECT JSON_SEARCH(test_like_project,'one','"+str_like_project_id+"') AS TEST FROM user_db WHERE user_id='"+pre_user+"'";	  	 
			 let result =  await connection.query(check_query);
			 console.log(result[0][0].TEST,"이미 있는데이터인가요?????????")
			 if(result[0][0].TEST){
				 console.log('이미 해당 프로젝트를 관심으로 등록함');
				 flag=1;
			 }else{
				 let user_query= "UPDATE user_db SET test_like_project = json_array_append(test_like_project,'$.like_projects[0].like_project_id','"+like_project_id+"') WHERE user_id='"+pre_user+"'";	 		 			 
				 await connection.query(user_query);
				 flag=0;
			 }
		    
		  
		
		 }
		  
		  
		  //2번째 버전
		 //  console.log(bbb[0][0].TEST,"와라랄ㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹ라라")
		  
		 // //데이터가 없으면 새로만들기
		 // if(isEmpty(bbb[0][0].TEST)==true){
		 // let user_query="UPDATE user_db SET test_like_project = '"+likeJsonString+"' WHERE user_id='"+pre_user+"'"; 
		 // 		 await connection.query(user_query);
			
		
		 // //있으면 추가
		 // }else{
			 
		 // let user_query= "UPDATE user_db SET test_like_project = json_array_append(test_like_project,'$.like_projects','"+newJsonString+"') WHERE user_id='"+pre_user+"'";	 
			 
		 // await connection.query(user_query);
		  
		
		 // }
		
		  
		  //데이터 확인하는 구문
		  //  let ddd= "SELECT JSON_EXTRACT(test_like_project,'$.like_project_id[0]') FROM user_db WHERE user_id='"+pre_user+"'";
		  // let test = await connection.query(ddd);
		  // console.log(JSON.stringify(test),"잘 불러와지나요오오오옹");
		
        
        //solution2) json아닌 버전
		   // let aaa= "SELECT like_project FROM user_db WHERE user_id='"+pre_user+"'";
		   //  let bbb = await connection.query(aaa);
		  
		   // if (bbb){
		   // let user_query ="UPDATE user_db SET like_project= CONCAT_WS(',',like_project,'"+like_project_id+"') WHERE user_id ='"+pre_user+"'";
		   // 		await connection.query(user_query);
		   // }else{
		   // let user_query ="UPDATE user_db SET like_project= '"+like_project_id+"' WHERE user_id ='"+pre_user+"'";  
		   // await connection.query(user_query);
		   // }
		 
	
		 
         					
        
         //query를 mysql에 입력하기
       
         
		 

         await connection.release();
         //query를 mysql에 입력하기
         
         await connection.commit(); //입력한다고 끝나는게 아니라 커밋해야함.
         connection.release(); //연결 끊기. 불필요하게 mysql에 연결할 필요없으니까.
         console.log('이미 있는지 확인함');
		
         return [true,flag];
         
      }catch(err){
         await connection.rollback();//커밋에서 문제가 생기면 롤백. 방금 입력한 모든걸 취소하는 것. 안전하도록.카드결제 완료를 갑자기 취소하면, 임의로 넣은 정보를 다없앰. 롤백.
         connection.release();
         console.log(' [DB input error in <likeData> function] '+ err);
         return false;
         
      }
   }catch(err){
      console.log(' [DB connection error in <likeData> function] '+ err);
      return false;
      
   }
}

// const interestData = async(like_project_id,pre_user)=>{
//    try{
//       const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
      
//       try{
//          await connection.beginTransaction(); //connection됐으면 transaction을 시작
//          //query생성
		  
// 		  //pre_user가 현재 사용자. like_project_id가 관심등록으로 추가되어야 할 id번호, like_project 칼럼이 해당 id번호가 추가되어야 할 칼럼.

		  
// 		//solution1)json으로 시도
// 		  var isEmpty = function(value){
//             if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){             
//               return true                 
//             }else{            
//               return false      
          
//             }
             
//           };
		
// 		 let interest_json = {
//                interest_user_id: [pre_user]
         
//                         }
// 		 let interestJsonString=JSON.stringify(interest_json);
// 		  console.log(interestJsonString);
        
//         //데이터가 있는지 확인
//         let aaa= "SELECT JSON_EXTRACT(test_interest_user,'$.interest_user_id') AS TEST FROM project_db WHERE project_id='"+like_project_id+"'";
       
//         //let aaa= "SELECT new_interest_user FROM project_db WHERE project_id='"+like_project_id+"'";
//         let bbb = await connection.query(aaa);
// 		let ccc = JSON.stringify(bbb); 
		 
		
	
		
// 	     //데이터가 없으면 새로만들기
//    		 if(isEmpty(ccc[0])==true){
// 			  let user_query="UPDATE project_db SET test_interest_user = '"+interestJsonString+"' WHERE project_id='"+like_project_id+"'"; 
// 		 		 await connection.query(user_query);
			 
			   
// 		 //있으면 추가
// 		 }else{
// 			 let user_query= "UPDATE project_db SET test_interest_user = json_array_append(test_interest_user,'$.interest_user_id','"+pre_user+"') WHERE project_id='"+like_project_id+"'";	 
// 			    await connection.query(user_query);
				
			
			    
// 		 }
		
				
        
//          //query를 mysql에 입력하기
       
         
		 

//          await connection.release();
//          //query를 mysql에 입력하기
         
//          await connection.commit(); //입력한다고 끝나는게 아니라 커밋해야함.
//          connection.release(); //연결 끊기. 불필요하게 mysql에 연결할 필요없으니까.
//          console.log('successfully saved');
		
//          return true;
         
//       }catch(err){
//          await connection.rollback();//커밋에서 문제가 생기면 롤백. 방금 입력한 모든걸 취소하는 것. 안전하도록.카드결제 완료를 갑자기 취소하면, 임의로 넣은 정보를 다없앰. 롤백.
//          connection.release();
//          console.log(' [DB input error in <interestData> function] '+ err);
//          return false;
         
//       }
//    }catch(err){
//       console.log(' [DB connection error in <interestData> function] '+ err);
//       return false;
      
//    }
// }
   

const searchData = async (search_input) => {	
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			// query 생성
			let search_query = '';
			
			search_query= "SELECT agree_user,project_id,title,category,descript_S,descript_L,phone_num,team_max_num,status,team_present_num,tags,nickname_H,nickname_P,test_image FROM project_db WHERE title OR tags LIKE " +connection.escape('%'+search_input+'%');
				
			//and조건문. 찾아보기
			
			// query를 mysql에 입력하기
			let tmp = [];
			[tmp] = await connection.query(search_query);
			
		
			console.log('키워드가 검색되는중');
			
		
			await connection.commit();
			connection.release();
			console.log('test4');
			console.log("키워드가 검색되었습니당")
			return [true, tmp];
		}
		catch(err) {
			await connection.rollback();
			connection.release();
			console.log("[DB input error in <totalData> function] " + err);
			return [false];
		}
	}
	catch(err) {
		console.log("[DB connection error in <totalData> function] " + err);
		return [false];
	}
}
const totalData = async (user_id) => {	
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			// query 생성
			let select_user_query = '';
			
			if (user_id === null)
				select_user_query = "SELECT * FROM user_db LIMIT 0, 10";
			else
				
				select_user_query = "SELECT user_num,nickname,mbti,user_image FROM user_db WHERE user_id='"+user_id+"'";
			
			// query를 mysql에 입력하기
			let tmp = [];
			[tmp] = await connection.query(select_user_query);
			
		
			console.log('test3sdffffffffffffffff');
			console.log(tmp,"tmp출력가즈아아아");
		
			await connection.commit();
			connection.release();
			console.log('test4');
			console.log("successfully saved!")
			return [true, tmp];
		}
		catch(err) {
			await connection.rollback();
			connection.release();
			console.log("[DB input error in <totalData> function] " + err);
			return [false];
		}
	}
	catch(err) {
		console.log("[DB connection error in <totalData> function] " + err);
		return [false];
	}
}

const hostData = async (host_id) => {	
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			// query 생성
			let select_user_query = '';
			
			if (host_id === null)
				select_user_query = "SELECT * FROM user_db LIMIT 0, 10";
			else
				select_user_query = "SELECT user_num,nickname,mbti,user_image FROM user_db WHERE user_id = '"+ host_id +"'";
			
			// query를 mysql에 입력하기
			let tmp = [];
			[tmp] = await connection.query(select_user_query);
			
		
			console.log('test3sdffffffffffffffff');
			//console.log(tmp);
		
			await connection.commit();
			connection.release();
			console.log('test4');
			console.log("successfully 호스트 데이터 불러옴!")
			return [true, tmp];
		}
		catch(err) {
			await connection.rollback();
			connection.release();
			console.log("[DB input error in <hostData> function] " + err);
			return [false];
		}
	}
	catch(err) {
		console.log("[DB connection error in <hostData> function] " + err);
		return [false];
	}
}
const USERData = async (user_num) => {	
	try {
		const connection = await conn.getConnection(async conn=>conn);
		try {
			await connection.beginTransaction();
			
			// query 생성
			let select_user_query = '';
			
			if (user_num === null)
				select_user_query = "SELECT link_portfolio,project_history,nickname, age, phone, mbti, position, introduction, major, portfolio_name, portfolio_detail, portfolio_file, user_image,club FROM user_db WHERE user_num = '"+ user_num +"'";
			else
				select_user_query = "SELECT link_portfolio,project_history,nickname, age, phone, mbti, position, introduction, major, portfolio_name, portfolio_detail, portfolio_file, user_image,club FROM user_db WHERE user_num = '"+ user_num +"'";
			
			// query를 mysql에 입력하기
			let tmp = [];
			[tmp] = await connection.query(select_user_query);
			
		
			console.log('test3sdffffffffffffffff');
			console.log(tmp);
		
			await connection.commit();
			connection.release();
			console.log('test4');
			console.log("successfully saved!")
			return [true, tmp];
		}
		catch(err) {
			await connection.rollback();
			connection.release();
			console.log("[DB input error in <USERData> function] " + err);
			return [false];
		}
	}
	catch(err) {
		console.log("[DB connection error in <USERData> function] " + err);
		return [false];
	}
}
const stateData = async(project_id)=>{
	try{
		const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
		
		try{
			await connection.beginTransaction(); //connection됐으면 transaction을 시작
			//query생성.이건 그냥 이런거 보여줄거다 하는 안내문이고
			let state_query = '';  //join_db로 부터 다음의 네가지를 받아오겠다.별표는 모든걸 받아오겠다는것.
			if (project_id === null)
				state_query = "SELECT * FROM project_db LIMIT 0, 10";   //id가 null이면 다 받아오고.
			else
				state_query = "SELECT * FROM project_db WHERE project_id ='" + project_id +"'";   //id에 해당하는 값을 받아온다는 것.
		
			//query의 결과를 tmp에 넣기
			let tmp=[];
			[tmp] = await connection.query(state_query);
			await connection.commit();
			await connection.release();
			
			//console.log(tmp); //여기서 출력하는게 우리가 실질적으로 보고 싶어하는 그 받아온 데이터 결과.
			console.log('successfully status loaded');
			
			return [true,tmp];
			
		}catch(err){
			await connection.rollback();//커밋에서 문제가 생기면 롤백. 방금 입력한 모든걸 취소하는 것. 안전하도록.카드결제 완료를 갑자기 취소하면, 임의로 넣은 정보를 다없앰. 롤백.
			connection.release();
			console.log(' [DB output error in <stateData> function] '+ err);
			return [false];
			
		}
	}catch(err){
		console.log(' [DB connection error in <stateData> function] '+ err);
		return [false];
		
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
	//console.log(results);

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
module.exports = router;