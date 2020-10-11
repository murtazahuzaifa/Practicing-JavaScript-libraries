const ConversionClient = require('conversiontools');

// API Token from your Profile page at https://conversiontools.io/profile
// https://conversiontools.io/api-documentation
// https://github.com/conversiontools/conversiontools-node
// https://conversiontools.io/conversion
const apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM5MGIyNDVhZDRmNTQyMTZiNmNlNWY5ZjA1ZTNhNDUwIiwiaWF0IjoxNjAyNDA4MzQ0fQ.-qEMrgwPv3hjhigHgaGL8mNb3CibxEqrjkFVeo6naz8';

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