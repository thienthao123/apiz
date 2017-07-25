const express = require('express')
const app = express()
const cheerio = require('cheerio'); 
const request = require('request')

app.get('/',(req,res) => {
	request.get('http://vietjack.com/giai-toan-lop-11/bai-2-trang-36-sgk-dai-so-11.jsp',(err,response,body) => {
		$ = cheerio.load(body)
		var img = $('img')
		var searchQuery = new RegExp('bai-2-trang-36-sgk-dai-so'.toLowerCase(), 'i');
		for(const i in img){
			if(typeof img[i].attribs.src){
				console.log(img[i].attribs.src.match(searchQuery))
			}
		}
	})
})





module.exports = app