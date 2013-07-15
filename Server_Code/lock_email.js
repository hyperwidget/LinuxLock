/*
    USAGE:  require("./lock_email");
            sendMail("address1, address2 ...");
            OR
            sendMail();    -will send mail to kaleidus.code@gmail.com

    Uses nodemailer module:
    npm install nodemailer
*/

var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
    host: "smtp.gmail.com",
    secureConnection: true,
    port: 465,
    auth: {
        user: "kaleidus.code@gmail.com",
        pass: "linux_lock"
    }
});

module.exports = {
sendMail: function(addresses){

    if(!addresses)
        addresses="kaleidus.code@gmail.com";

    var mailOptions = {
        from: "pione <kaleidus.code@gmail.com>",
        to: addresses,
        subject: "Linux Lock",
        text: "The lock has been triggered."
    }      

    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }
        else{
            console.log("Message successfully sent.");
        }
    });
}
};
