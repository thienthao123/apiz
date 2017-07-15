var express = require('express')
var session = require("express-session")({
    secret: "my-secret"
  }),
  sharedsession = require("express-socket.io-session");
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var Ghichu = require('./models/ghichu')
var request = require('request');

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(session);
var ngay = new Date().toISOString().
replace(/T/, ' '). // replace T with a space
replace(/\..+/, '');
io.use(sharedsession(session));
io.on("connection", function(socket) {

    socket.on('save', function(data) {
       
        	 Ghichu.findOne({
                    ghichu: data.url
                }, function(err, doc) {
                    if (err) {
                        socket.emit('err', err)
                    }
                    if (!doc) {
                        var ghichu = new Ghichu({
                            ghichu: data.url,
                            date: ngay,
                            danhdau: data.danhdau
                        })
                        ghichu.save(function(err, result) {
                            if (err) {
                                socket.emit('err', err)
                            }
                            if (result) {

                            }
                        })
                    }
                    if (doc) {
                        socket.emit('err', 'trung')
                    }
                })
        


    })
    socket.on('delete', function(id) {
        Ghichu.remove({
            _id: id
        }, function(err, result) {
            if (err) {
                socket.emit('err', err)
            }
            Ghichu.find({}, function(err, docs) {
                socket.emit('list', docs)
            })
        })
    })

    Ghichu.find({}, function(err, docs) {
        socket.emit('list', docs)
    })
    socket.on('danhdau', function() {
        Ghichu.find({
            danhdau: true
        }, function(err, docs) {
            if (err) {
                socket.emit('err', err)
            }
            socket.emit('list', docs)
        })
    })

    socket.on('seach', function(key) {
        if (Number(key)) {
            Ghichu.find({
                _id: key
            }, function(err, docs) {
                socket.emit('list', docs)
            })
        } else {
            var searchQuery = new RegExp(key, 'i');
            Ghichu.find({
                ghichu: searchQuery
            }, function(err, docs) {
                socket.emit('list', docs)
            })

        }

    })

    /* API Mobile */
    socket.on('IOS:videoId',function(id){
      Ghichu.findById(id,function(err,doc){
        socket.emit('IOS:videoId',doc)
      })
    })

    socket.on('danhdauAdd',function(id){
        Ghichu.findOneAndUpdate({_id:id},{$set:{danhdau : true}},function(err,result){
            if(err){
                socket.emit('err',err)
            }
            if(result){
                 Ghichu.find({
            danhdau: true
        }, function(err, docs) {
            if (err) {
                socket.emit('err', err)
            }
            socket.emit('IOS:danhdau', docs)
        })
            }
            
        })
    })
    socket.on('IOS:danhdau',function(){
        Ghichu.find({
            danhdau: true
        }, function(err, docs) {
            if (err) {
                socket.emit('err', err)
            }
            socket.emit('IOS:danhdau', docs)
        })
    })

    socket.on('IOS:xemthem',function(id){
        if(!socket.handshake.session.xemthem){
            socket.handshake.session.xemthem = 0
             socket.handshake.session.xemthem = Number(socket.handshake.session.xemthem + id)
        console.log(socket.handshake.session.xemthem)
        Ghichu.find({},function(err,docs){
            console.log(docs)
            socket.emit('IOS:list', docs)
        }).limit(Number(socket.handshake.session.xemthem)).skip(Number(socket.handshake.session.xemthem - 50))
        
        }else{
        socket.handshake.session.xemthem = Number(socket.handshake.session.xemthem + id)
        console.log(socket.handshake.session.xemthem)
        Ghichu.find({},function(err,docs){
            console.log(docs)
            socket.emit('IOS:list', docs)
        }).limit(Number(socket.handshake.session.xemthem)).skip(Number(socket.handshake.session.xemthem - 50))
        
        }
        
       
    })


})
app.get('/', function(req, res) {

    res.render('index')
})
app.get('/add', function(req, res) {
    res.render('add')
})

var port = process.env.PORT || 3000
server.listen(port, function() {
    console.log("App is running on port " + port);
});
