import React from 'react';
import gql from 'graphql-tag';
import { useApolloClient } from '@apollo/react-hooks';
import { Session } from '@replit/clui-session';
import clear from './commands/clear';
import countryFn from './commands/country';

import Prompt from './Prompt';

// eslint-disable-next-line

const Terminal = () => {
  const client = useApolloClient();

  const countrySearch = async query => {
    return client.query({
      query: gql`
        query Q($query: String) {
          search(query: $query) {
            area
          }
        }
      `,
      variables: { query },
      fetchPolicy: 'network-only'
    });
  };
  const getState = async (query, country) => {
    return client.query({
      query: gql`
        query Q($query: String, $country: String) {
          searchState(query: $query, country: $country) {
            area
          }
        }
      `,
      variables: { query, country },
      fetchPolicy: 'network-only'
    });
  };
  const showCity = (selectedCountry, state) => {
    return client.query({
      query: gql`
        query Q($state: String, $selectedCountry: String) {
          cities(state: $state, country: $selectedCountry) {
            area
          }
        }
      `,
      variables: { selectedCountry, state },
      fetchPolicy: 'network-only'
    });
    // return <h1>Hi Kamal </h1>
  };

  const command = {};
  command.commands = {
    country: countryFn(countrySearch, getState, showCity),
    clear
  };
  return (
    <div>
      {!command ? (
        'loading...'
      ) : (
        <Session>
          <Prompt command={command} />
        </Session>
      )}
      <style jsx>
        {`
          div {
            padding: 20px;
            min-height: 100vh;
            background-color: #222;
            color: white;
          }
        `}
      </style>
    </div>
  );
};

export default Terminal;
