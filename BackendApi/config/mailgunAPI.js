const mailgun = require("mailgun-js");
const DOMAIN = "YOUR_DOMAIN_NAME";
const mg = mailgun({ apiKey: api_key, domain: DOMAIN });
const data = {
  from: "Excited User <me@samples.mailgun.org>",
  to: "bar@example.com, YOU@YOUR_DOMAIN_NAME",
  subject: "Hello",
  text: "Testing some Mailgun awesomness!",
};
mg.messages().send(data, function (error, body) {
  console.log(body);
});
