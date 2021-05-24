const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const utils = require('util');
const readFile = utils.promisify(fs.readFile);
const { getMailThroughNodeMailer } = require('../Helpers/nodeMailer');
const Project = require('../Models/project');

//Converting ejs to pdf.
function convertHtmlToPdf(Data, filename, pdfFileName, html, runcode) {
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
                let filenames= `${pdfFileName}.pdf`;
                let paths = `./PDFs/${pdfFileName}.pdf`;
                let otp = "";
                let password = "";
                let csv = "";
                let data = Data.projectId;
                console.log("data --- > ", data);
                let findProject = await Project.findOne({"_id" : data});
                console.log("findProject --- > ", findProject);
                let projectName = findProject.nameOfProject

               
                getMailThroughNodeMailer(fName, email, confirmationCode, html, filenames, paths, otp, password, csv, runcode, projectName);
                await browser.close();
                resolve();
             } catch (error) {
                console.log("error ---  > ", error);
                reject(error);
             }
        }); 
    }

module.exports = convertHtmlToPdf;