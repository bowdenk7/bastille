var initTime = new Date().getTime()
  , createServer = require('./server')

var PORT = 5858;
var HOST = 'localhost';
createServer.listen(PORT)

console.log("Server running at http://"+HOST+":"+PORT+"/")
console.log('started server in', new Date().getTime() - initTime, 'ms')
