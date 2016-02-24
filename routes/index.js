var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /*var device = req.device;
  console.log(device.type);
  var sess = req.session
  if (sess.views) {
    sess.views++;
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + sess.views + '</p>');
    res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
    res.end();
  } else {
    sess.views = 1;
    res.end('welcome to the session demo. refresh!');
  }*/
  res.render('index', { title: 'Csibész' });
});

router.get( '/rest/:table/:id?', function ( req, res ){
    
    var orm = require('../orm/orm');
    orm.init(
        req.app.get('db'),
        req.app.get('db_pool'),
        req.app.get('schema')
    );
    //console.log(req.app.get('schema'));
    //var sample_content_query = new (require('../orm/models/base/sample_content_query'))();

    /*orm.query('sample_content')
            //.filterById(['valami', 'masvalami'])
            //.filterByTitle('valami')
            //.or()
            //.where("title LIKE 'valami%'")
            //.filterByBody('masvaami')
            .findPk(1, function(err, rows){
                //console.log(rows[0].getBody());
            });
    */
//    var obj = orm.make('sample_content');
//    obj.setTitle('New title');
//    obj.setBody('New body');
//    //console.log(obj);
//    obj.save(function(err, result){
//        console.log(err);
//        console.log(result);
//    });
    //res.end();
    
    orm.query('sample_content').findPk("1", function(err, obj){ 
        obj.setTitle('Új title');
        obj.save(function(err, rows){
            console.log(err);
            console.log(rows);
        });
    });
});

module.exports = router;