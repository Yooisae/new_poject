var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
var connInfo = require('./db/db_login_info').dev; //개발자에 관한 정보라는것. dev로 정의해놔서.이름은 바꿔도됨.db_login_info를 통해 내가 만든 db의 정보를 가져오는것.

//mysql setting//
var conn = mysql.createPool(connInfo);

/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('signin2_copy1');
});



router.post('/interfaceUpdate2', async function(req, res){
	let studentID = req.body.studentID;
	let pw1 = req.body.pw1;
	let interests = req.body.interests;
	let nickname = req.body.nickname;
	let mbti = req.body.mbti;  //front에서 보낸거 받아옴.여기는 백엔드.
	let project = req.body.project;
	


	//변수를 mysql에 저장
	//저장된 결과가 성공적이면 flag변수에 1넣기
	//mysql에 저장 실패하면 flag에 0을 넣음
	
	let results = await saveData(studentID,pw1,interests,mbti,nickname,project,);  //여기 await안하면 results안들어갔는데, 그냥 다음으로 넘어가서 실패했는데도 성공했다뜸.
	
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

//JSON.data2(localStorage.getItem("data2));



//functions//

const saveData = async(studentID,pw1,interests,mbti,nickname,project)=>{
	try{
		const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
		
		try{
			await connection.beginTransaction(); //connection됐으면 transaction을 시작
			//query생성
			let insert_query = "INSERT INTO user_db (user_id,user_pw,interest,mbti,nickname,position) VALUES ('" + studentID+ "','" + pw1 + "','" + interests + "','" + mbti+"','" + nickname + "','" + project + "')";  //들어갈때 워크벤치 양식에 맞게
			//let insert_query = "INSERT INTO user_test3_db (user_id,user_pw,interest,mbti,nickname,position) VALUES ('오','오','오','오','오','오')";
		
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

router.post('/checkNickname', async function(req, res){
	let nickname = req.body.nickname;
	


	//변수를 mysql에 저장
	//저장된 결과가 성공적이면 flag변수에 1넣기
	//mysql에 저장 실패하면 flag에 0을 넣음
	
	let results = await checkNickname(nickname);  //여기 await안하면 results안들어갔는데, 그냥 다음으로 넘어가서 실패했는데도 성공했다뜸.
	let data=[];
	let flag;
	if (results[0] === true){
		data= results[1];
	    flag = 1;	
	} else{
		flag = 0 ;
	}
		
	
-
	res.json({
	    'data':data,
		'flag':flag
	})
});

const checkNickname = async(nickname)=>{
	try{
		const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
		
		try{
			await connection.beginTransaction(); //connection됐으면 transaction을 시작
			//query생성
			let user_query =  "SELECT nickname FROM user_db WHERE nickname ='"+nickname+"'";
			//let insert_query = "INSERT INTO user_test3_db (user_id,user_pw,interest,mbti,nickname,position) VALUES ('오','오','오','오','오','오')";
		
			
			//query를 mysql에 입력하기
			let aaa= await connection.query(user_query);
			await connection.release();
			//query를 mysql에 입력하기
			
			await connection.commit(); //입력한다고 끝나는게 아니라 커밋해야함.
			connection.release(); //연결 끊기. 불필요하게 mysql에 연결할 필요없으니까.
			console.log('successfully saved');
			return [true,aaa];
			
		}catch(err){
			await connection.rollback();//커밋에서 문제가 생기면 롤백. 방금 입력한 모든걸 취소하는 것. 안전하도록.카드결제 완료를 갑자기 취소하면, 임의로 넣은 정보를 다없앰. 롤백.
			connection.release();
			console.log(' [DB input error in <checkNickname> function] '+ err);
			return [false];
			
		}
	}catch(err){
		console.log(' [DB connection error in <checkNickname> function] '+ err);
		return [false];
		
	}
}


module.exports = router;