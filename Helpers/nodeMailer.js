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
        mailOptions['subject'] = 'login crediential for your text case management web application.'
        mailOptions['html'] = `<div>
                                    <p>Email confirm! please go to app and create password. Your email id is : ${email}</p>
                               </div>`;
    }

    if(html == 'forget password' ){
        mailOptions['subject'] = 'OTP to generate new password'
        mailOptions['html'] =  `<div>
                                     <h4>Dear User, </h4>
                                     <h2 style='font-weight:bold;'>OTP  is <b>${otp}</b> to login into your Test Case Management System</h2>
                                     <h4>If you did not attempted the request, please contact admin immediately.</h4>
                                </div>`
    }
                
    if (!filename == '' && !path == '') {
        mailOptions['attachments'] = [
            { filename : filename, path : path}
        ]
    }

    if(html == 'get pdf for report'){
        mailOptions['subject'] = 'Report'
        mailOptions['attachments'] = [
            { filename : filename, path : path}
        ]
    }

    if(html == 'get pdf for runlog'){
        mailOptions['subject'] = 'Run Log'
        mailOptions['attachments'] = [
            { filename : filename, path : path}
        ]
    }

    transporter.sendMail(mailOptions , function(err, data){
        if (err) {
            console.log("Error occurs while sending the email.",err);
        } else {
            console.log('SucessFully send the mail!');
        }
    });
}

module.exports = {getMailThroughNodeMailer : getMailThroughNodeMailer};