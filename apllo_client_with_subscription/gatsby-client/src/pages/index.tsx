import React, { FC, useState } from 'react';
import { useQuery, gql, useSubscription, useMutation } from '@apollo/client';
import { PageProps } from 'gatsby';

const getTodosQuery = gql`
  query{ getTodos{ id title }  }
`
const addTodoMut = gql`
  mutation addNewTodo($text:String!) { 
    addTodo(todo:{title: $text, done:false}){ id title done } 
  }
`

const onAddTodoSubs = gql`
  subscription{
    onAddTodo{
      id title done
    }
  }
`

const index: FC<PageProps> = ({ }) => {
  const { data, error, loading } = useQuery(getTodosQuery);
  const [addNewTodo,] = useMutation(addTodoMut);
  const subscriptionData = useSubscription(onAddTodoSubs);
  const [todoTitle, setTodoTitle] = useState<string>('');
  // const subscribe = useSubscription(subscribeData);
  console.log("subscription data",subscriptionData.data);
  // console.log(data);

  const handleAddTodo = async (todoText: string) => {
    const data = await addNewTodo({ variables: { text: todoText } })
    console.log(data);
    setTodoTitle('');
  };


  if (loading) {
    return <div> <h1>Loading ....</h1> </div>
  }

  else if (error) {
    return <div style={{ color: 'red' }} ><h1>{error}</h1></div>
  }

  return (
    <div>
      <div>
        <input type="text" name='title' value={todoTitle} onChange={e => { setTodoTitle(e.target.value) }} />
        <button onClick={() => { handleAddTodo(todoTitle); }} >Add Todod</button>
      </div>
      <h1>Data Fetched</h1>
      <ul>
        {
          data?.getTodos.map((d, idx) => (
            <li key={idx} >{d?.title}</li>
          ))
        }
      </ul>
    </div>
  )
}

export default index;
