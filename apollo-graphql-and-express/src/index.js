const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { resolvers } = require('./resolvers');
const { typeDefs } = require('./typeDefs');

const http = require('http');

// const app = express();
// const port = process.env.PORT || 5000;

// const server = new ApolloServer({
//     typeDefs,
//     resolvers
// })

// server.applyMiddleware({ app })

// app.get('/api/v1', (req, res, next) => {
//     res.status(200).json({ success: true, message: `convertion initialize` });

// });


async function startApolloServer() {
    const PORT = process.env.PORT || 5000;
    const app = express();


    const server = new ApolloServer({
        typeDefs, resolvers,
        subscriptions: {
            onConnect: () => { console.log('user connect'); true },
            onDisconnect: () => { console.log('user disconnect'); }
        }
    });
    await server.start();
    server.applyMiddleware({ app })

    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);

    // Make sure to call listen on httpServer, NOT on app.
    await new Promise(resolve => httpServer.listen(PORT, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);

    app.get('/api/v1', (req, res, next) => {
        res.status(200).json({ success: true, message: `convertion initialize` });
    });

    return { server, app, httpServer };
}

startApolloServer()
    // .then(({ app }) => {

    //     app.get('/api/v1', (req, res, next) => {
    //         res.status(200).json({ success: true, message: `convertion initialize` });
    //     });

    // })