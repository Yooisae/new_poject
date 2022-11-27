var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
var connInfo = require('./db/db_login_info').dev; //개발자에 관한 정보라는것. dev로 정의해놔서.이름은 바꿔도됨.db_login_info를 통해 내가 만든 db의 정보를 가져오는것.

//mysql setting//
var conn = mysql.createPool(connInfo);



//get-어떤 페이지를 여는것.

router.get('/',function(req, res){
	res.render('my_profile_view');
		   
});


//post
router.post('/showDataList',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	//추가
	//const {id} = JSON.parse(localStorage.getItem("user-info"));
	//localStorage.remove("user-info");
	//console.log(id); // 아이디 이름 비밀번호
	
	let data= [];
	let flag;
	//3.mysql에서 데이터 받기.로드데이타 함수를 만들어서 데이터 받아옴.저번에 세이브 데이터 함수 만든 것처럼.
	let results=[];
	let id = req.body.user_id;


	results = await loadData(id);//보내는게 없으면 속이 비워져 있음.

	console.log(results);
	//results에 받아온걸 data에 넣어서 보내야함.
	//results[0] = true or false
	//results[1] =[~~~] 즉,tmp 데이터 자체
	if (results[0]){ //if true
		data = results[1];
		flag=1;
	}
	else{//if false
		data=[{'nickname': '',
			'photo' : '',
			'age':'',
			'phone':'',
			'mbti':'',
			'position':'',
			'introduction':'',
			'major':'',
			'portfolio_name':'',
			'portfolio_detail':'',
			'portfolio_file':'',}];    //내용이 없더라도 json에서 플래그랑 데이터 둘다 보내기 때문에 빈거라도 보냄.가짜로
		flag=0;
	}
	//results[0]// true또는 false가 들어있음
	
	//results[1]//이건 tmp도 받아왔다는 것. 어레이가 두개일 경우만 이게 존재.
	
	
	
	//4.받은 데이터를 ajax를 통해서 fron-end(ejs파일로) 보내기
	
	
	
	res.json({
		'data':data,
		'flag':flag
	});
		   
});
//functions//

const loadData = async(id)=>{
	try{
		const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
		
		try{
			await connection.beginTransaction(); //connection됐으면 transaction을 시작
			//query생성.이건 그냥 이런거 보여줄거다 하는 안내문이고
			let select_query = '';  //join_db로 부터 다음의 네가지를 받아오겠다.별표는 모든걸 받아오겠다는것.
			if (id === null)
				select_query = "SELECT link_portfolio,project_history,nickname, age, phone, mbti, position, introduction, major, portfolio_name, portfolio_detail, portfolio_file, user_image,club,semester FROM user_db";   //id가 null이면 다 받아오고.
			else
				select_query = "SELECT link_portfolio,project_history,nickname, age, phone, mbti, position, introduction, major, portfolio_name, portfolio_detail, portfolio_file, user_image,club,semester FROM user_db WHERE user_id ='" + id +"'";   //id에 해당하는 값을 받아온다는 것.
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
module.exports = router;