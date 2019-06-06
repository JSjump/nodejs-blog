let mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // 对PassWord进行加密


let userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

let User = mongoose.model("User",userSchema);

let createUser = function(cb,param) {
     let newUser = new User(param);
     bcrypt.genSalt(10, function(err, salt) { // 对传输过来的数据密码进行加密。
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            if(err) return console.error(err);
            newUser.password = hash; // 加密过的密码，替换掉原始数据密码
            newUser.save(function(err){
                if(err) return console.error(err);
                return cb();
            })       
        });
    });
}

module.exports = {
    User,
    createUser
}

