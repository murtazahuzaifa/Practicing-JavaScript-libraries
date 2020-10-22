const express = require('express');
const path = require('path');
const multer = require('multer');
var GroupDocs = require('groupdocs-conversion-cloud');
const fs = require('fs');
require('dotenv').config();
const cors = require('cors'); // cross origin resource sharing

const app = express();
const port = 3000;

const appSid = process.env.appSid
const appKey = process.env.appKey
const convertApi = GroupDocs.ConvertApi.fromKeys(appSid, appKey);
const fileApi = GroupDocs.FileApi.fromKeys(appSid, appKey);

const fileMimeTypes = {
    'docx': "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "jpeg": "image/jpeg",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreetml.sheet",
    "pdf": "application/pdf",

}
// there are two way to store files in multer one is permenently and other is temporary

// first way of storing file,  which is permenently 
app.use(express.json());
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// second way of saving file in buffer, which is temporary
// const storage = multer.memoryStorage();

const upload = multer({ storage });
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/multi-upload', upload.array('files', 5), (req, res, next) => { console.log("Request Headers", req.headers); next() }, async (req, res) => {
    // console.log(Object.keys(req));
    // console.log(req.headers.origin);
    if (req.files) {
        console.log(req.files);
        // const buff = fs.readFileSync(req.files[0].path)

        // console.log('FIle size ', data.length, '-bytes')
        const fileName = req.files[0].filename.split('.')[0]; // upload file name
        const fileExt = req.files[0].filename.split('.')[1]; // upload file extension
        const outputFileFormat = 'docx'; //output file extension
        const uploadFileName = req.files[0].path; // file local path to upload
        const remoteFileName = `${fileName}.${fileExt}`;
        const outputRemotePath = `${fileName}.${outputFileFormat}`;
        const outputMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

        await uploadFile(remoteFileName, uploadFileName, fileApi)
            .then(res => { console.log("File uploaded sucessfully", res) })
            .catch(err => { console.log(err) })

        await convertFile(remoteFileName, outputFileFormat, outputRemotePath, convertApi)
            .then(res => { console.log("File converted sucessfully", res) })
            .catch(err => { console.log(err) })

        return res.status(200).json({
            sucess: 'file recieved sucessfully',
            downloadLink: `/getconverterfile/${outputRemotePath}`
        });
    }
    return res.status(200).json({ sucess: 'file received sucessfully' });
});

app.get('/content/img', (req, res) => {
    console.log(req.params.fileName)
    const file = fs.readFileSync(`./src/uploads/1603173256343-design1.jpeg`)
    res.writeHead(200, { "Content-type": "image/png" });
    res.end(file)
    // res.end(fs.readFileSync(`./src/uploads/${req.params.fileName}`));
    // res.end(`${req.params.fileName}`);
});
// app.use('/fileupload', (req,res, next)=>{console.log(req.headers); next() })
app.post('/fileupload', upload.array('files', 5), async (req, res) => {
    if (req.files) {
    //     res.header(200, { headerRes: 'header receive' })
        return res.status(200).json({ response: 'file receive' });
    }
    // console.log(req)
    // res.writeHead(200, { "headerRes": 'header receive' })
    return res.status(200).json({ response: 'request receive' });
    // return res.end({ response: 'request receive' });
});

app.get('/getconverterfile/:filename', async (req, res) => {

    const fileExt = req.params.filename.split('.')[1].toLowerCase()

    await downloadFile(req.params.filename, fileApi)
        .then(result => {
            res.writeHead(200, { "Content-type": fileMimeTypes[fileExt] })
            res.end(result)
            console.log('Congratulations, file downloaded sucessfully')
        })
        .catch(err => { console.log("File Download Error", err) })

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


// const express = require('express');

// const app = express();

// app.get('/', (req,res)=>{ res.send('request received')})

// app.listen(3000, ()=>{console.log('server started')})