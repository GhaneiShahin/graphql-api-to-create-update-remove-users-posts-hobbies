const graphql = require("graphql");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
} = graphql;

//Scalar Type
/*
String = GraphQLString
Init
Float
Boolean
ID
*/
const Person = new GraphQLObjectType({
  name: "Person",
  description: "Represents a person type!",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    isMarried: { type: GraphQLBoolean },
    gpa: { type: GraphQLFloat },

    justAType: {
      type: Person,
      resolve(parent, args) {
        return parent;
      },
    },
  }),
});

//RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Description",
  fields: {
    person: {
      type: Person,
      resolve(parent, args) {
        let personObj = {
          name: "Shahin",
          age: 25,
          isMarried: false,
          gpa: 4.0,
        };
        return personObj;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
