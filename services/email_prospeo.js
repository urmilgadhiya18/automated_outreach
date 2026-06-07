// const axios = require("axios");
// const dotenv = require("dotenv");

// dotenv.config();

// async function findDecisionMakersEmail(personIds) {
//     try {
//       const payload = {
//         only_verified_email: true,
//         data: personIds.map((id, index) => ({
//           identifier: String(index + 1),
//           person_id: id,
//         })),
//       };

//       const response = await axios.post(
//         "https://api.prospeo.io/bulk-enrich-person",
//         payload,
//         {
//           headers: {
//             "X-KEY": process.env.PROSPEO_API_KEY,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       return response.data;
//     } catch (error) {
//       console.log("STATUS:", error.response?.status);
//       console.log("DATA:", error.response?.data);
//       throw error;
//     }
//   }

// module.exports = { findDecisionMakersEmail };

const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

// Helper to pause execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function findDecisionMakersEmail(personIds) {
  console.log("----------------------------------------");
  console.log(
    `Starting email enrichment for ${personIds.length} person IDs...`,
  );
  console.log("----------------------------------------\n\n");

  const allEnrichedData = [];

  for (let i = 0; i < personIds.length; i++) {
    try {
      // Send only 1 person_id per request
      const payload = {
        only_verified_email: true,
        data: [
          {
            identifier: String(i + 1),
            person_id: personIds[i],
          },
        ],
      };

      const response = await axios.post(
        "https://api.prospeo.io/bulk-enrich-person",
        payload,
        {
          headers: {
            "X-KEY": process.env.PROSPEO_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );

      response.data.matched.forEach(({ person, company }) => {
        console.log("----------------------------------------");
        console.log("Person No.:", i + 1);
        console.log("Person Id:", person.person_id);
        console.log("Name:", person.full_name);
        console.log("Company:", company.name);
        console.log("Title:", person.current_job_title);
        console.log("email:", person.email.email);
        console.log("LinkedIn:", person.linkedin_url);
        console.log("Website:", company.website);
        console.log("Email MX Provider:", person.email);
        console.log("----------------------------------------\n");
      });

      // Collect the successful response
      allEnrichedData.push(response.data);
    } catch (error) {
      console.log(`Failed on person ID: ${personIds[i]}`);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      throw error;
    }

    // CRITICAL: Wait 1.1 seconds before the next request
    // to ensure you never exceed the 1 record/second limit.
    // We skip the delay on the very last item.
    if (i < personIds.length - 1) {
      await sleep(1100);
    }
  }

  console.log("\n----------------------------------------");
  console.log("Completed email enrichment for all person IDs.");
  console.log("----------------------------------------\n\n");
  return allEnrichedData;
}

module.exports = { findDecisionMakersEmail };
