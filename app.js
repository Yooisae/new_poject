var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer  = require('multer');

var testRouter = require('./routes/test');
var indexRouter = require('./routes/index');
var searchRouter = require('./routes/search_page');
//var testLoginRouter = require('./routes/test_login');
var bbsRouter = require('./routes/bbs');
var dataLoadRouter = require('./routes/dataLoad'); 
var newProjectRouter = require('./routes/new_project_registration'); 
var profilesettingRouter = require('./routes/my_profile_setting');
var profileviewRouter = require('./routes/my_profile_view');
var applySuccessRouter = require('./routes/project_apply_success');
var signin1Router = require('./routes/signin1');
var signin2Router = require('./routes/signin2');
var newProjectSuccessRouter = require('./routes/new_project_registration_success');


var signin_successRouter = require('./routes/signin_success');
var passwordRouter = require('./routes/password_find');
var loginRouter = require('./routes/login');
var mainRouter = require('./routes/main');
var myprosetRouter = require('./routes/my_project_setting');
var alarmRouter = require('./routes/alarm');
var myparRouter = require('./routes/my_participating_project');
var interestRouter = require('./routes/interest');
var googleRouter = require('./routes/google');
var naverRouter = require('./routes/naver');
var naverloginRouter = require('./routes/naverlogin');
var callbackRouter = require('./routes/callback');


var app = express();

//const flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
//50mb까지 리미트올려준거
app.use(express.json({'limit':'50mb'}));
app.use(express.urlencoded({ 'limit':'50mb',extended: false,parameterLimit:50000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(express.static(__dirname + '/public'));
app.use('/', indexRouter);
app.use('/dataLoad', dataLoadRouter);
app.use('/bbs', bbsRouter);
app.use('/my_profile_setting', profilesettingRouter);
app.use('/my_profile_view', profileviewRouter);
app.use('/new_project_registration', newProjectRouter);
app.use('/signin1', signin1Router);
app.use('/signin2', signin2Router);
//app.use('/test_login', testLoginRouter);
app.use('/signin_success', signin_successRouter);
app.use('/password_find', passwordRouter);
app.use('/login', loginRouter);
app.use('/main',mainRouter);
app.use('/search_page',searchRouter);
app.use('/my_project_setting',myprosetRouter);
app.use('/project_apply_success',applySuccessRouter);
app.use('/alarm',alarmRouter);
app.use('/my_participating_project',myparRouter);
app.use('/interest',interestRouter);
app.use('/test',testRouter);
// app.use('/google',googleRouter);
// app.use('/naver',naverRouter);
// app.use('/naverlogin',naverloginRouter);
// app.use('/callback',callbackRouter);
app.use('/new_project_registration_success',newProjectSuccessRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
