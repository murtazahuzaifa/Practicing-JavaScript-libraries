const express = require('express');
const path = require('path');
const multer = require('multer');
var GroupDocs = require('groupdocs-conversion-cloud');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000;

const appSid = process.env.appSid
const appKey = process.env.appKey
const convertApi = GroupDocs.ConvertApi.fromKeys(appSid, appKey);
const fileApi = GroupDocs.FileApi.fromKeys(appSid, appKey);

// app.use(express.json());
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

app.post('/multi-upload', upload.array('files', 5), async (req, res) => {
    // console.log(Object.keys(req));
    // console.log(req.headers);
    if (req.files) {
        // console.log(req.files[0].path);
        const buff = fs.readFileSync(req.files[0].path)



        return res.status(200).json({ sucess: 'file recieved sucessfully', fileBuffer: buff });
    }
    return res.status(200).json({ sucess: 'file recieved sucessfully' });
});

app.get('/content/img', (req, res) => {
    console.log(req.params.fileName)
    const file = fs.readFileSync(`./src/uploads/1603173256343-design1.jpeg`)
    res.writeHead(200, { "Content-type": "image/png" });
    res.end(file)
    // res.end(fs.readFileSync(`./src/uploads/${req.params.fileName}`));
    // res.end(`${req.params.fileName}`);
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));



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

    const convertRequest = new GroupDocs.ConvertDocumentRequest(setting)
    return convertApi.convertDocument(convertRequest)
}
const downloadFile = async (fileName, fileApi) => {
    /* fileName: require the file name which file to download from the cloud server
       fileApi: GroupDocs.FileApi.fromKeys(appSid, appKey) */
    const requestDownload = new GroupDocs.DownloadFileRequest(fileName);
    return fileApi.downloadFile(requestDownload)
}