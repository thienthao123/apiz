var express = require('express')
var session = require("express-session")
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var Ghichu = require('./models/ghichu')
var request = require('request');

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(session({
    secret: 'aaaaaaaaaaaaaaaaa'
}))

var daxem = function(req, res, next) {
    if (req.session.daxem) {
        next()
    } else {
        req.session.daxem = []
        next()
    }
}

var ngay = new Date().toISOString().
replace(/T/, ' '). // replace T with a space
replace(/\..+/, '');
io.on("connection", function(socket) {

    socket.on('save', function(data) {
        var xvideo = data.url.seach('xvideos') 
        if(xvideo){
            request.get('http://apiz.jav0.xyz/api.php?hinh=' + data.url, function(err, respose, body) {
                var hinh = JSON.parse(body).hinh
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
                            danhdau: data.danhdau,
                            hinh: hinh
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
        } else {
        	var hinh = null
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
                            danhdau: data.danhdau,
                            hinh: hinh
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
        }


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
})
app.get('/', function(req, res) {

    res.render('index')
})
app.get('/add', function(req, res) {
    res.render('add')
})


server.listen(process.env.PORT || '3000')