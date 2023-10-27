const nodemailer = require('nodemailer');  
let date = new Date();
let todayDate = date.toLocaleDateString();
let time = date.toLocaleTimeString();

var hours = date.getHours();
var minutes = date.getMinutes();
var ampm = hours >= 12 ? 'pm' : 'am';
hours = hours % 12;
hours = hours ? hours : 12; // the hour '0' should be '12'
minutes = minutes < 10 ? '0'+minutes : minutes;
var strTime = hours + ':' + minutes + ' ' + ampm;

//Importig .env here.
require('dotenv').config();

async function getMailThroughNodeMailer (fName, email, confirmationCode, html, filename, path, otp, password, csv, runcode, projectName, nameOfProject, handledBy, projectDescription, member, startDate, endDate, createdby, title, testDescriptions, scenario, actedBy, Date, Time) {
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
        // to: email
        to: "kaushal.anand@storeking.in"
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

    if(html == 'getCredentials'){
      mailOptions['subject'] = 'Credentials for Test Case Management App'
      mailOptions['html'] =  `<div>
                                   <h2>Hello ${fName} </h2>
                                   <p>
                                   <p>Your login credential is email - <b>${email}</b> and password - <b>${password}.</b> Please confirm the mail before using the app.</p>
                               </div>`
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
        mailOptions['html'] =  `
                                                                <!DOCTYPE html>
                                <html >
                                  <head>
                                    <meta charset="UTF-8">
                                    <title>Check this off your to-do list</title>
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                  </head>

                                  <body>

                                    <html>

                                <head>
                                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                                  <meta name="campaign_code" content="MEE180000000">
                                  <meta name="edata-campaignid" content="freelancer:MEE180000000">
                                  <meta name="edata-mailclass" content="EDM">
                                  <meta name="campaign_name" content="1ClickTodo">
                                  <title>Check this off your to-do list | Freelancer</title>
                                  <style type="text/css">
                                    div, p, a, li, td {
                                            -webkit-text-size-adjust: none;
                                        }
                                        html {
                                            width: 100%;
                                        }
                                        body {
                                            width: 100%;
                                            height: 100%;
                                            background: #ffffff !important;
                                            margin: 0;
                                            padding: 0;
                                            -webkit-font-smoothing: antialiased !important;
                                            -moz-osx-font-smoothing: grayscale;
                                            font-family:  Helvetica, Arial, sans-serif !important;
                                        }
                                        p {
                                            padding: 0!important;
                                            margin-top: 0!important;
                                            margin-right: 0!important;
                                            margin-bottom: 0!important;
                                            margin-left: 0!important;
                                        }
                                  </style>
                                </head>

                                <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" yahoo="fix" style="background-color: #ffffff">
                                  <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="background-color: #f1f1f3">
                                    <tr>
                                      <td width="100%" align="center">
                                        <table width="650" border="0" cellpadding="0" cellspacing="0" align="center">
                                          <tr>
                                            <td width="100%" align="center" height="20"></td>
                                          </tr>
                                          <tr>
                                            <td valign="middle" align="center">
                                            </td>
                                          </tr>
                                          <tr>
                                            <td width="100%" align="center" height="18"></td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td width="100%" align="center">
                                        <table width="600" align="center" border="0" cellpadding="0" cellspacing="0" style="border-radius: 4px;" bgcolor="#ffffff">
                                          <tr>
                                            <td align="center" width="100%" bgcolor="#5DC26A" style="background: url('https://d3bvzwcd1dw6vt.cloudfront.net/static/images/email/build/7f36d21cab925c62e21140b390447e6c.png'); background-size: cover; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                  <td width="100%" height="24"></td>
                                                </tr>
                                                <tr>
                                                  <td align="center" width="100%">
                                                    <p style="margin: 0; padding: 0; text-align: left; color: #ffffff; font-weight: bold; font-size: 34px; line-height: 34px; font-family:  Helvetica, Arial, sans-serif;">${nameOfProject}</p>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td width="100%" height="24"></td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" width="100%">
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                                <tr>
                                                  <td align="left" colspan="2"> <span style="margin: 0; padding: 0; text-decoration: none; color: #5DC26A; font-weight: normal; font-size: 24px; line-height: 32px; font-family:  Helvetica, Arial, sans-serif; text-align: left;"><span style ="font-weight: 600;">Description :- </span> 
                                                                            ${projectDescription}
                                                                        </span>

                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                              </table>
                                              <table width="600" height="2" align="center" border="0" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #F0F0F0"></table>
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                                <tr>
                                                  <td align="left">
                                                  <a 
                                                  style="margin: 0; padding: 0; text-decoration: none; color: #161E2C; font-weight: normal; font-size: 24px; line-height: 32px; font-family:  Helvetica, Arial, sans-serif; text-align: left;"><span style ="font-weight: 600;"> Project handled by :- </span> ${handledBy.fName}</a>
                                                        
                            
                                                      
                                                  </td>
                                                  <td align="left" colspan="2">
                                      
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                              </table>
                                              <table width="600" height="2" align="center" border="0" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #F0F0F0"></table>
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                                <tr>
                                                  <td align="left"
                                                  <a href="https://www.freelancer.com/users/login-instant.php?token=649a3dc0b0490579b03b1dca35134040b66f68c27e95d05b9490ddf434218411&amp;url=https%3A%2F%2Fwww.freelancer.com%2Fcampaign%2F0MEE180000007%2F%3Fl%3D%252Fbuyers%252Fonemailclick.php%253Ftitle%253DBuild%252Ba%252Bwebsite%252Bfor%252Bme%2526skills%253D3%252C17%2526budget_set%253Dfalse%2526utm_campaign%253D1clicktodo%2526utm_medium%253Demail%2526utm_source%253D&amp;userID=20264716&amp;expireAt=1470934682&amp;uniqid=20264716-2328-579f7f9a-f98035a6&amp;linkid=6"
                                                  style="margin: 0; padding: 0; text-decoration: none; color: #161E2C; font-weight: normal; font-size: 24px; line-height: 32px; font-family:  Helvetica, Arial, sans-serif; text-align: left;"><span style ="font-weight: 600;"> Members :- </span> ${member}</a>
                                                        
                                                  </td>
                                                  <td align="left" colspan="2">
                                                        
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                              </table>
                                              <table width="600" height="2" align="center" border="0" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #F0F0F0"></table>
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                                <tr>
                                                  <td align="left">
                                                  <a href="https://www.freelancer.com/users/login-instant.php?token=649a3dc0b0490579b03b1dca35134040b66f68c27e95d05b9490ddf434218411&amp;url=https%3A%2F%2Fwww.freelancer.com%2Fcampaign%2F0MEE180000007%2F%3Fl%3D%252Fbuyers%252Fonemailclick.php%253Ftitle%253DBuild%252Ba%252Bwebsite%252Bfor%252Bme%2526skills%253D3%252C17%2526budget_set%253Dfalse%2526utm_campaign%253D1clicktodo%2526utm_medium%253Demail%2526utm_source%253D&amp;userID=20264716&amp;expireAt=1470934682&amp;uniqid=20264716-2328-579f7f9a-f98035a6&amp;linkid=6"
                                                  style="margin: 0; padding: 0; text-decoration: none; color: #161E2C; font-weight: normal; font-size: 24px; line-height: 32px; font-family:  Helvetica, Arial, sans-serif; text-align: left;"><span style ="font-weight: 600;"> Creation Date :-</span> ${todayDate} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style ="font-weight: 600;"> At:-</span>  ${strTime}</a>
                                                        
                                                  </td>
                                                  <td align="left" colspan="2">
                                                        
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                              </table>
                                              <table width="600" height="2" align="center" border="0" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #F0F0F0"></table>
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                                <tr>
                                                  <td align="left">
                                                  <a href="https://www.freelancer.com/users/login-instant.php?token=649a3dc0b0490579b03b1dca35134040b66f68c27e95d05b9490ddf434218411&amp;url=https%3A%2F%2Fwww.freelancer.com%2Fcampaign%2F0MEE180000007%2F%3Fl%3D%252Fbuyers%252Fonemailclick.php%253Ftitle%253DBuild%252Ba%252Bwebsite%252Bfor%252Bme%2526skills%253D3%252C17%2526budget_set%253Dfalse%2526utm_campaign%253D1clicktodo%2526utm_medium%253Demail%2526utm_source%253D&amp;userID=20264716&amp;expireAt=1470934682&amp;uniqid=20264716-2328-579f7f9a-f98035a6&amp;linkid=6"
                                                  style="margin: 0; padding: 0; text-decoration: none; color: #161E2C; font-weight: normal; font-size: 24px; line-height: 32px; font-family:  Helvetica, Arial, sans-serif; text-align: left;"><span style ="font-weight: 600;"> Created By :-</span> ${createdby}</a>
                                                        
                                                  </td>
                                                  <td align="left" colspan="2">
                                                        
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                              </table>
                                              <table width="600" height="2" align="center" border="0" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #F0F0F0"></table>
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                                <tr>
                                                  
                                                  <td align="left" colspan="2">
                                                    <a href="https://www.freelancer.com/users/login-instant.php?token=649a3dc0b0490579b03b1dca35134040b66f68c27e95d05b9490ddf434218411&amp;url=https%3A%2F%2Fwww.freelancer.com%2Fcampaign%2F0MEE180000007%2F%3Fl%3D%252Fbuyers%252Fonemailclick.php%253Ftitle%253DBuild%252Ba%252Bwebsite%252Bfor%252Bme%2526skills%253D3%252C17%2526budget_set%253Dfalse%2526utm_campaign%253D1clicktodo%2526utm_medium%253Demail%2526utm_source%253D&amp;userID=20264716&amp;expireAt=1470934682&amp;uniqid=20264716-2328-579f7f9a-f98035a6&amp;linkid=6"
                                                      style="margin: 0; padding: 0; text-decoration: none; color: #161E2C; font-weight: normal; font-size: 24px; line-height: 32px; font-family:  Helvetica, Arial, sans-serif; text-align: left;"><span style ="font-weight: 600;">  Starting Date :-</span> ${startDate} </a>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                              </table>
                                              <table width="600" height="2" align="center" border="0" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #F0F0F0"></table>
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                                <tr>
                                                  
                                                  <td align="left" colspan="2">
                                                    <a href="https://www.freelancer.com/users/login-instant.php?token=649a3dc0b0490579b03b1dca35134040b66f68c27e95d05b9490ddf434218411&amp;url=https%3A%2F%2Fwww.freelancer.com%2Fcampaign%2F0MEE180000007%2F%3Fl%3D%252Fbuyers%252Fonemailclick.php%253Ftitle%253DBuild%252Ba%252Bwebsite%252Bfor%252Bme%2526skills%253D3%252C17%2526budget_set%253Dfalse%2526utm_campaign%253D1clicktodo%2526utm_medium%253Demail%2526utm_source%253D&amp;userID=20264716&amp;expireAt=1470934682&amp;uniqid=20264716-2328-579f7f9a-f98035a6&amp;linkid=6"
                                                      style="margin: 0; padding: 0; text-decoration: none; color: #161E2C; font-weight: normal; font-size: 24px; line-height: 32px; font-family:  Helvetica, Arial, sans-serif; text-align: left;"><span style ="font-weight: 600;"> End Date :- </span> ${endDate}</a>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                              </table>
                                              
                                              
                                              <table width="600" height="2" align="center" border="0" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #F0F0F0"></table>
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                
                                              </table>
                                            </td>
                                          </tr>
                                          <tr>
                                            
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                  <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f1f1f3">
                                    <tr>
                                      <td width="100%" align="center">
                                        <table width="650" align="center" border="0" cellspacing="0" cellpadding="0" style="font-family: Helvetica, Arial, sans-serif;">
                                          <tr>
                                            <td width="100%" height="40"></td>
                                          </tr>
                                          <tr>
                                           
                                          </tr>
                                          <tr>
                                            <td height="10" width="100%"></td>
                                          
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                  
                                  <div style="display:none; white-space:nowrap; font:15px courier; color:#ffffff;">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</div>
                                </body>

                                </html>
                                <!-- X-250ok-CID: FlnMEE180000000-->
                                    
                                    
                                    
                                    
                                    
                                  </body>
                                </html>

                                `
    }

    if(html == 'get deatils about test case'){
        mailOptions['subject'] = `A new test case is created by ${actedBy}`
        mailOptions['html'] =  `
                                
                                <!DOCTYPE html>
                                <html >
                                  <head>
                                    <meta charset="UTF-8">
                                    <title>Check this off your to-do list</title>
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                  </head>

                                  <body>

                                    <html>

                                <head>
                                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                                  <meta name="campaign_code" content="MEE180000000">
                                  <meta name="edata-campaignid" content="freelancer:MEE180000000">
                                  <meta name="edata-mailclass" content="EDM">
                                  <meta name="campaign_name" content="1ClickTodo">
                                  <title>Check this off your to-do list | Freelancer</title>
                                  <style type="text/css">
                                    div, p, a, li, td {
                                            -webkit-text-size-adjust: none;
                                        }
                                        html {
                                            width: 100%;
                                        }
                                        body {
                                            width: 100%;
                                            height: 100%;
                                            background: #ffffff !important;
                                            margin: 0;
                                            padding: 0;
                                            -webkit-font-smoothing: antialiased !important;
                                            -moz-osx-font-smoothing: grayscale;
                                            font-family:  Helvetica, Arial, sans-serif !important;
                                        }
                                        p {
                                            padding: 0!important;
                                            margin-top: 0!important;
                                            margin-right: 0!important;
                                            margin-bottom: 0!important;
                                            margin-left: 0!important;
                                        }
                                  </style>
                                </head>

                                <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" yahoo="fix" style="background-color: #ffffff">
                                  <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="background-color: #f1f1f3">
                                    <tr>
                                      <td width="100%" align="center">
                                        <table width="650" border="0" cellpadding="0" cellspacing="0" align="center">
                                          <tr>
                                            <td width="100%" align="center" height="20"></td>
                                          </tr>
                                          <tr>
                                            <td valign="middle" align="center">
                                            </td>
                                          </tr>
                                          <tr>
                                            <td width="100%" align="center" height="18"></td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td width="100%" align="center">
                                        <table width="600" align="center" border="0" cellpadding="0" cellspacing="0" style="border-radius: 4px;" bgcolor="#ffffff">
                                          <tr>
                                            <td align="center" width="100%" bgcolor="#5DC26A" style="background: url('https://d3bvzwcd1dw6vt.cloudfront.net/static/images/email/build/7f36d21cab925c62e21140b390447e6c.png'); background-size: cover; border-top-left-radius: 4px; border-top-right-radius: 4px;">
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                  <td width="100%" height="24"></td>
                                                </tr>
                                                <tr>
                                                  <td align="center" width="100%">
                                                    <p style="margin: 0; padding: 0; text-align: left; color: #ffffff; font-weight: bold; font-size: 34px; line-height: 34px; font-family:  Helvetica, Arial, sans-serif;">${title}</p>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td width="100%" height="24"></td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td align="center" width="100%">
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                                <tr>
                                                  <td align="left" colspan="2"> <span style="margin: 0; padding: 0; text-decoration: none; color: #5DC26A; font-weight: normal; font-size: 24px; line-height: 32px; font-family:  Helvetica, Arial, sans-serif; text-align: left;"><span style ="font-weight: 600;"><span> 
                                                  Testcase Description :- </span> ${testDescriptions}
                                                                        </span>

                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                              </table>
                                              <table width="600" height="2" align="center" border="0" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #F0F0F0"></table>
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                                <tr>
                                                  <td align="left">
                                                  <a 
                                                  style="margin: 0; padding: 0; text-decoration: none; color: #161E2C; font-weight: normal; font-size: 24px; line-height: 32px; font-family:  Helvetica, Arial, sans-serif; text-align: left;"><span style ="font-weight: 600;"> Scenario :- </span> ${scenario}</a>
                                                        
                            
                                                      
                                                  </td>
                                                  <td align="left" colspan="2">
                                      
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                              </table>
                                              <table width="600" height="2" align="center" border="0" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #F0F0F0"></table>
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                                <tr>
                                                  <td align="left">
                                                  <a href="https://www.freelancer.com/users/login-instant.php?token=649a3dc0b0490579b03b1dca35134040b66f68c27e95d05b9490ddf434218411&amp;url=https%3A%2F%2Fwww.freelancer.com%2Fcampaign%2F0MEE180000007%2F%3Fl%3D%252Fbuyers%252Fonemailclick.php%253Ftitle%253DBuild%252Ba%252Bwebsite%252Bfor%252Bme%2526skills%253D3%252C17%2526budget_set%253Dfalse%2526utm_campaign%253D1clicktodo%2526utm_medium%253Demail%2526utm_source%253D&amp;userID=20264716&amp;expireAt=1470934682&amp;uniqid=20264716-2328-579f7f9a-f98035a6&amp;linkid=6"
                                                  style="margin: 0; padding: 0; text-decoration: none; color: #161E2C; font-weight: normal; font-size: 24px; line-height: 32px; font-family:  Helvetica, Arial, sans-serif; text-align: left;"><span style ="font-weight: 600;"> Creation Date :-</span> ${Date}</a>
                                                        
                                                  </td>
                                                  <td align="left" colspan="2">
                                                        
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                              </table>
                                              <table width="600" height="2" align="center" border="0" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #F0F0F0"></table>
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                                <tr>
                                                  <td align="left">
                                                  <a href="https://www.freelancer.com/users/login-instant.php?token=649a3dc0b0490579b03b1dca35134040b66f68c27e95d05b9490ddf434218411&amp;url=https%3A%2F%2Fwww.freelancer.com%2Fcampaign%2F0MEE180000007%2F%3Fl%3D%252Fbuyers%252Fonemailclick.php%253Ftitle%253DBuild%252Ba%252Bwebsite%252Bfor%252Bme%2526skills%253D3%252C17%2526budget_set%253Dfalse%2526utm_campaign%253D1clicktodo%2526utm_medium%253Demail%2526utm_source%253D&amp;userID=20264716&amp;expireAt=1470934682&amp;uniqid=20264716-2328-579f7f9a-f98035a6&amp;linkid=6"
                                                  style="margin: 0; padding: 0; text-decoration: none; color: #161E2C; font-weight: normal; font-size: 24px; line-height: 32px; font-family:  Helvetica, Arial, sans-serif; text-align: left;"><span style ="font-weight: 600;">  Creation Time :-</span> ${strTime}</a>
                                                        
                                                  </td>
                                                  <td align="left" colspan="2">
                                                        
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td colspan="3" align="center" height="24"></td>
                                                </tr>
                                              </table>
                                            
                                              
                                              
                                              <table width="600" height="2" align="center" border="0" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #F0F0F0"></table>
                                              <table align="center" width="520" border="0" cellpadding="0" cellspacing="0">
                                                
                                              </table>
                                            </td>
                                          </tr>
                                          <tr>
                                            
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                  <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f1f1f3">
                                    <tr>
                                      <td width="100%" align="center">
                                        <table width="650" align="center" border="0" cellspacing="0" cellpadding="0" style="font-family: Helvetica, Arial, sans-serif;">
                                          <tr>
                                            <td width="100%" height="40"></td>
                                          </tr>
                                          <tr>
                                           
                                          </tr>
                                          <tr>
                                            <td height="10" width="100%"></td>
                                          
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                  
                                  <div style="display:none; white-space:nowrap; font:15px courier; color:#ffffff;">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</div>
                                </body>

                                </html>
                                <!-- X-250ok-CID: FlnMEE180000000-->
                                    
                                    
                                    
                                    
                                    
                                  </body>
                                </html>
                                `
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