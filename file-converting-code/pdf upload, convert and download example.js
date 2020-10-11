var GroupDocs = require('groupdocs-conversion-cloud');
require('dotenv').config();
const fs = require('fs');
// OFFICIAL REPO:  https://github.com/groupdocs-conversion-cloud/groupdocs-conversion-cloud-node
// load the module
// get your appSid and appKey at https://dashboard.groupdocs.cloud (free registration is required).

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

// file upload, convert and download example
const main = async () => {
    const appSid = process.env.appSid
    const appKey = process.env.appKey
    const convertApi = GroupDocs.ConvertApi.fromKeys(appSid, appKey);
    const fileApi = GroupDocs.FileApi.fromKeys(appSid, appKey);
    const fileName = 'Cn';//24_pages;
    const strFormat = 'docx';
    const uploadFileName = `${fileName}.pdf`;
    const remoteFileName = `${fileName}.pdf`;
    const outputRemotePath = `${fileName}.docx`;
    const downloadPath = `${fileName}.docx`

    try {
        await uploadFile(remoteFileName, uploadFileName, fileApi)
            .then((result) => {
                console.log("File uploaded successfull", result)
                convertFile(remoteFileName, strFormat, outputRemotePath, convertApi)
                    .then(result => {
                        console.log("File converted sucessfully", result)
                        downloadFile(downloadPath, fileApi)
                            .then(result => {
                                fs.writeFileSync(downloadPath, result)
                                console.log('Congratulations, file downloaded sucessfully')
                            })
                            .catch(err => { console.log("File Download Error", err); })
                    })
                    .catch(err => { console.log("Error in Converting file", err); })
            })
            .catch(err => { console.log('ERROR raise in file upload', err) })

    } catch (error) {
        console.log("ERROR raise ==>> ", error)
    }
}

main();