const axios = require("axios");

async function sendEmail({ toEmail, toName, companyName, jobTitle }) {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.SENDER_NAME,
          email: process.env.SENDER_EMAIL,
        },

        to: [
          {
            email: toEmail,
            name: toName,
          },
        ],

        subject: `Quick question about ${companyName}`,

        htmlContent: `
          <html>
            <body>
              <p>Hi ${toName},</p>

              <p>
                I came across ${companyName} and noticed you're currently serving as
                <b>${jobTitle}</b>.
              </p>

              <p>
                We're helping companies automate prospect research,
                contact discovery, and personalized outreach workflows.
              </p>

              <p>
                Thought it might be relevant to what your team is working on.
              </p>

              <p>
                Would you be open to a quick 15-minute conversation?
              </p>

              <p>
                Best Regards,<br/>
                ${process.env.SENDER_NAME}
              </p>
            </body>
          </html>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw error;
  }
}

module.exports = { sendEmail };
