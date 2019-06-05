var {findArticles,addNewArticle,showArticleDetail,updataArticle,deleteArticle} = require('../models/article');
const bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
module.exports = function (app) {
    app.get('/',function(req,res){
        findArticles(function(data){
            res.render('index',{articles:data})
        })
    })
    app.get('/article/new',function(req,res){
        res.render('new',{title:"new article"})
    })
    app.post('/articles/create',urlencodedParser,function(req,res){
        addNewArticle(function(data){
            res.redirect('/');
        },req.body)
    })
    app.get('/articles/:id',function(req,res){
        showArticleDetail(function(data){
            res.render('show',{article:data})
        },req.params.id)
    })
    app.delete('/articles/:id',function(req,res){
        deleteArticle(function(data){
            res.send('Success');
        },{_id:req.params.id});
    })
    app.get('/articles/:id/edit',function(req,res){
        showArticleDetail(function(data){
            res.render('edit',{title:'编辑文章',article:data})
        },req.params.id)
    })
    app.post('/articles/update/:id',urlencodedParser,function(req,res){
        updataArticle(function(data){
          res.redirect('/')
        },{id:req.params.id,article:req.body})
    })
}