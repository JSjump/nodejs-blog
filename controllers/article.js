var {findArticles} = require('../models/article');
module.exports = function (app) {
    app.get('/',function(req,res){
        findArticles().then(function(data){
            res.render('index',{articles:data})
        })
    })
    app.get('/article/new',function(req,res){
        res.render('new',{title:"new title"})
    })
}