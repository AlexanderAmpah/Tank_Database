/*
Basic node.js express-based server with middleware, SQLite database, providing web pages.

The server allows client to find countries, including their tanks and the tanks specifications, in
its SQLite database. 

Here the server serves the web-pages. 
*/

//Cntl+C to stop server

var http = require('http')
var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan') //console logger for dubugging

const  app = express() //create express middleware dispatcher

const PORT = process.env.PORT || 3000

app.locals.pretty = true //to generate pretty view-source code in browser

//read routes modules javascript file
var routes = require('./routes/index')

//some logger middleware functions
function methodLogger(request, response, next){
		   console.log("METHOD LOGGER")
		   console.log("================================")
		   console.log("METHOD: " + request.method)
		   console.log("URL:" + request.url)
		   next(); //call next middleware registered
}
function headerLogger(request, response, next){
		   console.log("HEADER LOGGER:")
		   console.log("Headers:")
       for(k in request.headers) console.log(k)
		   next(); //call next middleware registered
}

//register middleware with dispatcher
//ORDER MATTERS HERE
//middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))


//JSON routes
app.get('/', routes.countries)
app.get('/countries/*', routes.tanks)
app.get('/tanks/*',routes.specs)

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
		console.log(`Testing:`)
		
		}
})
