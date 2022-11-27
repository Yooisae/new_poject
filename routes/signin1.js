var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
var connInfo = require('./db/db_login_info').dev; //개발자에 관한 정보라는것. dev로 정의해놔서.이름은 바꿔도됨.db_login_info를 통해 내가 만든 db의 정보를 가져오는것.

//mysql setting//
var conn = mysql.createPool(connInfo);

/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('signin1');
});



router.post('/interfaceUpdate', async function(req, res){
	let studentID = req.body.studentID;
	let pw = req.body.pw;
	let interests = req.body.interests;  //front에서 보낸거 받아옴.여기는 백엔드.


	//변수를 mysql에 저장
	//저장된 결과가 성공적이면 flag변수에 1넣기
	//mysql에 저장 실패하면 flag에 0을 넣음
	
	let results = await saveData(studentID,pw,interests);  //여기 await안하면 results안들어갔는데, 그냥 다음으로 넘어가서 실패했는데도 성공했다뜸.
	
	let flag;
	if (results === true) flag = 1;
	else flag = 0 ;
	

	let data = []
	res.json({
		'data':data,
		'message':'returned', //아무튼 리턴 됏다. 결과가 보내지긴 함. flag가 0이면 실패인거고
		'flag':flag
	})
});

router.get('/interfacePhoto',function(req, res, next){
	res.render('interface_photo');
		   
		   });
router.post('/interfacePhotoSave',function(req,res){
	let img = req.body.img;
	console.log(img);
	
	//여기에 mysql을 두어서 img파일을 저장하면 됩니다. 이상하게 엄청 긴 글자.jpg같은 형식이아니라. 그리고 난서 그걸 다시 불러와서 json을 통해 data변수하나 만들고 프론트로 보내면 뜨는것.
	res.json({});
	
});



//functions//

const saveData = async(studentID,pw,interests)=>{
	try{
		const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
		
		try{
			await connection.beginTransaction(); //connection됐으면 transaction을 시작
			//query생성
			let insert_query = "INSERT INTO user_test_db (id,pw,interests) VALUES ('"+ studentID+"',PASSWORD('" + pw + "'),'" + interests+"')";  //들어갈때 워크벤치 양식에 맞게
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
	
		//추가
		
	const userInfo = (studentID)=>{
		id: studentID;
	}

	const aTag = document.querySelector('a');
	aTag.addEventListener('click', () => {
	  localStorage.setItem("user-info", JSON.stringify(userInfo));
	});
		
	}
}




router.post('/showDataList',async function(req, res){  //여기서 받는 것. 데이터를. dataload.ejs에 도큐먼트가 레디다자 마자 post타입으로 데이터를 보냄.
	
	//추가
	//const {id} = JSON.parse(localStorage.getItem("user-info"));
	//localStorage.remove("user-info");
	//console.log(id); // 아이디 이름 비밀번호
	
	let data= [];
	let flag;
	//3.mysql에서 데이터 받기.로드데이타 함수를 만들어서 데이터 받아옴.저번에 세이브 데이터 함수 만든 것처럼.
	let results=[];
	let id ='jicong';
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
			'age':'',
			'phone':'',
			'mbti':'',
			'position':'',
			'introduction':'',
			'certification':'',
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
				select_query = "SELECT*  FROM user_db";   //id가 null이면 다 받아오고.
			else
				//select_query = "SELECT nickname, age, phone, mbti, position, introduction, certification, portfolio_name, portfolio_detail, portfolio_file FROM user_db WHERE user_id ='" + id +"'";   //id에 해당하는 값을 받아온다는 것.
				//select_query = "SELECT * FROM user_db WHERE user_id ='" + id +"'";   //id에 해당하는 값을 받아온다는 것.
				select_query = "SELECT*  FROM user_db"; 
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










//localStorage.setItem("data2", JSON.stringify(data2));
//localStorage.setItem("key", value);



module.exports = router;