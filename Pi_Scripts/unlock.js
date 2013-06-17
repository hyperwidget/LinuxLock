var restify = require('restify');

// TODO:
// Probably want some configuration file that points to the
// webservice, since we can't expect it to be localhost:8080
// all the time.
var client = restify.createJsonClient({
  url: 'http://localhost:8080',
  version: '~1.0'
});

var type, id;

process.argv.forEach(function(val,index,array){
  if(index>1) {
  	var s = new String(val)
  	if(s.indexOf('type=') === 0){
  		type = s.substr(5)
  	} else if(s.indexOf('id=') === 0) {
		  id = s.substr(3)
  	} else {
      console.log("Unsupported option `" + s + "'")
    }
  }
})

if(typeof(type) !== "string") {
  console.log("Missing 'type' parameter")
  client.close()
  process.exit(1)
}

if(typeof(id) !== "string") {
  console.log("Missing 'id' parameter")
  client.close()
  process.exit(1)
}

client.get('/auth/'+type+'/'+id, function (err, req, res, obj) {
  if(err) console.log(err)
  else {
    try {
      if(obj.auth===true) {
      	// TODO:
      	// Send GPIO signal to open door
      	console.log("Open the hatch!")
      } else {
      	console.log("Can't open the hatch, sorry :(")
      }
    } catch(e) {
  	  console.log("Object does not contain 'auth' parameter! Did something change?")
  	  console.log(obj)
    }
  }
  client.close();
});
