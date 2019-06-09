let mongoose = require('mongoose');

const {User} = require('./users');

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
let addNewArticle = function(cb,param,id){
    param.author = id;
    let article = new Article(param);
    article.save(function(err,res){
        if(err) return console.error(err);
        return cb();
    })
}

let showArticleDetail = function(cb,param){
    Article.findById(param,function(err,res){
        User.findById(res.author,function(err,user){
            res.author = user.name;
            if(err) return console.error(err);
            return cb(res);    
        })
    })
}
let updataArticle = function(cb,param){
    Article.update({_id:param.id},param.article,function(err,res){
        if(err) return console.error(err);
        return cb();
    })
}
let deleteArticle = function(cb,param,user_id,ret){
    Article.findById(param,function(err,article){
        if(err) return console.log(err);
        if(article.author !== user_id){
            ret.status(500).send();  //文章作者 与 登陆用户 不一致则不能删除
        }else{
            Article.remove(param,function(err,res){
                if(err) return console.log(err);
                return cb();
            })        
        }
    })
}
module.exports = {
    findArticles,
    addNewArticle,
    showArticleDetail,
    updataArticle,
    deleteArticle
};