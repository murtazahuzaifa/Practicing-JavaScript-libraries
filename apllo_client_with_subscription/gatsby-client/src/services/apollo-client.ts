import { InMemoryCache, ApolloClient, HttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ws from "ws"
import fetch from 'cross-fetch';

const authLink = setContext((_, { headers }) => {
    // ref https://www.apollographql.com/docs/react/networking/authentication/
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            "x-api-key": process.env.GRAPHQL_API_KEY,
        }
    }
});

const wsForNode = typeof window === "undefined" ? ws : null;

const httpLink = new HttpLink({
    uri: 'https://g3uwalfv3fgxxl655vgjxkzaei.appsync-api.us-east-2.amazonaws.com/graphql',
    fetch,
})

// ref https://dev.to/hasurahq/create-a-real-time-web-app-with-hasura-and-gatsby-41fi
const wsClient = new SubscriptionClient(
    "wss://g3uwalfv3fgxxl655vgjxkzaei.appsync-realtime-api.us-east-2.amazonaws.com/graphql",
    {
        reconnect: true,
        connectionParams: {
            "API_KEY": process.env.GRAPHQL_API_KEY,
        },
    },
    wsForNode
)

const wsLink = new WebSocketLink(wsClient)

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