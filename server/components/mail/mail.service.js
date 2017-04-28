'use strict';
var nodemailer = require('nodemailer');
var Promise = require('bluebird')
var config = require('../../config/environment');

//var url = "http://localhost:9000";
var url = "https://svampe.databasen.org";

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


exports.sendNewUserConfirmationEmail = function(usr, token){
	
	var mailOptions = {
	    from: '"Svampedatabasen 🍄" <'+config.mail.address+'>', // sender address
	    to: usr.email, // list of receivers
	    subject: 'Bekræft brugeroprettelse på svampe.databasen.org', // Subject line
	    text: `Kære ${usr.name} \n For at aktivere din brugerprofil "${usr.Initialer}" på svampe.databasen.org skal du åbne dette link og følge instruktionerne:\n ${url}/confirm?token=${token} \n Linket er gyldigt i 12 timer. \n Denne mail kan ikke besvares. \n \n \n ---------------------------
		Dear ${usr.name} \n To activate your user account "${usr.Initialer}" on svampe.databasen.org open this link and follow the instructions: ${url}/confirm?token=${token} \n The link is valid for 12 hours.\n Do not reply to this email.`, // plain text body
	    html: `<p>Kære ${usr.name} </p><p>For at aktivere din brugerprofil "${usr.Initialer}" på svampe.databasen.org skal du åbne dette link og følge instruktionerne: <br><a href="${url}/confirm?token=${token}"> Aktivér brugerprofil</a> </p><p> Linket er gyldigt i 12 timer.<br>
		Du kan finde introduktionsvideoer <a href="${url}/demos">her.</a> <br>
		Du kan læse om godkendelse (validering) af fund <a href="${url}/validation">her.</a> <br>
		<br> Denne mail kan ikke besvares.</p><br><br> --------------------------- 
		<p>Dear ${usr.name} </p><p> To activate your user account "${usr.Initialer}" on svampe.databasen.org open this link and follow the instructions: <br><a href="${url}/confirm?token=${token}"> Activate account</a> </p><p>The link is valid for 12 hours.<br> Do not reply to this email. </p>` // html body
	};
	return	transporter.sendMailAsync(mailOptions);
	
}

exports.notifyValidator = function(usr, obs, message){
	var subject = obs.PrimaryDetermination.Taxon.acceptedTaxon.FullName +" DMS-"+obs._id;
	
	var mailOptions = {
	    from: '"'+usr.name+'" <'+config.mail.address+'>', // sender address
		to: config.mail.validatoraddress,
	    replyTo: usr.email, // list of receivers
	    subject: subject, // Subject line
	    text: `Besked fra ${usr.name} (${usr.Initialer}) angående: ${url}/observations/${obs._id} \n \n ${message}`, // plain text body
	    html: `<p>Besked fra ${usr.name} (${usr.Initialer}) angående:<br> <a href="${url}/observations/${obs._id}">${url}/observations/${obs._id}</a> </p>
		<p>${message}</p>` // html body
	};
	console.log(JSON.stringify(mailOptions))
	return	transporter.sendMailAsync(mailOptions);
}