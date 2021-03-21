import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";

import { typeDefs } from "./Graphql/typeDefs.js";
import resolvers from "./Graphql/resolvers/index.js";
import { CONNECTION_URL } from "./config.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`server running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

mongoose.set("useFindAndModify", false); //no warn
