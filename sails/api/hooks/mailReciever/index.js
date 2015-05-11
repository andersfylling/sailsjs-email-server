/**
 * mailReciever hook
 */

module.exports = function (sails) {
    /*
    *   private methods, used for async series
    */
    //check if data is acceptable
    function handleResponse(data, cb) {
        //respondtypes to haraka server
        var response = {
            good: 1,
            bad: 0
        };

        //check if data is able to json stringify and parse
        //else return bad repsonse
        try {
            var handled = JSON.parse(data);
        } catch (e) {
            return response.bad;
        };

        //all ok
        return response.good;
    }

    //check if legit connection
    function security(socket, cb) {
        var async = require("async");

        async.parallel({
            ip: function (callback) {
                if (socket.remoteAddress == "127.0.0.1") callback(null, 1);
            },
            two: function (callback) {
                if (socket.remotePort == "25") callback(null, 1);
            }
        },
        function (err, results) {
            //if any error, report it
            for (var i = results.length; i >= 0; i--) {
                if (results[i] !== 1) cb(null, "security error at: " + i);
            }

            //if no error then report back everything is ok
            cb(null, 1);
        });
    }


    function server() {
        var net = require("net");
        var async = require("async");


        // Start a TCP Server
        net.createServer(function (socket) {

            //not sure how to handle the security checks and so on...



            // Handle incoming messages from clients.
            socket.on('data', function (data) {
                broadcast(socket.name + "> " + data, socket);
            });

            // on disconnect
            socket.on('end', function () { /* nothing */ });

        }).listen(4020);

        async.series({
            one: function (callback) {
                setTimeout(function () {
                    callback(null, 1);
                }, 200);
            },
            two: function (callback) {
                setTimeout(function () {
                    callback(null, 2);
                }, 100);
            }
        },
        function (err, results) {
            // results is now equal to: {one: 1, two: 2}
        });


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
