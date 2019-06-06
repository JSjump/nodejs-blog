const {createUser} = require("../models/users");
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check'); // 表单验证
const passport = require('passport'); // 模块只会进行一次初始化（第一次引用时）

var urlencodedParser = bodyParser.urlencoded({ extended: false }); // 转换前台传来表单数据


module.exports = function (app) {

    app.get('/register',function(req,res){
        res.render('users/register');
    });
    // 注册验证
    app.post('/users/register',urlencodedParser,[
        check('name').isLength({min:1}).withMessage('Name is required'),
        check('username').isLength({ min: 1 }).withMessage('Username is required'),
        check('email').isLength({ min: 1 }).withMessage('Email is required'),
        check('email').isEmail().withMessage('invalid email'),
        check("password", "invalid password")
          .isLength({ min: 1 })
          .custom((value,{req,loc,path}) => {
            if (value !== req.body.password_confirmation) {
                // trow error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return value;
            }
          })
    ],function(req,res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('users/register', { // res.render(views[,locals]) res的第二个属性也可以这样设置res.locals = ... 
              errors: errors.array()
            })
          } else {
        createUser(function(data){
            req.flash("success","User Added")
            res.redirect('/')
        },req.body)
    }
    });

    app.get('/login',function(req,res){
        res.render('users/login');
    });
 
    // 登录-权限认证设置
    app.post('/users/login',urlencodedParser,function(req,res,next){
        passport.authenticate('local',{
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
            successFlash: 'Welcome!'
        })(req, res, next);
    });

    app.get('/users/logout',function(req,res){
        req.logout(); // passport 拓展了http request. 默认提供了一些方法
        req.flash('success','You are logged out');
        res.redirect('/login')
    })
}