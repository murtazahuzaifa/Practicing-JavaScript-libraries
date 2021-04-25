import { merge } from 'lodash';
import { makeExecutableSchema, gql, ApolloServer, GraphQLUpload } from 'apollo-server';
import {GraphQLBoolean, } from 'graphql';

const Query = gql`
    type Query {
        user: User!
    }
`
const User = gql`
    type User {
        name: String!
        age: Int
    }
`

const queryResolvers = {
    Query: {
        user: () => ({ name: "murtaza", age: 15 })
    },

    User: ()=>({ name: "murtaza", age: 15 })
}

const resolvers = {}

const schema = makeExecutableSchema({
    typeDefs: [Query, User],
    resolvers: merge(resolvers, queryResolvers),
    allowUndefinedInResolve: false
})

const server = new ApolloServer({ schema, playground:{endpoint:"/play"} })

server.listen(3000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
})

// Hot Module Replacement
if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => console.log('Module disposed. '));
}