import { InMemoryCache, ApolloClient, HttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import fetch from 'cross-fetch';

const authLink = setContext((_, { headers }) => {
    // ref https://www.apollographql.com/docs/react/networking/authentication/
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            "x-api-key": process.env.API_KEY,
        }
    }
});

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/',
    fetch,
})

const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: {
        reconnect: true
    }
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
        );
    },
    wsLink,
    authLink.concat(httpLink),
);

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
})