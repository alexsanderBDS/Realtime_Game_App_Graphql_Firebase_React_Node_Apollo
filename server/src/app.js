const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { ApolloServer, PubSub } = require("apollo-server-express");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
require("dotenv").config();

const port = process.env.PORT || 8000;
const app = express();
app.use(cors());

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "./graphql/typeDefs"))
);
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./graphql/resolvers"))
);

const pubsub = new PubSub();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ pubsub }),
});

apolloServer.applyMiddleware({ app });

const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
  console.log("Server running on port: " + port);
  console.log("Graphql running on " + apolloServer.graphqlPath);
  console.log("Subscription ready on" + apolloServer.subscriptionsPath);
});
