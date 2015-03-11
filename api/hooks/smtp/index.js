/**
 * smtp hook
*/

module.exports = function (sails) {
    var self = this;



    return {

        /**
        * Default configuration
        * @type {Object}
        */
        defaults: function () {
            var obj = {
                //server port



            };

            return obj;
        },

    // Run when sails loads-- be sure and call `next()`.
        initialize: function (next) {
        var SMTPServer = require("smtp-server").SMTPServer;
        var MailParser = require("mailparser").MailParser;
        var mailparser = new MailParser();

          var SERVER_PORT = 25;
          var SERVER_HOST = '0.0.0.0';

          // Connect to this example server by running
          //   telnet localhost 1337
          // or
          //   nc -c localhost 1337

          // Authenticate with this command (username is 'testuser' and password is 'testpass')
          //   AUTH PLAIN dGVzdHVzZXIAdGVzdHVzZXIAdGVzdHBhc3M=

          // Setup server
          var server = new SMTPServer({

              // not required but nice-to-have
              banner: 'Welcome to My Awesome SMTP Server',

              // disable STARTTLS to allow authentication in clear text mode
              disabledCommands: ['AUTH'],

              // Validate MAIL FROM envelope address. Example allows all addresses that do not start with 'deny'
              // If this method is not set, all addresses are allowed
              onMailFrom: function (address, session, callback) {
                  if (/^deny/i.test(address.address)) {
                      return callback(new Error('Not accepted'));
                  }
                  callback();
              },

              // Validate RCPT TO envelope address. Example allows all addresses that do not start with 'deny'
              // If this method is not set, all addresses are allowed
              onRcptTo: function (address, session, callback) {
                  if (/^deny/i.test(address.address)) {
                      return callback(new Error('Not accepted'));
                  }
                  callback();
              },

              // Handle message stream
              onData: function (stream, session, callback) {
                  //stream.pipe(process.stdout);
                  //stream.on('end', callback); // accept the message once the stream is ended
                  mailparser.on('end', function (mail) {
                      //save mail to mongodb
                      callback();
                  });
                  stream.pipe(mailparser);
              }
          });

          server.on('error', function (err) {
              console.log('Error occurred');
              console.log(err);
          });

          // start listening
          server.listen(SERVER_PORT, SERVER_HOST);







      return next();
    }

  };
};
