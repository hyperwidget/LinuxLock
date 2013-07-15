/*
    USAGE: node lock_email.js [ emailAddresses(seperated by spaces) ]
    Uses nodemailer module:
    npm install nodemailer
*/

var nodemailer = require("nodemailer");

var addresses = "";
process.argv.slice(2).forEach(function (val){
    addresses= addresses+val+",";
});
if(addresses.length != 0)
    addresses=addresses.slice(0,-1);
else
    addresses="kaleidus.code@gmail.com";

var smtpTransport = nodemailer.createTransport("SMTP",{
    host: "smtp.gmail.com",
    secureConnection: true,
    port: 465,
    auth: {
        user: "kaleidus.code@gmail.com",
        pass: "linux_lock"
    }
});
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
