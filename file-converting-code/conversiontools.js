const ConversionClient = require('conversiontools');
require('dotenv').config();
// API Token from your Profile page at https://conversiontools.io/profile
// https://conversiontools.io/api-documentation
// https://github.com/conversiontools/conversiontools-node
// https://conversiontools.io/conversion
const apiToken = process.env.conversionToolApiToken;

const conversion = new ConversionClient(apiToken);

conversion
  .run('convert.pdf_to_excel', {
    filename: 'Cn.pdf',
    timeout: 9000,
    outputFilename: 'Cn.xlsx',
    // options: {
    //   delimiter: 'tab',
    // },
  })
  .then((filename) => {
    console.log('File downloaded to', filename);
  })
  .catch(err => {
    console.log('Conversion error', err);
  });