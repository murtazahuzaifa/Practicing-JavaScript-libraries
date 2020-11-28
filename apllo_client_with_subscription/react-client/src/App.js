import React from 'react';
import { useQuery, gql, useSubscription } from '@apollo/client';

const getData = gql`
    { employees{ name } }
`
const subscribeData = gql`
    subscription{
      newEmployee{
        name
      }
    }
`
const mutation = gql`
mutation {
  addEmployee(name: "Jhon", employerId: 1) {
    name
  }
}
`


function App() {
  const { data, error, loading } = useQuery(getData);
  const subscribe  = useSubscription(subscribeData);
  console.log(subscribe.data);

  if (loading) {
    return <div> <h1>{loading}</h1> </div>
  }

  else if (error) {
    return <div style={{ color: 'red' }} ><h1>{error}</h1></div>
  }

  return (
    <div>
      <h1>Data Fetched</h1>
      <ul>
        {
          data?.employees.map((d, idx) => (
            <li key={idx} >{d?.name}</li>
          ))
        }
      </ul>
      <br />
      <h2>Subscription Data</h2>
      <div>{JSON.stringify(subscribe.data,null,2)}</div>
    </div>
  )

}

export default App;
