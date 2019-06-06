const LocalStrategy = require('passport-local').Strategy; // 选则权限认证本地策略
const {User} = require('../models/users');
const bcrypt = require('bcrypt');

module.exports = function(passport) {
    passport.use(new LocalStrategy( 
        function(username, password, done) {
          User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false,{message:'no user Found'}); }

            bcrypt.compare(password,user.password,function(err,isMatch){ //加密后的密码进行比对
                if(err) {return done(err);}
                if(isMatch){
                    return done(null,user);
                }else{
                    return done(null,false,{message:"Incorrect password"})
                }
            })
          });
        }
      ));
      // 序列化，用户提交后把ID作为唯一标志存储在session中，同时存储在用户的cookie中
      passport.serializeUser(function(user, done) { // 序列化用户ID
        done(null, user.id);
      });
      //验证用户是否登录时需要用到反序列化，session根据id取回用户的登录信息并存储在req.user中
      passport.deserializeUser(function(id, done) { // 反序列化用户ID
        User.findById(id, function (err, user) {
            console.log(user,'lll11111111111111111111111111111111')
          done(err, user);
        });
      });
    
}
