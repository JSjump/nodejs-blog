let mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
    title: {
     type:String,
     required:true
    },
    author:{
        type:String,
        require:true
    },
    body:{
        type:String,
        required:true
    }
})
let Article = mongoose.model('Article',articleSchema)
let findArticles = function(cb){
    Article.find({},function(err,res){
        if(err) return console.error(err);
        return cb(res) // 通过回调函数把数据传递到controller层。与view层结合
    })
} 

module.exports.findArticles = findArticles;