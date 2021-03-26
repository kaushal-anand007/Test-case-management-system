const nodemailer = require('nodemailer');   

//Importig .env here.
require('dotenv').config();

async function getMailThroughNodeMailer (fName, email, confirmationCode, html, filename, path, otp) {
    //using nodemailer.
    let transporter =nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: 'kaushal.anand@storeking.in',
    };

    if(html == 'allowed'){
        mailOptions['subject'] = 'Email confirmation for Test Case Mangement System.'
        mailOptions['html'] =  `<div><h1>Email Confirmation</h1>
                                     <h2>Hello ${fName} </h2>
                                     <p>Please confirm your email by clicking on the following link to activate your account.
                                     <a href=http://localhost:3000/user/confirm/${confirmationCode}> Click here</a>
                                 </div>`
    }

    if(html == '' ){
        mailOptions['subject'] = 'login credientials for your text case management web application.'
        mailOptions['html'] = `<div>
                                    <p>Email confirm! please go to app and create password. Your email id is : ${email}</p>
                               </div>`;
    }

    if(html == 'forget password' ){
        mailOptions['subject'] = 'Otp for password generation is: '
        mailOptions['html'] =  `<div>
                                     <h3>OTP for account verification is </h3>
                                     <h1 style='font-weight:bold;'>${otp}</h1>
                                </div>`
    }
                
    if (!filename == '' && !path == '') {
        mailOptions['attachments'] = [
            { filename : filename, path : path}
        ]
    }

    transporter.sendMail(mailOptions , function(err, data){
        if (err) {
            console.log("Error occurs while sending the email.",err);
        } else {
            console.log('User was added successfully! Please check your email');
        }
    });
}

module.exports = {getMailThroughNodeMailer : getMailThroughNodeMailer};