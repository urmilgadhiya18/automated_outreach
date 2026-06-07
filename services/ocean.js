const axios = require('axios');
// const dotenv = require('dotenv');

// dotenv.config();

async function lookupCompanies(domains) {
  try {
    const response = await axios.post(
      'https://api.ocean.io/v2/lookup/companies',
      {
        domains
      },
      {
        headers: {
          'x-api-token': process.env.OCEAN_API_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}


module.exports = {lookupCompanies};