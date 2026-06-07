const readline = require("readline");
const { lookupCompanies } = require("./services/ocean");
const {
  findDecisionMakersLinkedin,
} = require("./services/linkedinurl_prospeo");
const { findDecisionMakersEmail } = require("./services/email_prospeo");
const { sendEmail } = require("./services/brevo");
const { outreachSummary } = require("./services/outreach_summry");

async function outreach_pipeline() {
  try {
    const domain = await getSeedDomain();

    const domainData = await lookupCompanies([domain]);

    const domains = domainData.companies.map((item) => item.company.domain);

    console.log("\n--------------------------------------------");
    console.log("Lookalike Company Domains:", domains);
    console.log("--------------------------------------------\n");

    const personData = await findDecisionMakersLinkedin(domains);

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

    // personDataWithEmail.forEach((response) => {
    //     response.matched.forEach(({ person, company }) => {
    //         console.log("Person Id:", person.person_id);
    //         console.log("Name:", person.full_name);
    //         console.log("Company:", company?.name);
    //         console.log("Email:", person.email?.email);
    //         console.log("Title:", person.current_job_title);
    //         console.log("LinkedIn:", person.linkedin_url);
    //         console.log("Website:", company?.website);
    //         console.log("--------------------------------------------\n");
    //     });
    // });

    const confirmed = await outreachSummary(
      3,
      domain.length,
      personIds.length,
      personDataWithEmail,
    );

    if (!confirmed) {
      console.log("\n--------------------------------------------");
      console.log("Email sending cancelled by user.");
      console.log("--------------------------------------------\n");
      return;
    }

    for (const response of personDataWithEmail) {
      for (const { person, company } of response.matched) {
        if (!person.email?.email) continue;

        await sendEmail({
          toEmail: person.email.email,
          toName: person.full_name,
          companyName: company?.name,
          jobTitle: person.current_job_title,
        });

        console.log("\n--------------------------------------------");
        console.log(`Email sent to ${person.full_name}`);
        console.log("--------------------------------------------\n");
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function getSeedDomain() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const domain = await new Promise((resolve) => {
    rl.question("Enter seed company domain: ", resolve);
  });

  rl.close();

  return domain.trim();
}

outreach_pipeline();
