const express=require("express");
const cookieParser=require("cookie-parser");
const morgan=require('morgan');
const path=require('path');
const session=require('express-session');
const passport=require('passport');
const dotenv=require('dotenv');

//임시 require - html용
const nunjucks=require('nunjucks');

dotenv.config();
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const {sequelize} = require('./models');
const passportConfig = require('./passport');

const app=express();
passportConfig();
app.set('port', process.env.PORT);

//임시 setting - html용
app.set('view engine', 'html');
nunjucks.configure('views',{
    express:app,
    watch:true,
});

sequelize.sync({force:false})
.then(()=>{
    console.log('DB Connect!');
})
.catch((err)=>{
    console.error(err);
});

const sessionMiddleware=session({
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false,
    },
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
//img 라우터 추가 시 주석 해제
//app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);

app.use((req, res, next)=>{
    const error=new Error(`${req.method} ${req.url} router is no exist.`);
    error.status=404;
    next(error);
});

app.use((err, req, res, next)=>{
    res.locals.message=err.message;
    res.locals.error=process.env.NODE_ENV!=='production'?err:{};
    res.status(err.status||500);
    res.render('error');
});

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), ' port waiting');
});