/**
 * mailReciever hook
 */

module.exports = function (sails) {
    //check if data is acceptable
    function validJSON(data) {
        //check if data is able to json stringify and parse
        //else return bad repsonse
        try {
            var handled = JSON.parse(data);
        } catch (e) {
            return false;
        };

        //all ok
        return true;
    }

    //check port and ip, should all be internal!
    function senderIsValid(socket) {
        var validSenders = {
            remoteAddress: [
                "127.0.0.1",
                "::1",
                "localhost"
            ],
            remotePort: [
                "25",
                "2525"
            ],
            token: "gGfnmd583hgIfiDISIAPWM423Mmn" //hardcoded!

        };

        if (validSenders.remoteAddress.indexOf(socket.remoteAddress) >= 0) {
            if (validSenders.remotePort.indexOf(socket.remotePort) >= 0) {
                if (validSenders.token.indexOf(socket.privateToken) >= 0) return true;
            }
        }

        return false;
    }


    function server() {
        var net             = require("net");
        var async           = require("async");
        

        // Start a TCP Server
        net.createServer(function (socket) {

            // Handle incoming messages from clients.
            socket.on('data', function (data) {

                //if valid sender
                if (!senderIsValid(socket, data)) socket.write(0);

                //if json valid format
                else if (!validJSON(data)) socket.write(2);

                //else write 1
                else {
                    //send to controller (sails)
                    sails.controllers.Mail.save(data, function (err, _id) {
                        sails.controllers.Mail.notifyReciever(data, _id);
                    });

                    //write response
                    socket.write(1);
                }

            });

            // on disconnect
            socket.on('end', function () { /* nothing */ });

        }).listen(4020);


    } //end server()





    //hook
    return {

        //defaults



        // Run when sails loads-- be sure and call `next()`.
        initialize: function (next) {

            // start server
            server();


            return next();
        }

  };
};
