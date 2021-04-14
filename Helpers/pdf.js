const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const utils = require('util');
const readFile = utils.promisify(fs.readFile);
const { getMailThroughNodeMailer } = require('../Helpers/nodeMailer');

//Converting ejs to pdf.
function convertHtmlToPdf(Data, filename, pdfFileName) {
        return new Promise(async ( resolve, reject )=>{
            try {
                let Path = path.resolve(`./views/pages/${filename}.ejs`);
                let PathContent = await readFile(Path,'utf8');
                let template = ejs.render(PathContent, Data);
                let browser = await puppeteer.launch();
                let page = await browser.newPage();
                await page.setContent(template);
                await page.pdf({ path: `./PDFs/${pdfFileName}.pdf`, format: 'A4' });
                //Sending pdf as mail.
                let fName ="";
                let email = "";
                let confirmationCode = "";
                let html = "get pdf for report";
                let filenames= `${pdfFileName}.pdf`;
                let paths = `./PDFs/${pdfFileName}.pdf`;
                let password = "";
                getMailThroughNodeMailer(fName, email, confirmationCode, html, filenames, paths, password);
                await browser.close();
                resolve();
             } catch (error) {
                console.log("error ---  > ",error);
                reject(error);
             }
        }); 
    }

module.exports = convertHtmlToPdf;