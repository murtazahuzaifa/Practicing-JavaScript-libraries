require('dotenv').config();


var contentful = require('contentful')

var client = contentful.createClient({
    space: process.env.SPACE_ID,
    accessToken: process.env.ACCESS_TOKEN
  })

client.getEntries()
.then((enteries)=>{
    enteries.items.forEach((entry)=>{
        console.log(entry.fields);
    })
})