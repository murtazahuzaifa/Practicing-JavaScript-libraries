require('dotenv').config();

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
// var appSid = process.env.appSid
// var appKey = process.env.appKey
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

        // responseDownload = responseDownload
        console.log('Download Response ==>> ', responseDownload)
        fs.writeFileSync('C:/Temp/02_pages_copy.docx', responseDownload)
        console.log('Congratulations, file downloaded properly')

    } catch (error) {
        console.log("ERROR raise ==>> ", error)
    }
}
*/

const uploadFile = async (remotePath, localPath, fileApi) => {
    /* remotePath: is use to put the file in the cloud
   localPath: is use to get the file form local computer
   fileApi: GroupDocs.FileApi.fromKeys(appSid, appKey) */
    const localFile = fs.readFileSync(localPath);
    const requestUpload = new GroupDocs.UploadFileRequest(remotePath, localFile);
    return fileApi.uploadFile(requestUpload)
}
const convertFile = async (remoteFileName, strFormat, outputRemotePath, convertApi) => {
    /* remoteFileName: the file path in cloud server, which will later use to pick the file from cloud and convert it in given format
    strFormat: its a dot extension of the file, that in which format the file should be convert
    outputRemotePath: the output path will use to put the output of converted file in the cloud
    convertApi:  GroupDocs.ConvertApi.fromKeys(appSid, appKey) */
    const setting = new GroupDocs.ConvertSettings();
    setting.filePath = remoteFileName;
    setting.format = strFormat;
    setting.outputPath = outputRemotePath;

    const loadOptions = new GroupDocs.PdfLoadOptions();
    loadOptions.hidePdfAnnotations = true;
    loadOptions.removeEmbeddedFiles = false;
    loadOptions.flattenAllFields = true;

    setting.loadOptions = loadOptions;

    // const convertOptions = new GroupDocs.DocxConvertOptions()
    // convertOptions.fromPage = 1
    // convertOptions.pagesCount = 1

    // setting.convertOptions = convertOptions

    const convertRequest = new GroupDocs.ConvertDocumentRequest(setting)
    return convertApi.convertDocument(convertRequest)
}
const downloadFile = async (fileName, fileApi) => {
    /* fileName: require the file name which file to download from the cloud server
       fileApi: GroupDocs.FileApi.fromKeys(appSid, appKey) */
    const requestDownload = new GroupDocs.DownloadFileRequest(fileName);
    return fileApi.downloadFile(requestDownload)
}

// https://products.groupdocs.cloud/conversion/nodejs   conversion from to link

// file upload, convert and download example
const main = async () => {
    const appSid = process.env.appSid
    const appKey = process.env.appKey
    const convertApi = GroupDocs.ConvertApi.fromKeys(appSid, appKey);
    const fileApi = GroupDocs.FileApi.fromKeys(appSid, appKey);
    const fileName = 'Cn';
    const strFormat = 'ppt';
    const uploadFileName = `${fileName}.pdf`;
    const remoteFileName = `${fileName}.pdf`;
    const outputRemotePath = `${fileName}.${strFormat}`;
    const downloadPath = `${fileName}.${strFormat}`

    try {
        // await uploadFile(remoteFileName, uploadFileName, fileApi)
        //     .then((result) => {
        //         console.log("File uploaded successfull", result)
        //         convertFile(remoteFileName, strFormat, outputRemotePath, convertApi)
        //             .then(result => {
        //                 console.log("File converted sucessfully", result)
        //                 downloadFile(downloadPath, fileApi)
        //                     .then(result => {
        //                         fs.writeFileSync(downloadPath, result)
        //                         console.log('Congratulations, file downloaded sucessfully')
        //                     })
        //                     .catch(err => { console.log("File Download Error", err); })
        //             })
        //             .catch(err => { console.log("Error in Converting file", err); })
        //     })
        //     .catch(err => { console.log('ERROR raise in file upload', err) })

        const timer = setTimeout(() => { console.log('timer init') }, 999999)
        let no_of_convrt = 1;
        while (true) {
            await uploadFile(remoteFileName, uploadFileName, fileApi)
                .then(res => { console.log("File uploaded sucessfully", res) })
                .catch(err => { clearTimeout(timer); if (err) throw err })

            await convertFile(remoteFileName, strFormat, outputRemotePath, convertApi)
                .then(res => { console.log("File converted sucessfully", res) })
                .catch(err => { clearTimeout(timer); if (err) throw err })

            await downloadFile(downloadPath, fileApi)
                .then(result => {
                    fs.writeFileSync(downloadPath, result)
                    console.log('Congratulations, file downloaded sucessfully')
                    clearTimeout(timer);
                })
                .catch(err => { console.log("File Download Error", err); clearTimeout(timer); })

            console.log("no_of_convert ==>> ", no_of_convrt, '\n\n\n');
            no_of_convrt += 1;
        }

    } catch (error) {
        console.log("ERROR raise ==>> ", error)
    }
}

main();