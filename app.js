var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs=require('ejs');
var Pool=require('pg').Pool;
var crypto=require('crypto');
var multer=require('multer');
var session=require('express-session');
	
var app = express();

//app.use('/static', express.static(path.join('localhost:3000', 'public')));

/*********************************************************/
    const config={
	database:'rajasthan',
	user:'murari' ,                                         //configuration object
 	port:'5432',
	password:'ajay15'
}


const multerconfig={
	                 storage:multer.diskStorage({
						 destination:function(req,file,next){
						 next(null,'./public/images');
					 },  filename:function(req,file,next){
						 next(null,file.originalname);
					 }   
                   }),
				   filefilter:function(req,file,next){
					   next(null,true);
                  }};
/******************************************************/
var pool=new Pool(config);
/*************************************************************/

function hash(secret,salt)
{
	var hashed= crypto.pbkdf2Sync(secret, salt, 100000, 512, 'sha512');             //Function to create hashed password
	return ['pbkdf2','10000',salt,hashed.toString('hex')].join('$');
}



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
	pool.query('select name from packages',function(err,result){
		if(err){ res.render('message',{mes:err});}
		else{  console.log(result.rows);
			res.render('project',{pack:result.rows});          
		}
	})
	                             //    '/'   path   rendering
});
app.post('/feedback', function(req, res){
	console.log(req.body);
	pool.query('insert  into feedback(name, email_id, feed_back)  values($1,$2,$3)',[req.body.name, req.body.email, req.body.feedback], function(err, result){
		if(err)
			res.send(err);
	});
});

app.get('/stud_package', function(req, res){
	res.render('student');
});

app.get('/try',(req,res)=>{res.render('try')})

app.post('/submit', function(req, res){
	pool.query('insert into student_pack (hotel, image,address, name) values($1,$2,$3,$4);',[req.body.hotel, req.body.image,  req.body.address,  req.body.name], function(err, result){
		if(err)
			res.send(err);
		else
			res.send('DATA ENTERED');
	});
});


app.get('/spack', function(req, res){
	pool.query('select * from student_pack', function(err, resul){
		if(err)
			res.send(err)
		else{
			console.log(resul.rows);
			res.render('city',{mt:resul.rows});
		}
		});
});
app.post('/login',function(req,res){
	console.log(req.body)
	pool.query("select * from signup where email= $1",[req.body.Email],function(err,result){
		if(err)
		{
		res.send(err);	
		}
		else{
			console.log(result.rows[0]);
			if(result.rows[0]){
				var salt=result.rows[0].password.split('$')[2];
				var check=hash(req.body.password,salt);
				if(result.rows[0].password==check){
					res.render('message',{mes:'Log In SucessFull'});
				}else{
					res.render('message',{mes:'User Name Or PassWord InCorrect'});
				}
			}
			else{res.render('message',{mes:'No Such user'});}
		}
	});
});

app.get('/jwel',(req,res)=>{
	res.render('jwell');
});

app.get('/paint',(req,res)=>{
	res.render('paint');
});

app.get('/carp',(req,res)=>{
	res.render('carpet');
});

app.get('/poter',(req,res)=>{
	res.render('pot');
});
app.get('/fab',(req,res)=>{
	res.render('fab');
});
app.get('/pup',(req,res)=>{
	res.render('pup');
});
app.post('/signup',function(req,res){   
console.log(req.body);                                                                   //    '/signup'  path for Signing in 
    var salt=crypto.randomBytes(128).toString('hex');                                    //     creating salt
	var hpass=hash(req.body.password,salt);                                              //     creating hashed password
	pool.query('insert into signup( name,email,password) values($1,$2,$3);',[req.body.name,req.body.Email,hpass],function(err,result){
		if(err)
		{
			res.render('message',{mes:'something wrong hapened'});
		}else
			res.render('message',{mes:'Sign Up Completed'});
	})
	
});
app.get('/udaipur',(req,res)=>{res.render('udaipur');});


app.get('/pack',function(req,res){
		pool.query('select * from packages',function(err,resu){
		if(err) {res.render('message',{mes:err});}
		else 
		{console.log(resu.rows); res.render('pack',{result:resu.rows});
	}
	 });
	
	
});

app.get('/android',(req,res)=>{
	pool.query('select name,dur,cost from packages',function(err,result){
		if(err) res.render('message',{mes:err});
		else res.send(result.rows);
	});
});
app.get("/android/:id",(req,res)=>{
	console.log(req.params.id);
	pool.query('select * from packages where name=$1',[req.params.id],function(err,result){
		if(err){
			res.render('message',{mes:err});
		}
		else{
			console.log(result.rows[0]);
			res.render('p1',{mt:result.rows[0]});
			//res.render('spack',{p:});
			 //res.render('pack',{result:result.rows});
		}
	})
	
})

app.get('/add',function(req,res){
	res.render('add');
});
app.post('/package',function(req,res){
	console.log(req.body);
	pool.query('insert into packages(name,hotel,bus,tour,dur,vid,cost,turl,hurl,burl) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[req.body.name,req.body.hotel,req.body.bus,req.body.tour,req.body.dur,req.body.upload,req.body.cost,req.body.turl,req.body.hurl,req.body.burl],function(err,result){
		if(err) res.render('message',{mes:err});
		else res.render('message',{mes:'Data Entered Sucessfully'});
	});
});
app.post("/upload",multer(multerconfig).single('upload'),function(req,res){
	console.log(req.file);
	if(req.file)
		req.body.upload=req.file.filename;
	res.send("Uploaded");
});

app.post('/uadd',function(req,res){ 
pool.query('insert into resource (category,name,description,image) values($1,$2,$3,$4)',[req.body.category,req.body.name,req.body.description,req.body.image],function(err,result){
	if(err)
	{
		res.send(err);
	}
	else{
		res.send("Data Entered Sucessfully");
	}
});
});
app.get('/discount:id',function(req,res){
	pool.query('select * from quiz where qno=$1',[req.params.id],function(err,result){
		console.log(result);
    if(err)res.send(err);
	else
	res.render('exp',{vid:'mt.mp4',qno:result.rows[0].qno,ques:result.rows[0].ques,op1:result.rows[0].op1,op2:result.rows[0].op2,op3:result.rows[0].op3,op4:result.rows[0].op4});
});});
app.post('/discount',function(req,res){
	var sol=req.body.vehicle.split('$')[1];
	var question=req.body.vehicle.split('$')[0];
	
	pool.query('select * from quiz where qno=$1',[(question)],function(err,result){
	if(err)	console.log(err);
	else { 
		if(result.rows[0].sol==sol)
		{
			if((parseInt(question)+1)!=6)
	     res.redirect('/discount'+(parseInt(question)+1));
		 else  res.render('lo',{vid:'mt.mp4',msg:'You won !! Book to get 10% discount'});
		}
	   else
		res.render('lo',{vid:'lo.mp4',msg:'You lost it '});

	}	
	})
		
});
app.get('/create',function(req,res){
	pool.query('select * from  resource',function(err,result){
		console.log(result.rows);
		if(err)
			res.send("Database Error");
	res.render('create',{res:result.rows});
	});
	});

	app.get('/:id',(req,res)=>{

pool.query('select * from packages where name=$1',[req.params.id],function(err,result){
		if(err){
			res.render('message',{mes:err});
		}
		else{
			console.log(result.rows[0]);
			res.render('p1',{mt:result.rows[0]});
			//res.render('spack',{p:});
			 //res.render('pack',{result:result.rows});
		}
	})
		});

	// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
