/**
 * MailController
 *
 * @description :: Server-side logic for managing mails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    save: function (mail, cb) {
        if (typeof mail === "string") mail = JSON.parse(mail)

        Mail.create(mail).done(function (err, mail) {
            if (err) {
                cb(err, null);
            }
            else {
                cb(null, mail._id);
            }
        });
    },

    notifyReciever: function (mail, _id) {
        //if socket with users mail, send socket data

        //forward email, if masked type
    },
	
};

