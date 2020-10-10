require('dotenv').config();
// const pdf =  require('pdfjs');
// // const pdf_dist = require('pdfjs-dist');
// const pdfjsLib  = require('pdfjs-dist/build/pdf');

// pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker');
// // pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
// let loadingTask = pdfjsLib.getDocument('Cn.pdf');
// loadingTask.promise.then(function(pdf) {
//     console.log('PDF loaded');

//     // Fetch the first page
//     var pageNumber = 1;
//     pdf.getPage(pageNumber).then(function(page) {
//       console.log('Page loaded');

//   var scale = 1.5;
//   var viewport = page.getViewport({scale: scale});

//   // Prepare canvas using PDF page dimensions
//   var canvas = document.getElementById('the-canvas');
//   var context = canvas.getContext('2d');
//   canvas.height = viewport.height;
//   canvas.width = viewport.width;

//   // Render PDF page into canvas context
//   var renderContext = {
//     canvasContext: context,
//     viewport: viewport
//   };
//   var renderTask = page.render(renderContext);
//   renderTask.promise.then(function () {
//     console.log('Page rendered');
//   });
// });
//   }, function (reason) {
//     // PDF loading error
//     console.error(reason);
//   });
// console.log('initialize')
// const doc = new pdf.ExternalDocument()

// pdf_dist.getDocument('file.pdf').then((pdf)=>{
//     pdf.getPage(1).then((page)=>{
//         console.log(page)
//     })
// })

/*const fs = require('fs');
const pdfParser = require('pdf-parse');

const pdfFile = fs.readFileSync('Cn.pdf');

// console.log(pdfFile.toString());
// console.log(pdfFile.toString());
pdfParser(pdfFile).then((data) => {
    // console.log(data.numpages);
    console.log(data.numrender);
    console.log('parsed')
})*/

/*const request = require('request-promise').defaults({ jar: true });

async function main() {
    const result = await request.get("https://pdf2doc.com/");
    const API_result = await request.post("https://pdf2doc.com/upload/nd1hprdbok5sxgwm",
        {
            form: {
                name: "Cn.pdf",
// id: "o_1ek6sip32dl41eh09re15fo13ubg"
            }
        }
    );
    console.log(API_result);
    console.log('every thing is fine code executed')
}

main();*/


// OFFICIAL REPO:  https://github.com/groupdocs-conversion-cloud/groupdocs-conversion-cloud-node
// load the module
var GroupDocs = require('groupdocs-conversion-cloud');
const fs = require('fs');
// get your appSid and appKey at https://dashboard.groupdocs.cloud (free registration is required).
var appSid = process.env.appSid
var appKey = process.env.appKey
/*
// construct Api
var api = GroupDocs.InfoApi.fromKeys(appSid, appKey);
var request = new GroupDocs.GetSupportedConversionTypesRequest();
// retrieve supported conversion types
api.getSupportedConversionTypes(request)
    .then(function (response) {
        console.log("Supported file-formats:")
        response.forEach(function (format) {
            console.log(format.sourceFormat + ": [" + format.targetFormats.join(", ") + "]");
        });
    })
    .catch(function (error) {
        console.log("Error: " + error.message)
    });
*/
/*
// file download example
const main = async () => {
    const convertApi = GroupDocs.ConvertApi.fromKeys(appSid, appKey);
    const fileApi = GroupDocs.FileApi.fromKeys(appSid, appKey);

    try {
        const fileName = 'sample.docx';

        const requestDownload = new GroupDocs.DownloadFileRequest(fileName);
        const responseDownload = await fileApi.downloadFile(requestDownload);
        const 
        // responseDownload = responseDownload
        console.log('Download Response ==>> ', responseDownload)
        fs.writeFileSync('C:/Temp/02_pages_copy.docx', responseDownload)
        console.log('Congratulations, file downloaded properly')

    } catch (error) {
        console.log("ERROR raise ==>> ", error)
    }
}
*/

// file upload and convert example
const main = async () => {
    const convertApi = GroupDocs.ConvertApi.fromKeys(appSid, appKey);
    const fileApi = GroupDocs.FileApi.fromKeys(appSid, appKey);

    try {
        const uploadFileName = 'Cn.pdf';
        const remoteFileName = 'cn.pdf';
        const outputRemotePath = 'cn.docx';
        const strFormat = 'docx'

        const requestUpload = new GroupDocs.UploadFileRequest(remoteFileName, uploadFileName);
        const responseUpload = await fileApi.uploadFile(requestUpload)
            .then((result) => { console.log("File uploaded successfull", result) })
            .catch(err => { console.log('ERROR raise in file upload', err) })

        // converting pdf to word document
        const setting = new GroupDocs.ConvertSettings();
        setting.filePath = remoteFileName;
        setting.format = strFormat;
        setting.outputPath = outputRemotePath;

        const loadOptions = new GroupDocs.PdfLoadOptions();
        loadOptions.hidePdfAnnotations = true;
        loadOptions.removeEmbeddedFiles = false;
        loadOptions.flattenAllFields = true;

        setting.loadOptions = loadOptions;

        const convertOptions = new GroupDocs.DocxConvertOptions()
        convertOptions.fromPage = 1
        convertOptions.pagesCount = 1
        
        setting.convertOptions = convertOptions

        const convertRequest = new GroupDocs.ConvertDocumentRequest(setting)
        const convertResponse = await convertApi.convertDocument(convertRequest)
        .then((result)=>{console.log('File converted sucessfully', result)})
        .catch(err => {console.log("File convertion Error", err)})

    } catch (error) {
        console.log("ERROR raise ==>> ", error)
    }
}

main();