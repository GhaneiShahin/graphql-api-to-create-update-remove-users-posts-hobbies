const express = require("express");
const mongoose = require("mongoose");
const graphqlHttp = require("express-graphql");
const dotenv = require("dotenv");

const schema = require("./schema/schema");
const testSchema = require("./schema/types_schema");
const cors = require('cors');

dotenv.config();

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection.once("open", () => {
  console.log("YES! WE ARE CONNECTED TO DB!");
});

const app = express();
const PORT = 3001;

app.use(cors());

app.use(
  "/graphql",
  graphqlHttp({
    graphiql: true,
    schema: schema,
  })
);

app.listen(PORT, () => {
  console.log("Listening for requests on port", PORT);
});
