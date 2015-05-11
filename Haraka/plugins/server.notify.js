// server.notify

// documentation via: haraka -c C:\Workspace\projects\nodejs\codewolf.red\sandbox\EMAIL-SERVER\alpha\sailsjs-email-server\Haraka -h plugins/server.notify

// Put your plugin code here
// type: `haraka -h Plugins` for documentation on how to create a plugin
exports.hook_server = function (next, connection, params) {
    //nodejs conenction to server and send email

    var net             = require('net'),
        sailsEmailPort  = 4020,
        client          = new net.Socket();

    function sendMail(client, mail) {
        client.write(mail);
    }


    client.connect(sailsEmailPort, '127.0.0.1', function () {
        sendMail(client, params);
    });

    client.on('data', function (data) {
        //server responds 1 for OK or 0 for not OK!
        if (data == "1") client.destroy(); // kill client after server's response
        else sendMail(client, params);
    });

    client.on('close', function () {/* nothing */});


    next();
}