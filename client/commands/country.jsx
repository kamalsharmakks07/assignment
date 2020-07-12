import React, { useEffect, useState } from 'react';
import Row from '../Row';

const DisplayCity = props => {
  const [cityData, setCityData] = useState(null);
  const { country, state } = props;
  useEffect(() => {
    props.showCity(country, state).then(city => {
      setCityData(city.data.cities);
    });
  }, [country, state]);
  return (
    <>
      <Row>
        {cityData !== null && cityData && cityData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>city</th>
              </tr>
            </thead>
            <tbody>
              {cityData.map(city => {
                return (
                  <tr>
                    <td>{city.area}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <h1>Loading....</h1>
        )}
      </Row>
    </>
  );
};

export default (searchCountry, getState, showCity) => {
  return {
    description: 'Select Country',
    commands: async query => {
      const res = await searchCountry(query);
      if (res.data.search) {
        return res.data.search.reduce((acc, country) => {
          acc[country.area] = {
            description: 'Click to know more',
            commands: async stateQuery => {
              const finalState = {};
              const allState = await getState(stateQuery, country.area);
              if (allState.data.searchState) {
                allState.data.searchState.map(async data => {
                  finalState[data.area] = {
                    description: `Click to know more about ${country.area}`,
                    run: () => (
                      <DisplayCity
                        showCity={showCity}
                        country={country.area}
                        state={data.area}
                      />
                    )
                  };
                  return finalState;
                });
              }
              return finalState;
            }
          };
          return acc;
        }, {});
      }

      return {};
    }
  };
};
