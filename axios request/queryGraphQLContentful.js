require('dotenv').config();
const axios = require('axios');

const query = `{
    fileToFilePossibilityCollection (where:{fileExtension:{extension:"txt"}}) {
      total
      items{
        title
        fileExtension{
          extension
          type
        }
        convertPossibilityCollection{
          items{
            extension
            type
          }
        }
      }
    }
  }`


const space_id = process.env.SPACE_ID;
const accessToken = process.env.ACCESS_KEY;
const url = `https://graphql.contentful.com/content/v1/spaces/${space_id}/environments/master`
axios.default.post(url, JSON.stringify({ query }),
    {
        headers:
            { "content-type": "application/json", Authorization: `Bearer ${accessToken}` }
    })
    .then(({data})=>{console.log(data)})
    .catch(({response})=>{
        console.log(response)
    })