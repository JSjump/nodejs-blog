var express = require('express');
var path = require('path');
const session = require('express-session');
const passport = require('passport'); // 引入passport进行权限认证
const authen = require('./config/passport');
var articleController = require('./controllers/article');
const userController = require('./controllers/users');
console.log('start')

var app = express();


// 使用session中间件
app.use(session({
    secret:'keyboard cat', //对session id相关的cookie进行签名
    resave:false, // 是否保存未初始化的会话
    saveUninitialized:true
}))

var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/nodejs-blog"); // 链接数据库

let db = mongoose.connection;

db.on('error',function(err){
    console.error(err);
})
db.once('open',function(req,res){
    console.log('success connect to database nodejs-blog')
})



// 安装连接闪存插件，添加为中间件
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


app.set('views',path.join(__dirname,'views'));// 设置模板存放目录 若不设则默认views
app.set('view engine','pug'); // 设置模板引擎为pug   pug特色block功能，extends继承。  区别于express的includes   

app.use(express.static(path.join(__dirname,"public"))); // 设置静态目录
// var props = {
//     articles:[],
//     title: 'Add article'
// }

authen(passport); //passport 权限验证
app.use(passport.initialize());
app.use(passport.session());

app.get('*',function(req,res,next){// 访问任何请求，都会经过这个中间件
    res.locals.user = req.user || null;  // 设置每个 res.locals.user 的值
    next();
})

articleController(app);
userController(app);




app.listen(3000);
console.log('app.js is running at port 3000');