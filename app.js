var express = require('express');
var path = require('path');
const session = require('express-session');
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

var articleController = require('./controllers/article');

app.set('views',path.join(__dirname,'views'));// 设置模板存放目录 若不设则默认views
app.set('view engine','pug'); // 设置模板引擎为pug   pug特色block功能，extends继承。  区别于express的includes   

app.use(express.static(path.join(__dirname,"public"))); // 设置静态目录
// var props = {
//     articles:[],
//     title: 'Add article'
// }

articleController(app)



app.listen(3000);
console.log('app.js is running at port 3000');