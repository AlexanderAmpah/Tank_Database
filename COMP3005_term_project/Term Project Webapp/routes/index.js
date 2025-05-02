var url = require('url')
var sqlite3 = require('sqlite3').verbose() //verbose provides more detailed stack trace

//connect to sqlite database
var db = new sqlite3.Database('data/tank_database.db')



function parseURL(request, response) {
  var parseQuery = true //parseQueryStringIfTrue
  var slashHost = true //slashDenoteHostIfTrue
  var urlObj = url.parse(request.url, parseQuery, slashHost)
  console.log('path:')
  console.log(urlObj.path)
  console.log('query:')
  console.log(urlObj.query)
  return urlObj
}


const page_header = `<!DOCTYPE html>
<html>
<head>
<title>WW2 Tank Database</title>
<style>
body {
  font-family: verdana;
  background-color: white;
}

h1 {
    color: black;
}

p, li {
    font-size: 20px;
}
table {
    border-collapse: collapse;
    width: 50%;
}

th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}
tr:hover {background-color:#f5f5f5;}
</style>
</head>
<body>`

const page_footer = `</body></html>`

exports.countries = function(request, response) {
  //responds to client by generating web page
  console.log("RUNNING FIND countries JSON API")

  //use prepared sql statements (the ones with ? parameters)

  let sql = "SELECT countryName, year_joined, axis, allied  FROM Country"

  //web page generated and sent to client
  db.all(sql, function(err, rows) {
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.write(page_header)
    response.write(`<h1>WW2 Tank Database</h1>`)
    response.write(`<p>Countries in WW2:</p>`)
    for (let i = 0; i < rows.length; i++) {
      response.write(`<p><a href='countries/${rows[i].countryName}'>${rows[i].countryName}-  Year joined:${rows[i].year_joined} Axis:${rows[i].axis} Allied:${rows[i].allied}</a></p>`)
    }
    response.write(page_footer)
    //write end send response to client
    response.end()
  })
}

exports.tanks = function(request, response) {
  let urlObj = parseURL(request, response)
  var country = urlObj.path 
  country = country.substring(country.lastIndexOf("/") + 1, country.length)

  //use of a prepared sql statement (the ones with ? parameters)
  let sql = "SELECT * FROM Tank WHERE Tank.country = ?"
  console.log("Get Tank of country "+country)

  //web page generated to send to client
  db.all(sql, country, function(err, rows) {
    console.log('tank Data')
    console.log(sql);
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.write(page_header)
      response.write(`<h1>Tanks:</h1>`)
      for (let i = 0; i < rows.length; i++) {
      response.write(`<p><a href='/tanks/${rows[i].tankId}'>${rows[i].tankId}: ${rows[i].tankName} Number Produced:${rows[i].num_produced} Tank type:${rows[i].type} Used by:${rows[i].country}</a></p>`)
      }
      response.write(page_footer)
      //write end send response to client
      response.end()
  })
}

exports.specs = function(request, response) {
  let urlObj = parseURL(request, response)
  var tankID = urlObj.path 
  tankID = tankID.substring(tankID.lastIndexOf("/") + 1, tankID.length)

  //use of a prepared sql statement (the ones with ? parameters)
  let sql = "SELECT * FROM Specs natural join Tank_Specs where Tank_Specs.tankId ="+tankID
  console.log("Get specifications of tank "+tankID)

  db.all(sql, function(err, rows) {
    console.log('tank Data')
    console.log(sql);
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.write(page_header)
      response.write(`<h1>Tank Specifications:</h1>`)
      for (let i = 0; i < rows.length; i++) {
      response.write(`<p>Specification ID: ${rows[i].sId}</p>`)
      response.write(`<p>Armor: ${rows[i].armor}</p>`)
      response.write(`<p>Main Armament: ${rows[i].main_armament}</p>`)
      response.write(`<p>Secondary Armament: ${rows[i].secondary_armament}</p>`)
      response.write(`<p>Max Speed: ${rows[i].max_speed}</p>`)
      response.write(`<p>Crew: ${rows[i].crew}</p>`)
      response.write(`<p>Propulsion: ${rows[i].propulsion}</p>`)
      response.write(`<p>Weight: ${rows[i].weight}</p>`)
      response.write(`<p>Range: ${rows[i].range}</p>`)
      }
      response.write(page_footer)
      //write end send response to client
      response.end()
  })
}
