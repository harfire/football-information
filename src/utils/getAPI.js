import axios from 'axios';

export default async function getAPI(method, url, params = {}) {
  const config = {
    url,
    method,
    params,
    headers: {
      'x-rapidapi-host': `${process.env.REACT_APP_HOST}`,
      'x-rapidapi-key': `${process.env.REACT_APP_KEY}`,
    },
  };

  const result = await axios(config)
    .then((res) => {
      if (res) {
        return res;
      }
    })
    .catch((error) => {
      return error;
    });

  return result;
}
