var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
var connInfo = require('./db/db_login_info').dev; //개발자에 관한 정보라는것. dev로 정의해놔서.이름은 바꿔도됨.db_login_info를 통해 내가 만든 db의 정보를 가져오는것.

//mysql setting//
var conn = mysql.createPool(connInfo);



router.get('/', function(req, res, next) {
  res.render('listview');
});

router.get('/view/:article_id', async function(req, res) {
   let data= [];
	let flag;
	
	let results=[];
	let id = req.params.article_id;
	results = await loadData(id);
	
	if (results[0]){ //if true
		data = results[1];
		flag=1;
	}
	else{//if false
		data=[{'id': '',
			   'name': '',
			   'title': '',
			   'content': ''}];    
		flag=0;
	}
	
	//4.받은 데이터를 ajax를 통해서 front-end(ejs)로 보내기 dataContent.ejs
	res.render('contentview',
			   {
		'data':data,
		'flag':flag
	});
		   

});


router.post('/bbslist', async function(req, res) {
	let data= [];
	let flag;
	
	//3.mysql에서 데이터 받기.로드데이타 함수를 만들어서 데이터 받아옴.저번에 세이브 데이터 함수 만든 것처럼.
	let results=[];
	let id= null;
	results = await loadData(id);//보내는게 없으면 속이 비워져 있음.
	
	let postID = req.body.postID;
	let name = req.body.name;
	let title = req.body.title;
	
	  //front에서 보낸거 받아옴.여기는 백엔드.
	
	if (results[0]){ //if true
		data = results[1];
		flag=1;
	}
	else{//if false
		data=[{'id': '',
			   'name': '',
			   'title': '',
			  }];    //내용이 없더라도 json에서 플래그랑 데이터 둘다 보내기 때문에 빈거라도 보냄.가짜로
		flag=0;
	}
	
	
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
				select_query = "SELECT id,name,title,content FROM platform_db";   //id가 null이면 다 받아오고.
			else
				select_query = "SELECT id,name,title,content FROM platform_db WHERE id ='" + id +"'";   //id에 해당하는 값을 받아온다는 것.
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
		console.log(' [DB connection error in <loadData> function] '+ err);
		return [false];
		
	}
}

module.exports = router;