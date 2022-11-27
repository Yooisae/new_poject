var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
var connInfo = require('./db/db_login_info').dev; 


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
	
	if (results[0]){ 
		data = results[1];
		flag=1;
	}
	else{
		data=[{'id': '',
			   'name': '',
			   'title': '',
			   'content': ''}];    
		flag=0;
	}
	
	res.render('contentview',
			   {
		'data':data,
		'flag':flag
	});	   

});


router.post('/bbslist', async function(req, res) {
	let data= [];
	let flag;
	let results=[];
	let id= null;
	results = await loadData(id);
	let postID = req.body.postID;
	let name = req.body.name;
	let title = req.body.title;
	
	if (results[0]){ 
		data = results[1];
		flag=1;
	}
	else{
		data=[{'id': '',
			   'name': '',
			   'title': '',
			  }];    
		flag=0;
	}

	res.json({
		'data':data,
		'flag':flag
	});
  
});

const loadData = async(id)=>{
	try{
		const connection = await conn.getConnection(async conn=>conn); 
		
		try{
			await connection.beginTransaction(); 
			let select_query = '';  
			if (id === null)
				select_query = "SELECT id,name,title,content FROM platform_db";   
			else
				select_query = "SELECT id,name,title,content FROM platform_db WHERE id ='" + id +"'";  
			console.log(select_query);
			let tmp=[];
			[tmp] = await connection.query(select_query);
			await connection.commit();
			await connection.release();
			
			console.log(tmp); 
			console.log('successfully loaded');
			
			return [true,tmp];
			
		}catch(err){
			await connection.rollback();
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