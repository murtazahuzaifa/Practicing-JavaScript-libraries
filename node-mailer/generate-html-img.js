const nodeHtmlToImage = require('node-html-to-image')
const handlebars = require('handlebars');
const fs = require('fs');
const image = fs.readFileSync('./logo-gold.png');

const htmlFile = fs.readFileSync("envelope.html", 'utf-8');
const template = handlebars.compile(htmlFile);

const base64Image = Buffer.from(image).toString('base64');
const logoURI = 'data:image/jpeg;base64,' + base64Image


nodeHtmlToImage({
    output: './envelope.jpg',
    html: template({
        title: "Mohammedi Scheme - محمدي اسکيم",
        logo: "{{logo}}",
        name: "Murtaza Hanzala",
        itsNo: "40416916",
        amount: (100).toFixed(2),
    }),
    content: { logo: logoURI },
})
    .then(() => console.log('The image was created successfully!'))