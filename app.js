const { lookupCompanies } = require("./services/ocean");
const {
  findDecisionMakersLinkedin,
} = require("./services/linkedinurl_prospeo");
const { findDecisionMakersEmail } = require("./services/email_prospeo");

async function outreach_pipeline() {
  try {

    // const domainData = await lookupCompanies(['openai.com']);

    const personData = await findDecisionMakersLinkedin([
      "openai.com",
      "google.com",
      "microsoft.com",
      "amazon.com",
      "facebook.com",
    ]);

    const personIds = personData.results
      .filter((item) => item.person?.person_id)
      .slice(0, 1)
      .map((item) => item.person.person_id);
    // const personIds = personData.results.map(item => item.person.person_id);


    // console.log(personData);

    // data.results.forEach(({ person, company }) => {
    //   console.log("Name:", person.full_name);
    //   console.log("Title:", person.current_job_title);
    //   console.log("LinkedIn:", person.linkedin_url);
    //   console.log("Company:", company.name);
    //   console.log("Website:", company.website);
    //   console.log("email:", person.email.email);
    //   console.log("Email MX Provider:", person.email);
    //   console.log("Person Id:", person.person_id);
    //   console.log("------------------");
    // });

    const personDataWithEmail = await findDecisionMakersEmail(personIds);


    // console.log(personDataWithEmail);

    // personDataWithEmail.matched.forEach(({ person, company }) => {
    //   console.log("Person Id:", person.person_id);
    //   console.log("Name:", person.full_name);
    //   console.log("Company:", company.name);
    //   console.log("email:", person.email.email);
    //   console.log("Title:", person.current_job_title);
    //   console.log("LinkedIn:", person.linkedin_url);
    //   console.log("Email MX Provider:", person.email);
    //   console.log("Website:", company.website);
    //   console.log("--------------------------------------------");
    // });

  } catch (err) {
    console.error(err);
  }
}

outreach_pipeline();
