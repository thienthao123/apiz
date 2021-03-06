var express = require('express')
var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: false,
    cookie: { 
        //secure: true,
        httpOnly: true,
        maxAge: 10000 },
    rolling: true
  }),
  sharedsession = require("express-socket.io-session");
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var Video = require('./models/video')
var fs = require('fs')
var request = require('request');
const shortid = require('shortid')
const cheerio = require('cheerio'); 

const API = require('./routes/api')
/*
download('https://scontent.fsgn5-4.fna.fbcdn.net/v/t1.0-9/17883594_788199374689936_6152508897973324562_n.jpg?oh=24a3c72592f97b6d5f62cfdc40a1dcbe&oe=59F9AB30','test.jpg',() => {
*/


app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(session);

app.use('/api',API)
io.use(sharedsession(session));
/*
var ngay = new Date().toISOString().
replace(/T/, ' '). // replace T with a space
replace(/\..+/, '');

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
                                socket.emit('done','ok')
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
    socket.on('IOS:seach', function(key) {
        if (Number(key)) {
            Ghichu.find({
                _id: key
            }, function(err, docs) {
                socket.emit('IOS:list', docs)
            })
        } else {
            var searchQuery = new RegExp(key.toLowerCase(), 'i');
            Ghichu.find({
                ghichu: searchQuery
            }, function(err, docs) {
                socket.emit('IOS:list', docs)
            })

        }

    })

    /* API Mobile 
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
        Ghichu.find({},{$sort:{'_id':'desc'}},function(err,docs){
            console.log(docs)
            socket.emit('IOS:list', docs)
        }).limit(Number(socket.handshake.session.xemthem)).skip(Number(socket.handshake.session.xemthem - 50))
        
        }else{
        socket.handshake.session.xemthem = Number(socket.handshake.session.xemthem + id)
        console.log(socket.handshake.session.xemthem)
        Ghichu.find({},{$sort:{'_id':'desc'}},function(err,docs){
            console.log(docs)
            socket.emit('IOS:list', docs)
        }).limit(Number(socket.handshake.session.xemthem)).skip(Number(socket.handshake.session.xemthem - 50))
        
        }
        
       
    })
/* Root 
socket.on('root',function(data){
    console.log(data)
})

socket.on('root:list_public',function(){
    dir.subdirs('./public', function(err, subdirs) {
    if (err) throw err;
    console.log(subdirs);
});
})
socket.on('root:list_views',function(){
    var nameFolder = "views"
  dir.subdirs('./views', function(err, subdirs) {
    if (err) throw err;
    for(var i in subdirs){
       console.log(subdirs[i].match(/nameFolder(.*?)/))
    }
});
})
/* End Root 

})
app.get('/', function(req, res) {

    res.render('index')
})
app.get('/add', function(req, res) {
    res.render('add')
})
*/



io.on("connection",require('./routes/socket'))



app.get('/',(req,res) => {
    res.render('index')
})

app.get('/add',(req,res) => {
    res.render('add')
})




var port = process.env.PORT || 3000
server.listen(port, function() {
    console.log("App is running on port " + port);
});