const { ApolloServer, gql } = require('apollo-server-express');
const countryJson = require('../data/data.json');

const typeDefs = gql`
  type CluiSuccessOutput {
    message: String!
  }

  type CluiMarkdownOutput {
    markdown: String!
  }

  type CluiErrorOutput {
    error: String!
  }

  type Countries {
    area: String!
  }

  union CluiOutput = CluiSuccessOutput | CluiMarkdownOutput | CluiErrorOutput

  type Query {
    search(query: String): [Countries!]!
    searchState(query: String, country: String): [Countries!]!
    cities(state: String, country: String): [Countries!]!
  }
`;

const resolvers = {
  Query: {
    search: (ctx, args) => {
      const filtered = args.query
        ? countryJson.world.data.filter(c =>
            c.area.toLowerCase().includes(args.query.toLowerCase())
          )
        : countryJson.world.data.slice(0, 10);
      return filtered;
    },
    cities: (ctx, args) => {
      const city = countryJson[args.country][args.state];
      return city.data;
    },
    searchState: (ctx, args) => {
      const { country } = args;
      const stateJson = countryJson[country];
      let stateData = null;
      stateData = Object.keys(stateJson).map(data => {
        return { area: data };
      });
      if (args.query) {
        stateData = stateData.filter(c =>
          c.area.toLowerCase().includes(args.query.toLowerCase())
        );
      }
      return stateData;
    }
  },

  CluiOutput: {
    __resolveType(obj) {
      if (obj.error) {
        return 'CluiErrorOutput';
      }

      if (obj.markdown) {
        return 'CluiMarkdownOutput';
      }

      return 'CluiSuccessOutput';
    }
  }
};

module.exports = server => {
  const apollo = new ApolloServer({ typeDefs, resolvers });
  apollo.applyMiddleware({ app: server });
};
