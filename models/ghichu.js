var mongoose = require('mongoose');
	autoIncrement = require('mongoose-auto-increment');
var  connection=  mongoose.connect('mongodb://thienthao123:123123@ds143221.mlab.com:43221/mydbthaotrau');

autoIncrement.initialize(connection);
var Schema = new mongoose.Schema ({ ghichu: String, date: String,danhdau : Boolean ,hinh : String});
Schema.plugin(autoIncrement.plugin, 'ghichu');
var ghichu = connection.model('ghichu', Schema);








module.exports = mongoose.model('ghichu',Schema)