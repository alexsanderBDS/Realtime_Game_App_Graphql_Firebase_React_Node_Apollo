import "./App.css";
import { Switch, Route } from "react-router-dom";
import Footer from "./pages/components/Footer";
import Header from "./pages/components/Header";
import Rooms from "./pages/components/Rooms";
import Welcome from "./pages/components/Welcome";
import Home from "./pages/Home";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_WS_GRAPHQL_ENDPOINT,
    options: {
      reconnect: true,
    },
  });

  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);

      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/rooms" component={Rooms} />
          <Route exact path="/welcome/:params" component={Welcome} />
          <Route exact path="/*" component={Home} />
        </Switch>
        <Footer />
      </ApolloProvider>
    </div>
  );
}

export default App;
