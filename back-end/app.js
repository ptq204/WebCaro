const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const mongoose = require( 'mongoose' ); 
const secret="pGctNMl4LL4bEQSwCdIzdg";
const cors = require('cors');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const unguardRouter = require('./routes/unguard');


var dbURI = "mongodb+srv://nghipt:skN1rHeACPFM2dKw@carogame-rcp4i.mongodb.net/test?retryWrites=true&w=majority"; 
mongoose.connect(dbURI, {useNewUrlParser: true}); 
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(unguardRouter);

//jwt checking and setup
app.use((req,res,next) => {
  if (!req.headers.authorization){
    res.json({
      status: 1,
    });
  } else {
    let token = req.headers.authorization.split(" ");
    jwt.verify(token[1], secret, (err, decoded) => {
      if (err){
         res.json({
           status: 1
         });
      } else {
        req.body.usrId = decoded.id;
        next();
      }
    });
  }
});

app.use('/users', usersRouter);

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
