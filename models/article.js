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
let addNewArticle = function(cb,param){
    let article = new Article(param);
    article.save(function(err,res){
        if(err) return console.error(err);
        return cb();
    })
}

let showArticleDetail = function(cb,param){
    Article.findById(param,function(err,res){
        if(err) return console.error(err);
        return cb(res);
    })
}
let updataArticle = function(cb,param){
    Article.update({_id:param.id},param.article,function(err,res){
        if(err) return console.error(err);
        return cb();
    })
}
let deleteArticle = function(cb,param){
    Article.remove(param,function(err,res){
        if(err) return console.log(err);
        return cb();
    })
}
module.exports = {
    findArticles,
    addNewArticle,
    showArticleDetail,
    updataArticle,
    deleteArticle
};