const nodemailer = require('nodemailer');  
let date = new Date();
let time = date.toLocaleTimeString();

//Importig .env here.
require('dotenv').config();

async function getMailThroughNodeMailer (fName, email, confirmationCode, html, filename, path, otp, password, csv, runcode, projectName, nameOfProject, handledBy, projectDescription, member, startDate, endDate, title, testDescriptions, scenario, actedBy, Date, Time) {
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
        mailOptions['html'] =  `
                                 <html>
                                <head>
                                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                                </head>
                                <body>
                                <!doctype html>
                                <html xmlns="http://www.w3.org/1999/xhtml">
                                  <head>
                                    <title>
                                    </title>
                                
                                    <!--[if !mso]><!- - -->
                                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                
                                    <!--<![endif]-->
                                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1">
                                
                                    <!--[if mso]>
                                        <xml>
                                        <o:OfficeDocumentSettings>
                                          <o:AllowPNG/>
                                          <o:PixelsPerInch>96</o:PixelsPerInch>
                                        </o:OfficeDocumentSettings>
                                        </xml>
                                        <![endif]-->
                                
                                    <!--[if lte mso 11]>
                                        <style type="text/css">
                                          .mj-outlook-group-fix { width:100% !important; }
                                        </style>
                                        <![endif]-->
                                    <style type="text/css">
                                      @media only screen and (min-width:480px) {
                                        .mj-column-per-100 {
                                          width: 100% !important;
                                          max-width: 100%;
                                        }
                                      }
                                    </style>
                                    <style type="text/css">
                                      @media only screen and (max-width:480px) {
                                        table.mj-full-width-mobile {
                                          width: 100% !important;
                                        }
                                        td.mj-full-width-mobile {
                                          width: auto !important;
                                        }
                                      }
                                    </style>
                                    <style type="text/css">
                                      @media only screen and (max-width:480px) {
                                        .ctaButton td {
                                          padding: 15px 10% 15px 10% !important;
                                        }
                                        .headerText div {
                                          font-size: 30px !important;
                                          line-height: 36px !important;
                                        }
                                        .subheaderText div {
                                          font-size: 18px !important;
                                          line-height: 24px !important;
                                        }
                                        .main td {
                                          padding: 25px 2.5% 0px 2.5% !important;
                                        }
                                        .buttonSection table {
                                          padding: 25px 0px 25px 0px !important;
                                        }
                                      }
                                    </style>
                                  </head>
                                  <body style="background-color: #eef3fb; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
                                    <div style="background-color:#eef3fb;">
                                      <table style="background: #007bff; background-color: #007bff; width: 100%; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                        <tbody>
                                          <tr>
                                            <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                
                                              <!--[if mso | IE]>
                                      <table
                                         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
                                      >
                                        <tr>
                                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                                      <![endif]-->
                                              <div style="margin:0px auto;max-width:600px;">
                                                <table style="width: 100%; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                  <tbody>
                                                    <tr>
                                                      <td style="direction: ltr; font-size: 0px; padding: 25px 0 0 0; text-align: center; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                
                                                        <!--[if mso | IE]>
                                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                              <td
                                                 class="" width="600px"
                                              >
                                      <table
                                         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
                                      >
                                        <tr>
                                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                                      <![endif]-->
                                                        <div style="margin:0px auto;max-width:600px;">
                                                          <table style="width: 100%; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                            <tbody>
                                                              <tr>
                                                                <td style="direction: ltr; font-size: 0px; padding: 20px 0; text-align: center; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                
                                                                  <!--[if mso | IE]>
                                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td
                                               class="" style="vertical-align:top;width:600px;"
                                            >
                                          <![endif]-->
                                                                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                                    <table style="vertical-align: top; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                                      <tbody>
                                                                        <tr>
                                                                          <td style="font-size: 0px; padding: 10px 25px; word-break: break-word; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" align="center">
                                                                            <table style="border-collapse: collapse; border-spacing: 0px; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                              <tbody>
                                                                                <tr>
                                                                                  <td style="width: 200px; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                    <img style="border: 0; display: block; outline: none; text-decoration: none; height: auto; width: 100%; font-size: 13px; line-height: 100%; -ms-interpolation-mode: bicubic;" height="auto" src="https://scgpacewisdom.com/img/portfolio/store_king/storeking_logo.png" width="200">
                                                                                  </td>
                                                                                </tr>
                                                                              </tbody>
                                                                            </table>
                                                                          </td>
                                                                        </tr>
                                                                      </tbody>
                                                                    </table>
                                                                  </div>
                                
                                                                  <!--[if mso | IE]>
                                            </td>
                                        </tr>
                                                  </table>
                                                <![endif]-->
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                
                                                        <!--[if mso | IE]>
                                          </td>
                                        </tr>
                                      </table>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                 class="main-outlook" width="600px"
                                              >
                                      <table
                                         align="center" border="0" cellpadding="0" cellspacing="0" class="main-outlook" style="width:600px;" width="600"
                                      >
                                        <tr>
                                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                                      <![endif]-->
                                                        <div class="main" style="background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;border-radius:25px 25px 0 0;max-width:600px;">
                                                          <table style="background: #FFFFFF; background-color: #FFFFFF; width: 100%; border-radius: 25px 25px 0 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                            <tbody>
                                                              <tr>
                                                                <td style="direction: ltr; font-size: 0px; padding: 25px 40px 0 40px  !important; text-align: center; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                
                                                                  <!--[if mso | IE]>
                                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td
                                               class="" style="vertical-align:top;width:600px;"
                                            >
                                          <![endif]-->
                                                                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                                    <table style="vertical-align: top; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                                      <tbody>
                                                                        <tr>
                                                                          <td style="font-size: 0px; padding: 25px 40px 0 40px  !important; word-break: break-word; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" align="center">
                                                                            <table style="border-collapse: collapse; border-spacing: 0px; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                              <tbody>
                                                                                <tr>
                                                                                  <td style="width: 250px; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 25px 40px 0 40px  !important;">
                                                                                    <img style="border: 0; display: block; outline: none; text-decoration: none; height: auto; width: 100%; font-size: 13px; line-height: 100%; -ms-interpolation-mode: bicubic;" height="auto" src="https://www.tryconfetti.io/images/confirm-email.png" width="250">
                                                                                  </td>
                                                                                </tr>
                                                                              </tbody>
                                                                            </table>
                                                                          </td>
                                                                        </tr>
                                                                      </tbody>
                                                                    </table>
                                                                  </div>
                                
                                                                  <!--[if mso | IE]>
                                            </td>
                                        </tr>
                                                  </table>
                                                <![endif]-->
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                
                                                        <!--[if mso | IE]>
                                          </td>
                                        </tr>
                                      </table>
                                              </td>
                                            </tr>
                                                  </table>
                                                <![endif]-->
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </div>
                                
                                              <!--[if mso | IE]>
                                          </td>
                                        </tr>
                                      </table>
                                      <![endif]-->
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                
                                      <!--[if mso | IE]>
                                      <table
                                         align="center" border="0" cellpadding="0" cellspacing="0" class="buttonSection-outlook" style="width:600px;" width="600"
                                      >
                                        <tr>
                                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                                      <![endif]-->
                                      <div class="buttonSection" style="background:#FFFFFF;background-color:#FFFFFF;margin:0px auto;border-radius:0 0 25px 25px;max-width:600px;">
                                        <table style="background: #FFFFFF; background-color: #FFFFFF; width: 100%; border-radius: 0 0 25px 25px; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: white; padding: 25px 0px 25px 0px  !important;" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                          <tbody>
                                            <tr>
                                              <td style="direction: ltr; font-size: 0px; padding: 0 0 50px 0; text-align: center; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                
                                                <!--[if mso | IE]>
                                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td
                                               class="" style="vertical-align:top;width:600px;"
                                            >
                                          <![endif]-->
                                                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                  <table style="vertical-align: top; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: white; padding: 25px 0px 25px 0px  !important;" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                    <tbody>
                                                      <tr>
                                                        <td class="headerText" style="font-size: 0px; padding: 10px 0  !important; word-break: break-word; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" align="center">
                                                        <div style="font-family: Helvetica Neue, Helvetica, Arial; font-size: 36px !important; font-weight: 500; line-height: 45px !important; text-align: center; color: #000000;">Test Case Management System</div>
                                                          <div style="font-family: Helvetica Neue, Helvetica, Arial; font-size: 36px !important; font-weight: 500; line-height: 45px !important; text-align: center; color: #000000;">Confirm Your Email</div>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td class="subheaderText" style="font-size: 0px; padding: 10px 0  !important; word-break: break-word; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" align="center">
                                                        <div style="font-family: Helvetica Neue, Helvetica, Arial; font-size: 18px !important; font-weight: 400; line-height: 24px !important; text-align: center; color: #8f99a7;">Hello ${fName}</div>
                                                          <div style="font-family: Helvetica Neue, Helvetica, Arial; font-size: 18px !important; font-weight: 400; line-height: 24px !important; text-align: center; color: #8f99a7;">Please click on the button below to validate your email address and confirm that you are the owner of this account.</div>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td class="subheaderText" style="font-size: 0px; padding: 10px 0  !important; word-break: break-word; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" align="center">
                                                          <div style="font-family: Helvetica Neue, Helvetica, Arial; font-size: 18px !important; font-weight: 400; line-height: 24px !important; text-align: center; color: #8f99a7;">If not, please disregard this email.</div>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td class="ctaButton" style="font-size: 0px; padding: 10px 25px; word-break: break-word; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" align="center" vertical-align="middle">
                                                          <table style="border-collapse: collapse; line-height: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: white; padding: 25px 0px 25px 0px  !important;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                            <tbody>
                                                              <tr>
                                                                <td style="border: none; border-radius: 50px; cursor: auto; mso-padding-alt: 10px 25px; background: #007bff; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 15px 75px 15px 75px  !important;" align="center" bgcolor="#007bff" role="presentation" valign="middle">
                                                                  <a style="display: inline-block; background: #007bff; color: inherit; font-family: Helvetica Neue, Helvetica, Arial; font-size: 18px; font-weight: 500; line-height: 120%; margin: 0; text-decoration: none; text-transform: none; padding: 10px 25px; mso-padding-alt: 0px; border-radius: 50px;" href=http://localhost:3000/user/confirm/${confirmationCode} target="_blank"> Confirm Email </a>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </div>
                                
                                                <!--[if mso | IE]>
                                            </td>
                                        </tr>
                                                  </table>
                                                <![endif]-->
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                
                                      <!--[if mso | IE]>
                                          </td>
                                        </tr>
                                      </table>
                                      <table
                                         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
                                      >
                                        <tr>
                                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                                      <![endif]-->
                                      <div style="margin:0px auto;max-width:600px;">
                                        <table style="width: 100%; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                          <tbody>
                                            <tr>
                                              <td style="direction: ltr; font-size: 0px; padding: 20px 0; text-align: center; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                
                                                <!--[if mso | IE]>
                                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td
                                               class="" style="vertical-align:top;width:600px;"
                                            >
                                          <![endif]-->
                                                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                  <table style="vertical-align: top; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                    <tbody>
                                                      <tr>
                                                        <td style="font-size: 0px; padding: 10px 25px; word-break: break-word; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" align="center">
                                                          <div style="font-family:Helvetica Neue, Helvetica, Arial;font-size:12px;line-height:18px;text-align:center;color:#8f99a7;">© 2021 StoreKing, All rights reserved<br> Please do not reply to this email. <br></div>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </div>
                                
                                                <!--[if mso | IE]>
                                            </td>
                                        </tr>
                                                  </table>
                                                <![endif]-->
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                
                                      <!--[if mso | IE]>
                                          </td>
                                        </tr>
                                      </table>
                                      <![endif]-->
                                    </div>
                                  </body>
                                </html>
                                 `
    }

    if(html == 'roleGeneratedPassword'){
        mailOptions['subject'] = 'New password generated by admin.'
        mailOptions['html'] =  `<div>
                                     <h2>Hello ${fName} </h2>
                                     <p>
                                     Your new password for your email :- <b>${email}</b> is <b>${password}.</b>
                                     </p>
                                 </div>`
    }

    if(html == '' ){
        mailOptions['subject'] = 'login crediential for your text case management web application.'
        mailOptions['html'] = `<div>
                                    <p>Email confirm! please go to app and login.</p>
                               </div>`;
    }

    if(html == 'forget password' ){
        mailOptions['subject'] = 'OTP to generate new password for Test Case Management App'
        mailOptions['html'] =  `<div>
                                     <h2>Dear User, </h2>
                                     <h3>OTP  is <b>${otp}</b> to login into your Test Case Management System</h3>
                                     <h4>If you did not attempted the request, please contact admin immediately.</h4>
                                </div>`
    }
                
    if (!filename == '' && !path == '') {
        mailOptions['attachments'] = [
            { filename : filename, path : path }
        ]
    }

    if(html == 'get pdf for report'){
        mailOptions['subject'] = 'Report'
        mailOptions['attachments'] = [
            { filename : filename, path : path }
        ]
    }

    if(html == 'get pdf for runlog'){
        mailOptions['subject'] = `Report for runlog`
        mailOptions['html'] =  `<div>
                                     <p>Please find attached pdf below</p>
                                </div>`
        mailOptions['attachments'] = [
            { filename : filename, path : path }
        ]
    }

    if(html == 'get csv for runlog'){
        mailOptions['subject'] = `${runcode} csv`
        mailOptions['attachments'] = [
            { filename: `${filename}.csv`, content: csv }
        ]
    }

    if(html == 'get deatils about project'){
        mailOptions['subject'] = `A new project is created by ${handledBy.fName}`
        mailOptions['html'] =  `<div>
                                     <p><b>Project Name :-</b> ${nameOfProject}</p>
                                     <p><b>Project Description :-</b> ${projectDescription}</p>
                                     <p><b>Members of Project:-</b> ${member}</p>
                                     <p><b>Starting date of project :-</b> ${startDate}</p>
                                     <p><b>End date of project :-</b> ${endDate}</p>
                                     <p><b>Time at which project is created :-</b> ${time}</p>
                                </div>
                                `
    }

    if(html == 'get deatils about test case'){
        mailOptions['subject'] = `A new test case is created by ${actedBy}`
        mailOptions['html'] =  `<div>
                                     <p><b>Test title :-</b> ${title}</p>
                                     <p><b>Test case description :-</b> ${testDescriptions}</p>
                                     <p><b>Scenario :-</b> ${scenario}</p>
                                     <p><b>Test case created on :-</b> ${Date}</p>
                                     <p><b>Time at which project is created :-</b> ${time}</p>
                                </div>`
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