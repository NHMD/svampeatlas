'use strict';
var nodemailer = require('nodemailer');
var Promise = require('bluebird')
var config = require('../../config/environment');


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    
    	host: config.mail.server,
		port: config.mail.port
    ,
    auth: {
        user: config.mail.address,
        pass: config.mail.password
    }
});

Promise.promisifyAll(transporter);
// setup email data with unicode symbols


exports.sendRestPassWordMail = function(email, initials, token){
	//var url = "http://localhost:9000";
	var url = "https://svampe.databasen.org";
	var mailOptions = {
	    from: '"Svampedatabasen 🍄" <'+config.mail.address+'>', // sender address
	    to: email, // list of receivers
	    subject: 'Glemt password til svampe.databasen.org', // Subject line
	    text: `Du har bedt om at få nulstillet password for bruger med initialer: "${initials}".\n Åbn dette link og opdatér dit password: ${url}/forgot?token=${token} \n Linket er gyldigt i en time. \n Denne mail kan ikke besvares. \n \n \n ---------------------------
		You have requested a password reset for the user with initials: "${initials}". \n Open this link and update your password: ${url}/forgot?token=${token} \n The link is valid for one hour.\n Do not reply to this email.`, // plain text body
	    html: `<p>Du har bedt om at få nulstillet password for bruger med initialer: "${initials}".</p><p>Åbn dette link og opdatér dit password: <br><a href="${url}/forgot?token=${token}"> Opdatér password</a> </p><p> Linket er gyldigt i en time.<br> Denne mail kan ikke besvares.</p><br><br> --------------------------- 
		<p> You have requested a password reset for the user with initials: "${initials}". <p>Open this link and update your password: <br><a href="${url}/forgot?token=${token}"> Update password</a> </p><p>The link is valid for one hour.<br> Do not reply to this email. </p>` // html body
	};
	
	
	
	
	// send mail with defined transport object
	return	transporter.sendMailAsync(mailOptions);
	
	

	
}


// SELECT Initialer, name, email FROM Users WHERE email IN (select  email  FROM Users GROUP BY email HAVING COUNT(distinct name) >1) AND email IS NOT NULL AND email != '' ORDER BY email;