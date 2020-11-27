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
const query = `
    {
        getLoyaltyLevel(id:"3019a175-44c2-42a9-a407-cd38f69eb035"){
            level
        }
    }
`
const getQuery = `
    {
        getCustomers {
            id
            name
        }
    }
`

// { todos{ text id } }
// mutation {deleteTodo(id: "jasdf-sdaflsd24u242safsd092jl"){ id, text } }
// mutation { addTodo(todoInput:{text:"hello world"}){ text, id } }
const query1 = `
    mutation {addIceCream(iceCream:{
        receiverName:"Sir Zia", 
        senderName: "Murtaza",
        message:"Thank you so much sir", 
        iceCreamColor: {color1:"blue" , color2:"brown" , color3:"gray"}
    }) {
        id
        receiverName
        senderName
        message
        iceCreamColor{ color1 color2 color3 }
    }
}
`
const _getQuery = `
    { allIceCreams{ id receiverName senderName message iceCreamColor{ color1 color2 color3 } } }
`

const accessToken = process.env.APIKEY5;
// const url = `https://xsoea4dpjzgfdnpxhpgjcxq4ky.appsync-api.us-east-2.amazonaws.com/graphql`
// const url = `https://nvn6jfg5tvflrgfhna4tzr6nki.appsync-api.us-east-2.amazonaws.com/graphql`
const url = `https://q6bkwbybx5fqpmqpja6r6ovmcy.appsync-api.us-east-2.amazonaws.com/graphql`
axios.default.post(url, JSON.stringify({ query:query1 },null,2),
    {
        headers:
            { "content-type": "application/json", "x-api-key": accessToken }
    })
    .then(({data})=>{console.log(JSON.stringify(data,null,2))})
    .catch(({response})=>{
        console.log(response)
    })