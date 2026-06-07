const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const headers = {
  "x-api-token": process.env.OCEAN_API_TOKEN,
  "Content-Type": "application/json",
};

//  STEP 1: v2 LOOKUP (enrichment)
async function lookupCompany(domain) {
  const res = await fetch("https://api.ocean.io/v2/lookup/companies", {
    method: "POST",
    headers,
    body: JSON.stringify({
      domains: domain,
    }),
  });

  const data = await res.json();
  return data.companies?.[0] || null;
}

//STEP 2: FEATURE EXTRACTION (turn company → ICP filters)
function buildICP(company) {
  if (!company) return null;

  return {
    lookalikeDomains: [company.domain],

    companySizes: company.companySize ? [company.companySize] : undefined,

    industries: company.industries?.length
      ? {
          industries: company.industries,
          mode: "anyOf",
        }
      : undefined,

    industryCategories: company.industryCategories?.length
      ? {
          industryCategories: company.industryCategories,
          mode: "anyOf",
        }
      : undefined,

    primaryLocations: company.primaryCountry
      ? {
          includeCountries: [company.primaryCountry],
        }
      : undefined,

    keywords: company.keywords?.length
      ? {
          any_of: company.keywords,
        }
      : undefined,

    webTraffic: company.webTraffic
      ? {
          visits: {
            from: Math.max(0, (company.webTraffic.visits || 0) * 0.5),
            to: (company.webTraffic.visits || 0) * 2,
          },
        }
      : undefined,
  };
}

// STEP 3: CLEAN FILTER OBJECT (remove undefined keys)
function clean(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  );
}

// STEP 4: v3 SEARCH (lookalike companies)
async function searchCompanies(filters) {
  const res = await fetch("https://api.ocean.io/v3/search/companies", {
    method: "POST",
    headers,
    body: JSON.stringify({
      companiesFilters: filters,
    }),
  });

  const data = await res.json();
  return data;
}

async function lookupCompanies(domain) {
  try {
    console.log("Looking up:", domain);

    // Step 1: enrich
    const company = await lookupCompany(domain);

    if (!company) {
      console.log("No company found in v2 lookup");
      return;
    }

    console.log("Company found:", company.name);


    // Step 2: build ICP
    const icp = buildICP(company);
    const filters = clean(icp);

    // console.log("Generated ICP filters:", filters);


    // Step 3: search lookalikes
    const results = await searchCompanies(filters);

    // console.log("Total results:", results.total);
    // console.log("Top companies:");

    // results.companies.forEach((c, i) => {
    //   console.log(`${i + 1}. ${c.company.name} (${c.company.domain})`);
    // });

    return results;
  } catch (error) {
    throw error.response?.data || error;
  }
}

module.exports = { lookupCompanies };