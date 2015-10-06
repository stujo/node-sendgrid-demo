if (!process.env['SENDGRID_API_USER'] ||
    !process.env['SENDGRID_API_PASSWORD']) {
    throw "SENDGRID_API_USER and SENDGRID_API_PASSWORD must be set in the env";
}

var sendgrid = require('sendgrid')(process.env['SENDGRID_API_USER'], process.env['SENDGRID_API_PASSWORD']);

function Email(global_options) {

    this.global_options = global_options;
}

Email.prototype.sendEmail = function(email) {

    var promise = new Promise(function(resolve, reject) {
        sendgrid.send(email, function(err, json) {
            if (err) {
                reject(err);
            } else {
                resolve(json);
            }
        });

    });

    return promise;
};

Email.prototype.buildEmail = function(options) {
    return new sendgrid.Email(options);
}

Email.prototype.quickEmail = function(to, from, subject, text) {

    var email = this.buildEmail({
        to: to,
        from: from,
        subject: subject,
        text: text
    });

    return this.sendEmail(email);
}


module.exports = Email;
