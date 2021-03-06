var {findArticles,addNewArticle,showArticleDetail,updataArticle,deleteArticle} = require('../models/article');
const bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const { check, validationResult } = require('express-validator/check'); // 表单验证

module.exports = function (app) {
    app.get('/',function(req,res){
        findArticles(function(data){
            res.render('index',{articles:data})
        })
    })
    app.get('/article/new',ensureAuthenticated,function(req,res){
        res.render('new',{title:"new article"})
    })
    app.post('/articles/create',urlencodedParser,[ // 表单验证 中间件
        check('title').isLength({ min: 1 }).withMessage('Title is required'),
        check('body').isLength({ min: 1 }).withMessage('Body is required')
    ],function(req,res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('new', {
                title: 'Add Article',
                errors: errors.array()
              })
        }else{
             const user_id = req.user._id;

                addNewArticle(function(data){
                    req.flash("success","Aricle Added")
                    res.redirect('/');
                },req.body,user_id)
            }
    })
    app.get('/articles/:id',function(req,res){
        // const user_id = req.user._id;
        showArticleDetail(function(data){
            res.render('show',{article:data})
        },req.params.id)
    })
    app.delete('/articles/:id',ensureAuthenticated,function(req,res){
        deleteArticle(function(data){
            req.flash("error","Aricle deleted");
            res.send('Success');
        },{_id:req.params.id},req.user.id,res);
    })
    app.get('/articles/:id/edit',ensureAuthenticated,function(req,res){
        showArticleDetail(function(data){
            if(data.author === req.user.name){ // 非文章作者不能多该文章进行修改
            req.flash("success","Edit successed");
            res.render('edit',{title:'编辑文章',article:data})
            }else{
            req.flash('danger','no authenticate')
            res.redirect('/login')  
            }
        },req.params.id)
    })
    app.post('/articles/update/:id',urlencodedParser,function(req,res){
        updataArticle(function(data){
          req.flash("success","Article updated");
          res.redirect('/')
        },{id:req.params.id,article:req.body})
    })


    function ensureAuthenticated(req,res,next){
         if(req.isAuthenticated()){ // passport 对http-req 的拓展。增加isAuthenticated()方法验证是否有权限
             return next();
         }else {
             req.flash('danger','Please Login');
             res.redirect('/login');
         }
    }
}