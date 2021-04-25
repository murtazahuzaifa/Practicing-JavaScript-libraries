const nodeMailer = require("nodemailer");
const handlebars = require('handlebars');
const smtpTransport = require('nodemailer-smtp-transport');
const fs = require('fs');
require('dotenv').config();

const htmlFile = fs.readFileSync("mailTemplate.html", 'utf-8');
// const htmlFile = fs.readFileSync("envelope.html", 'utf-8');
// console.log(htmlFile);


(async () => {

    const template = handlebars.compile(htmlFile);

    let transporter = nodeMailer.createTransport(smtpTransport({
        host: "smtp.gmail.com",
        secure: true,
        port: 465,
        auth: {
            user: process.env.uesrname,
            pass: process.env.pass,
        },

    }));

    let body = JSON.parse('{"Title":"Mr","First Name":"Yusuf","Last Name":"Khokhri","Email":"yusufk6@yahoo.com","ITS Number":"30920050","Street Address":"Flat 19 Harlech Tower, Park Road East ","City":"Acton ","Country":"United Kingdom","Postcode":"W3 8TZ","Mobile Number":"07895009518","Name As Per Bank Account":"Yusuf Moizali Khokhri"}');
    body = Object.entries(body).map(item => `<p style="font-size:18px;" >${item[0]}: ${item[1]}</p>`).join('\n');
    // console.log(body)

    const mailOptions = {
        from: process.env.emailSendFrom, // sender address
        to: process.env.emailSendTo,
        subject: process.env.subject, // Subject line
        html: body
        // html: template({ scheme: process.env.schemename, recipientName: process.env.recipientname, itsNo: "40416916", amount: "50.00" }), // plain text body
        // attachments: [{
        //     // filename: 'envelope.jpg',
        //     path: `envelope.jpg`,
        //     cid: 'envelope', //same cid value as in the html img src
        //     content: ""
        // }]
    };

    let isError = false;
    let mailNo = 0;


    await transporter.sendMail(mailOptions, function (err, info) {
        if (info) {
            mailNo++
            console.log(`${mailNo} mail sent \n =====================================================\n\n`);
            return;
        }

        if (err) {
            console.log(`${err}\n\n ERROR on ${mailNo}`);
            isError = false;
            return;
        }
    });
    if (isError) { return }


}
)()

