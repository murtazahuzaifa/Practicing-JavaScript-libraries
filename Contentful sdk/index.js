// main.js
var contentful = require('contentful')

var client = contentful.createClient({
    space: '08kflue73mqh',
    accessToken: 'SQ5_Y6paKYx7puGR0i0-ncD2iJk30OP3Bk02GJN_1bc'
  })

client.getEntries()
.then((enteries)=>{
    enteries.items.forEach((entry)=>{
        console.log(entry.fields);
    })
})