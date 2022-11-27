

///////////////////
var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
var connInfo = require('./db/db_login_info').dev; //개발자에 관한 정보라는것. dev로 정의해놔서.이름은 바꿔도됨.db_login_info를 통해 내가 만든 db의 정보를 가져오는것.

//mysql setting//
var conn = mysql.createPool(connInfo);
/////////

var multer= require('multer');

// var path= require('path');

var fs = require('fs');

// const image = document.getElementById('image');
// image.src="image.jpg";




var _storage = multer.diskStorage({
	//어느 디렉토리에 저장
  destination(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  //어떤 이름으로 저장할 건지
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload=multer({storage:_storage, limits: { fileSize: 5 * 1024 * 1024 }});

// var limits = { fileSize: 5 * 1024 * 1024 };

// var multerConfig = {
//   storage,
//   limits
// };

// var upload = multer(multerConfig);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('new_project_registration');
});

// image업로드
// router.post("/projectUpdate",upload.single("image"),async (req,res,next)=>{
// 	let user_id = req.body.user_id;
//    let tag = req.body.tag;
//    let title = req.body.title;
//    let Description = req.body.Description;
//    let Description_L = req.body.Description_L;
//    let category = req.body.category;
//     let phoneNumber = req.body.phoneNumber;
//    let teamNumber = req.body.teamNumber;
	
// 	let image ="/images/${req.file.filename}";
	
// 	var sql= "INSERT INTO project_db (title,descript_S,category,team_max_num,tags,phone_num,nickname_H,test_image) VALUES ('"+ title + "','"+ Description +"',"+ category +","+teamNumber+",'"+tag+"','"+phoneNumber+"','"+user_id+"','"+image+"')";
// 	connection.query(sql,(err,rows)=>{
// 		if(err){
// 		    console.log("err:"+err);	
// 		}else{
// 			console.log("rows:"+JSON.stringify(rows));
// 			res.redirect("/new_project_registration");
			
// 		}
// 	});      
	
// });


router.post('/projectUpdate',upload.any(),async function(req, res, next){
  

	// console.log(req.body,req.files[0],"다 출력해보쟈아ㅏ아ㅏ")
	// console.log(req.body.title,"레크 쩜 바디 출력");
	// console.log(req.files[0].filename,"레크 쩜 파일 출력");
   let nickname_H =req.body.user_id;
   let image ="/uploads/"+req.files[0].filename;
	//console.log(req.files[0],"이미지 아ㅏㅏㅏㅏㅏㅏㅏㅏㅏ");
   let tag = req.body.tag;
   let title = req.body.title;
   let Description = req.body.Description;
   let Description_L = req.body.Description_L;
   let OpenChat = req.body.OpenChat;
   let ContestLink = req.body.ContestLink;
	
	console.log(ContestLink,"콘테스트 링크 출력")
   // let category = req.body.category;
	
	let inputID= req.body.inputID;
	let domain_txt = req.body.domain_txt;
	let domain_list= req.body.domain_list;
	
	let phoneNumber;
	if(domain_txt==undefined){
		phoneNumber=inputID+domain_list;
	}else{
	    phoneNumber=inputID+domain_txt;

	}
	
   
   let teamNumber = req.body.teamNumber;
	let inputType = req.body.radio;
   
	let inputDepart = req.body.inputDepart;
	//let inputTopic = req.body.inputTopic;
	let testTopic = req.body.select2_Test;
	
	console.log(testTopic,"테스트 토픽출력합니다");
   // let tags = req.body.tags;//front에서 보낸거 받아옴.여기는 백엔드.

   
   //변수를 mysql에 저장
   //저장된 결과가 성공적이면 flag변수에 1넣기
   //mysql에 저장 실패하면 flag에 0을 넣음
   
	 let results = await saveData(title,Description,Description_L,teamNumber,tag,phoneNumber,nickname_H,image,inputType,inputDepart,testTopic,OpenChat,ContestLink);  //여기 await안하면 results안들어갔는데, 그냥 다음으로 넘어가서 실패했는데도 성공했다뜸.
   
   
	 let flag;
	   let data = [];
	 if (results[0] === true){
	  flag = 1;
	   data=results[1];
	 } else{
	   
	 flag = 0 ;  
	 } 
   

	console.log(results);
	console.log("testtefaa");
	
	 res.json({
	 'data':data,
	 'image':image,
	 'message':'returned', //아무튼 리턴 됏다. 결과가 보내지긴 함. flag가 0이면 실패인거고
	 'flag':flag
	 });
});

// router.post('/projectUpdate',async function(req, res, next){

 
//    let nickname_H = req.body.user_id;
//    let image = req.body.image;

//    let tag = req.body.tag;
//    let title = req.body.title;
//    let Description = req.body.Description;
//    let Description_L = req.body.Description_L;
//    let category = req.body.category;
//     let phoneNumber = req.body.phoneNumber;
//    let teamNumber = req.body.teamNumber;
//    // let tags = req.body.tags;//front에서 보낸거 받아옴.여기는 백엔드.

   
//    //변수를 mysql에 저장
//    //저장된 결과가 성공적이면 flag변수에 1넣기
//    //mysql에 저장 실패하면 flag에 0을 넣음
   
//    let results = await saveData(title,Description,category,teamNumber,tag,phoneNumber,nickname_H,image);  //여기 await안하면 results안들어갔는데, 그냥 다음으로 넘어가서 실패했는데도 성공했다뜸.
   
   
//    let flag;
// 	   let data = [];
//    if (results[0] === true){
// 	  flag = 1;
// 	   data=results[1];
//    } else{
	   
// 	 flag = 0 ;  
//    } 
   


	
//     res.json({
//        'data':data,
//        'image':image,
//        'message':'returned', //아무튼 리턴 됏다. 결과가 보내지긴 함. flag가 0이면 실패인거고
//        'flag':flag
//     });
// });




// router.post('/projectUpdate',async function(req, res, next){

 
//    let nickname_H = req.body.user_id;
//    let image = req.body.image;

//    let tag = req.body.tag;
//    let title = req.body.title;
//    let Description = req.body.Description;
//    let Description_L = req.body.Description_L;
//    let category = req.body.category;
//     let phoneNumber = req.body.phoneNumber;
//    let teamNumber = req.body.teamNumber;
//    // let tags = req.body.tags;//front에서 보낸거 받아옴.여기는 백엔드.

   
//    //변수를 mysql에 저장
//    //저장된 결과가 성공적이면 flag변수에 1넣기
//    //mysql에 저장 실패하면 flag에 0을 넣음
   
//    let results = await saveData(title,Description,category,teamNumber,tag,phoneNumber,nickname_H,image);  //여기 await안하면 results안들어갔는데, 그냥 다음으로 넘어가서 실패했는데도 성공했다뜸.
   
   
//    let flag;
// 	   let data = [];
//    if (results[0] === true){
// 	  flag = 1;
// 	   data=results[1];
//    } else{
	   
// 	 flag = 0 ;  
//    } 
   


	
//     res.json({
//        'data':data,
//        'image':image,
//        'message':'returned', //아무튼 리턴 됏다. 결과가 보내지긴 함. flag가 0이면 실패인거고
//        'flag':flag
//     });
// });



//function//


//이거 써야도애ㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐ
// const saveData = async(title,Description,category,teamNumber,tag,phoneNumber,nickname_H,image)=>{
//    try{
//       const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
      
//       try{
//          await connection.beginTransaction(); //connection됐으면 transaction을 시작
//          //query생성
//          let insert_query = "INSERT INTO project_db (title,descript_S,category,team_max_num,tags,phone_num,nickname_H,test_image) VALUES ('"+ title + "','"+ Description +"',"+ category +","+teamNumber+",'"+tag+"','"+phoneNumber+"','"+nickname_H+"','"+image+"')";  //들어갈때 워크벤치 양식에 맞게
//          //register_project에는 새로 등록하는 프로젝트 id가 들어가야함. nickname은 현재 로그인해서 새로 프로젝트 등록하려는 사람의 닉네임이고, 이 닉네임에 해당하는 사람의 project를 업뎃하는것.
       
//        	 let last_id= await connection.query(insert_query);				
        
//          //query를 mysql에 입력하기
//          // let last_query ="SELECT LAST_INSERT_ID() FROM project_db";
//          // let last_id= await connection.query(last_query);	
// 		  //console.log(last_id);
		  
//          await connection.release();
//          //query를 mysql에 입력하기
         
//          await connection.commit(); //입력한다고 끝나는게 아니라 커밋해야함.
       
//          console.log('successfully saved');
		
//          return [true,last_id];
         
//       }catch(err){
//          await connection.rollback();//커밋에서 문제가 생기면 롤백. 방금 입력한 모든걸 취소하는 것. 안전하도록.카드결제 완료를 갑자기 취소하면, 임의로 넣은 정보를 다없앰. 롤백.
//          connection.release();
//          console.log(' [DB input error in <saveData> function] '+ err);
//          return [false];
         
//       }
//    }catch(err){
//       console.log(' [DB connection error in <saveData> function] '+ err);
//       return [false];
      
//    }
// }

const saveData = async(title,Description,Description_L,teamNumber,tag,phoneNumber,nickname_H,image,inputType,inputDepart,testTopic,OpenChat,ContestLink)=>{
   try{
      const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
      console.log('aaa');
      try{
         await connection.beginTransaction(); //connection됐으면 transaction을 시작
         //query생성
         let insert_query = "INSERT INTO project_db (title,descript_S,descript_L,team_max_num,tags,phone_num,nickname_H,test_image,project_type,department,detail_topic,open_chat,contest_link) VALUES ('"+ title + "','"+ Description +"','"+ Description_L +"','"+teamNumber+"','"+tag+"','"+phoneNumber+"','"+nickname_H+"','"+image+"','"+inputType+"','"+inputDepart+"','"+testTopic+"','"+OpenChat+"','"+ContestLink+"')";  //들어갈때 워크벤치 양식에 맞게       
       	 let last_id= await connection.query(insert_query);				
        
         //query를 mysql에 입력하기
         // let last_query ="SELECT LAST_INSERT_ID() FROM project_db";
         // let last_id= await connection.query(last_query);	
		  console.log(last_id);
		  
         await connection.release();
         //query를 mysql에 입력하기
         
         await connection.commit(); //입력한다고 끝나는게 아니라 커밋해야함.
       
         console.log('successfully saved');
		
         return [true,last_id];
         
      }catch(err){
         await connection.rollback();//커밋에서 문제가 생기면 롤백. 방금 입력한 모든걸 취소하는 것. 안전하도록.카드결제 완료를 갑자기 취소하면, 임의로 넣은 정보를 다없앰. 롤백.
         connection.release();
         console.log(' [DB input error in <saveData> function] '+ err);
         return [false];
         
      }
   }catch(err){
      console.log(' [DB connection error in <saveData> function] '+ err);
      return [false];
      
   }
}

router.post('/user_register_update',async function(req, res, next){

 
   let user_id = req.body.user_id;
   let register_id = req.body.last_project_id;
  
 
   
   let results = await registerData(user_id,register_id);  //여기 await안하면 results안들어갔는데, 그냥 다음으로 넘어가서 실패했는데도 성공했다뜸.
   
   
   let flag;
	   let data = [];
   if (results === true){
	   flag = 1;
	   
   } else{
	   
	 flag = 0 ;  
   } 
   


	
    res.json({
       'message':'returned', //아무튼 리턴 됏다. 결과가 보내지긴 함. flag가 0이면 실패인거고
       'flag':flag
    });
});

const registerData = async(user_id,register_id)=>{
   try{
      const connection = await conn.getConnection(async conn=>conn); //getConnection에 의해서 conn의 값이 바뀜. 받아오는 거니까.커넥션이 됐다 안됐다의 정보가 들어옴.
      
      try{
         await connection.beginTransaction(); //connection됐으면 transaction을 시작
          let aaa= "SELECT register_project FROM user_db WHERE user_id='"+user_id+"'";
		   let bbb = await connection.query(aaa);
		  
		   if (bbb){
		   let user_query ="UPDATE user_db SET register_project= CONCAT_WS(',',register_project,'"+register_id+"') WHERE user_id ='"+user_id+"'";
		   await connection.query(user_query);
		    }else{
		     let user_query ="UPDATE user_db SET register_project= '"+register_id+"' WHERE user_id ='"+user_id+"'";  
		    await connection.query(user_query);
		    }
		 
		  
         await connection.release();
         //query를 mysql에 입력하기
         
         await connection.commit(); //입력한다고 끝나는게 아니라 커밋해야함.
       
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
