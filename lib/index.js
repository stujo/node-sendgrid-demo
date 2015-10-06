require('dotenv').load();

var Email = require('./email');

var email_domain = process.env['EMAIL_DOMAIN'] || "example.com";

console.log("EMAIL TEST");

var mailer = new Email({});
mailer.quickEmail('author@' + email_domain, 'author@' + email_domain, 'Hello', 'World')
.then(function(data) {
    console.log("EMAIL SUCCESS", data);
})
.catch(function(error) {
    console.log("EMAIL ERROR", error);
});

var Newsletter = require('./newsletter');
console.log("NEWSLETTER TEST");

var newsletter = new Newsletter({});

newsletter.sendNewsletter('newsletter', [{
    name: 'John',
    pasta: 'Rigatoni',
    email: 'john.demo@' + email_domain
}, {
    name: 'Luca',
    email: 'luca.demo@' + email_domain,
    pasta: 'Tortellini'
}])
.then(function(data) {
    console.log("NEWSLETTER SUCCESS", data);
})
.catch(function(error) {
    console.log("NEWSLETTER ERROR", error);
});


// module.export = {
//     Newsletter: Newsletter,
//     Email: Email
// };
