const express = require("express");
const fs = require("fs");
const { ApolloServer, UserInputError } = require("apollo-server-express");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const { MongoClient } = require("mongodb");

const GraphQLDate = new GraphQLScalarType({
  name: "GraphQLDate",
  description: "A Date() type in GraphQL as a scalar",
  serialize(value) {
    return value.toISOString();
  },

  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      const value = new Date(ast.value);
      return isNaN(value) ? undefined : value;
    }
  },
  parseValue(value) {
    const dateValue = new Date(value);
    return isNaN(dateValue) ? undefined : dateValue;
  },
});

let aboutMessage = "Issue Tracker API V1.0";

const url = "mongodb://localhost/issuetracker";
let db;

function issueValidate(issue) {
  const errors = [];
  if (issue.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.');
  }

  if (issue.status == "Assigned" && !issue.owner) {
    errors.push('Field "owner" is required when status is "Assigned"');
  }

  if (errors.length > 0) {
    throw new UserInputError("Invalid input(s)", { errors });
  }
}

const resolvers = {
  Query: {
    about: () => aboutMessage,
    issueList,
  },
  Mutation: {
    setAboutMessage,
    issueAdd,
  },
  GraphQLDate,
};

function setAboutMessage(_, { message }) {
  return (aboutMessage = message);
}

async function issueList() {
  const issues = await db.collection("issues").find({}).toArray();
  console.log(issues);
  return issues;
}

async function getNextSequence(name) {
  const result = await db
    .collection("counters")
    .findOneAndUpdate(
      { _id: name },
      { $inc: { current: 1 } },
      { returnOriginal: false }
    );
  return result.value.current;
}

async function issueAdd(_, { issue }) {
  console.log(issue);
  issueValidate(issue);
  issue.created = new Date();
  issue.id = await getNextSequence("issues");
  const result = await db.collection("issues").insertOne(issue);
  const saveIssue = await db
    .collection("issues")
    .findOne({ _id: result.insertedId });
  console.log(saveIssue)
  return saveIssue;
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync("schema.graphql", "utf-8"),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

const app = express();

server.applyMiddleware({ app, path: "/graphql" });

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log("Connect to MongoDB at", url);
  db = client.db();
}

(async function () {
  try {
    await connectToDb();
    app.listen(3000, function () {
      console.log("API server started on port 3000");
    });
  } catch (err) {
    console.log("ERROR:", err);
  }
})();
