var debug = require('debug')('demo:newsletter');
var Email = require('./email');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');

function Newsletter(global_options) {
    this.global_options = global_options;
}

Newsletter.prototype.allSettled = function(email_promises) {
    var allSettledPromise = new Promise(function(resolve, reject) {
        // Keep Count
        var counter = email_promises.length;

        // Keep Individual Results in Order
        var settlements = [];
        settlements[counter - 1] = undefined;

        function checkResolve() {
            counter--;
            if (counter == 0) {
                resolve(settlements);
            }
        }

        function recordResolution(index, data) {
            settlements[index] = {
                success: true,
                data: data
            };
            checkResolve();
        }

        function recordRejection(index, error) {
            settlements[index] = {
                success: false,
                error: error
            };
            checkResolve();
        }

        // Attach to all promises in array
        email_promises.forEach(function(email_promise, index) {
            email_promise.then(recordResolution.bind(null, index))
                .catch(recordRejection.bind(null, index));
        });
    });
    return allSettledPromise;
}


Newsletter.prototype.sendNewsletter = function(template_name, users) {

    var global_options = this.global_options;

    var emailer = new Email();

    var templateDir = path.join(__dirname, '..', 'templates', template_name);

    var template = new EmailTemplate(templateDir, global_options.template_options);

    var email_promises = users.map(function(user) {
        debug('Mapping user ' + user);
        var render_promise = template.render(user);

        return render_promise.then(function(rendered) {
            debug('Sending email for user ' + user);
            var email = emailer.buildEmail({
                to: user.email,
                from: global_options.from,
                text: rendered.text,
                html: rendered.html,
                subject: 'Newsletter'
            });
            return emailer.sendEmail(email)
        });
    })

    return this.allSettled(email_promises);
}

module.exports = Newsletter
