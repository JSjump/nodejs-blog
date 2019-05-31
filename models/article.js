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
let findArticles = function(req,res){
    Article.find({},function(err,data){
        if(err) return console.err(err);
        return data;
    })
} 

module.exports.findArticles = findArticles;