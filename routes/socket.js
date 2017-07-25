module.exports = (socket) => {
	
    socket.on('save',(url) => {
        url = url.replace(/\s/g, '');
        url = url.replace(/\(/g, '');
        url = url.replace(/\)/g, '');
        url = url.replace(/\,/g, '.');
        Video.findOne({url:url},(err,doc) => {
            if(doc){
                socket.emit('err','trung')
                socket.emit('done')
            }
            if(!doc){
                 request.get(url,(err,response,body) => {
                $ =  cheerio.load(body)
                 var img = $('meta')
                var hinh = img[11].attribs.content
                var videoadd = new Video({
                        url : url,
                        hinh : hinh,
                        danhdau:false
                     })
                videoadd.save((err,result) => {
                     if(err){
                            socket.emit('err',err)
                        }
                        if(result){
                            socket.emit('done')
                            Video.find({},{$sort : {'_id' : 'desc'}},(err,docs) => { 
                                    
                                    socket.emit('list',docs)

                            })
                        }
                    })
        })
            }
        })
       
        
    })

    

    socket.on('seach', function(key) {
        if (Number(key)) {
            Video.find({
                _id: key
            }, function(err, docs) {
                socket.emit('list', docs)
            }).sort({'_id' : 'desc'})
        } else {
            var searchQuery = new RegExp(key.toLowerCase(), 'i');
            Video.find({
                url: searchQuery
            }, function(err, docs) {
                socket.emit('list', docs)
            }).sort({'_id' : 'desc'})

        }

    })
    Video.find({},(err,docs) => {
        socket.emit('list',docs)
    }).sort({'_id':'desc'})

    socket.on('danhdau',() => {
        Video.find({danhdau:true},(err,docs) => {
            socket.emit('list',docs)
        }).sort({'_id' : 'desc'})
    })
    socket.on('delete',(id) => {
        Video.remove({_id : id} ,(err,result) => {
            if(err){
                socket.emit('err',err)
            }
            if(result){
                Video.find({},(err,docs) => {
                    socket.emit('list',docs)
                }).sort({'_id':'desc'})
            }
        })
    })

    socket.on('bodanhdau',(id) => {
        Video.findById(id,(err,doc) => {
            doc.danhdau = false
            doc.save((err,doc) => {
                if(err){
                    socket.emit('err',err)
                }
                Video.find({danhdau:true},(err,docs) => {
                     socket.emit('list',docs)
                }).sort({'_id' : 'desc'})
            })
        })
    })
    
    /* IOS */
    Video.find({},(err,docs) => {
        socket.emit('ios:list',docs)
    }).sort({'_id':'desc'})
    .limit(50).skip(0)

    socket.on('ios:xemthem',function(id){
        socket.handshake.session.xemthem = 50
        socket.handshake.session.xemthem = Number(socket.handshake.session.xemthem + id)
        Video.find({},function(err,docs){
            socket.emit('ios:list', docs)
        }).limit(Number(socket.handshake.session.xemthem)).skip(0)
        .sort({'_id':'desc'})
        
       
    })
    socket.on('ios:seach', function(key) {
        if (Number(key)) {
            Video.find({
                _id: key
            }, function(err, docs) {
                socket.emit('ios:list', docs)
            }).sort({'_id' : 'desc'})
        } else {
            var searchQuery = new RegExp(key.toLowerCase(), 'i');
            Video.find({
                url: searchQuery
            }, function(err, docs) {
                socket.emit('ios:list', docs)
            }).sort({'_id' : 'desc'})

        }

    })

    socket.on('ios:view',(id) => {
        
        Video.findById(id,(err,doc) => {
                    socket.emit('ios:viewVideo',doc)
            })
    })
    socket.on('ios:danhdau',(id) => {
        Video.findById(id,(err,doc) => {
            doc.danhdau = true
            doc.save((err,result) => {
                if(err){
                    socket.on('err',err)
                }
                if(result){
                    Video.find({},(err,docs) => {
                        socket.emit('ios:list',docs)
                    })
                }
            })
        })
    })
    socket.on("ios:danhdaulist",() => {
        Video.find({danhdau:true},(err,docs) => {
            socket.emit('ios:list',docs)
        }).sort({'_id':'desc'})
    })
    socket.on('ios:list',() => {
        Video.find({},(err,docs) => {
        socket.emit('ios:list',docs)
    }).sort({'_id':'desc'})
    .limit(50).skip(0)
    })
}