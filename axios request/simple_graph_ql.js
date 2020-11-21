require('dotenv').config();
const axios = require('axios');

const queryMut = `
    mutation add {
        addCustomer(customer:{name:"murx"}){
            id
            name
        }
    }
`


const accessToken = process.env.APIKEY2;
const url = `https://xsoea4dpjzgfdnpxhpgjcxq4ky.appsync-api.us-east-2.amazonaws.com/graphql`
axios.default.post(url, JSON.stringify({ query:queryMut }),
    {
        headers:
            { "content-type": "application/json", "x-api-key": accessToken }
    })
    .then(({data})=>{console.log(data)})
    .catch(({response})=>{
        console.log(response)
    })