const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const DECISION_MAKER_TITLES = [
  // C-Suite
  "CEO",
  "Chief Executive Officer",

  "CTO",
  "Chief Technology Officer",

  "CFO",
  "Chief Financial Officer",

  "COO",
  "Chief Operating Officer",

  "CMO",
  "Chief Marketing Officer",

  "CRO",
  "Chief Revenue Officer",

  "Chief Product Officer",
  "CPO",

  "Chief Information Officer",
  "CIO",

  "Chief Data Officer",
  "CDO",

  "Chief Security Officer",
  "CSO",

  // Founders
  "Founder",
  "Co-Founder",
  "Founder & CEO",
  "Managing Founder",

  // Presidents
  "President",
  "Vice President",
  "VP",

  // Senior VPs
  "SVP",
  "Senior Vice President",

  "EVP",
  "Executive Vice President",

  // Directors
  "Director",
  "Engineering Director",
  "Director of Engineering",
  "Director of Product",
  "Director of Technology",

  // General Managers
  "General Manager",
  "Managing Director",
];

async function findDecisionMakersLinkedin(domainNames) {
  try {
    console.log("----------------------------------------");
    console.log("Searching for decision makers at given domains...");
    console.log("----------------------------------------\n\n");

    const response = await axios.post(
      "https://api.prospeo.io/search-person",
      {
        page: 1,
        filters: {
          company: {
            websites: {
              include: domainNames,
            },
          },
          person_job_title: {
            include: DECISION_MAKER_TITLES,
          },
        },
      },
      {
        headers: {
          "X-KEY": process.env.PROSPEO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("----------------------------------------");
    console.log(`Found ${response.data.results.length} decision makers. Enriching data with LinkedIn URLs...`,);
    console.log("----------------------------------------\n\n");

    return response.data;
  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    throw error;
  }
}

module.exports = { findDecisionMakersLinkedin };

// async function findDecisionMakers(domainNames) {
//   // Search decision makers
//   try{
//     const searchResponse = await axios.post(
//       "https://api.prospeo.io/search-person",
//       {
//         page: 1,
//         filters: {
//           company: {
//             websites: {
//               include: domainNames
//             }
//           },
//           person_job_title: {
//             include: DECISION_MAKER_TITLES
//           }
//         }
//       },
//       {
//         headers: {
//           "X-KEY": process.env.PROSPEO_API_KEY,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const people = searchResponse.data.results;

//     // Build enrichment payload
//     const enrichData = people.map((item, index) => ({
//       identifier: String(index + 1),
//       person_id: item.person.id // verify actual field name
//     }));

//     // Get emails
//     const enrichResponse = await axios.post(
//       "https://api.prospeo.io/bulk-enrich-person",
//       {
//         only_verified_email: true,
//         data: enrichData
//       },
//       {
//         headers: {
//           "X-KEY": process.env.PROSPEO_API_KEY,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     return enrichResponse.data;
//   } catch (error) {
//     console.log("STATUS:", error.response?.status);
//     console.log("DATA:", error.response?.data);
//     throw error;
//   }
// }

// module.exports = { findDecisionMakers };
