// server.notify

// documentation via: haraka -c C:\Workspace\projects\nodejs\codewolf.red\sandbox\EMAIL-SERVER\alpha\sailsjs-email-server\Haraka -h plugins/server.notify

// Put your plugin code here
// type: `haraka -h Plugins` for documentation on how to create a plugin


exports.hook_server = function (next, connection, params) {
    //nodejs conenction to server and send email

    var net             = require('net'),
        sailsEmailPort  = 4020,
        client          = new net.Socket(),
        token           = "gGfnmd583hgIfiDISIAPWM423Mmn",
        tries           = 0;

    function sendMail(client, mail) {
        mail.privateToken = token;
        var m = JSON.stringify(mail);

        client.write(JSON.stringify(mail));
    }


    client.connect(sailsEmailPort, '127.0.0.1', function () {
        sendMail(client, params);
    });

    client.on('data', function (data) {
        //server responds 1 for OK or 0 for not OK!
        if (data == "2" && tries < 3) { //after 3 tries, give up
            tries++;
            sendMail(client, params) //if data was curropted, try again
        } else if (data == "0") {
            tries = 0;
            return next(DENY, "Server is experiencing problems. Try another way to contact the account.");
        } else if (tries >= "3") {
            tries = 0;
            return next(DENY, "Server is unable to understand the mail structure. Identified mail as corrupted.");
        } else {
            tries = 0;
            client.destroy(); // kill client after server's response
        }
    });

    client.on('close', function () {/* nothing */});

    //everything is good
    next();
}