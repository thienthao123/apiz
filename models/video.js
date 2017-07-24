var mongoose = require('mongoose');
	autoIncrement = require('mongoose-auto-increment');
	var dbOpt = { 
    useMongoClient: true
} 
var  connection=  mongoose.connect('mongodb://thienthao123:123123@ds143221.mlab.com:43221/mydbthaotrau',dbOpt);

autoIncrement.initialize(connection);
var Schema = new mongoose.Schema ({ url: String,danhdau : Boolean ,hinh : String});
Schema.plugin(autoIncrement.plugin, 'video');
var ghichu = connection.model('video', Schema);








module.exports = mongoose.model('video',Schema)