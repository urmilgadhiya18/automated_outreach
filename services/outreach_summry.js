const readline = require("readline")

async function outreachSummary(summaryLength, domainLength, personIdsLength, personDataWithEmail) {

    console.log("\n======================================");
    console.log("         OUTREACH SUMMARY");
    console.log("======================================");
    console.log("Companies Searched:", domainLength);
    console.log("Decision Makers Found:", personIdsLength);
    console.log("Verified Emails Found:", personDataWithEmail.length);
    console.log("Emails Ready To Send:", personDataWithEmail.length);

    console.log("\nSample Recipients:\n");

    personDataWithEmail.slice(0, summaryLength).forEach((response, index) => {
        response.matched.forEach(({ person, company }) => {
            console.log(`${index + 1}. ${person.full_name}`);
            console.log(`   ${person.current_job_title}`);
            console.log(`   ${company.name}`);
            console.log(`   ${person.email.email}`);
            console.log("");
        });
    });

    console.log("======================================");


    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer = await new Promise((resolve) => {
        rl.question(
        "\nProceed with sending emails? (yes/no): ",
        resolve
        );
    });

    rl.close();

    return answer.trim().toLowerCase() === "yes";
}

module.exports = { outreachSummary };