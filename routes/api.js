const express = require('express')
const app = express()
const cheerio = require('cheerio'); 
const request = require('request')

app.get('/',(req,res) => {
	request.get('http://vietjack.com/giai-toan-lop-11/bai-2-trang-36-sgk-dai-so-11.jsp',(err,response,body) => {
		$ = cheerio.load(body)
		var img = $('.nxt-btn')
		console.log(img[0].parent)
	})
})





module.exports = app