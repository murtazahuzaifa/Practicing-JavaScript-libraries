const { GoogleSpreadsheet } = require('google-spreadsheet');
// const { promisify } = require('util');
const creds = require('./google-developer-credentials.json');
require('dotenv').config();

async function accessSpreadSheet() {
    const doc = new GoogleSpreadsheet(process.env.spreadsheetID);
    // await promisify(doc.useServiceAccountAuth)(creds);
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
    });
    await doc.loadInfo();
    console.log(doc.title);
    const sheet = await doc.sheetsById[0]
    // const rows = await sheet.getRows()
    // await sheet.loadCells("A:A");
    // console.log(sheet.cellStats)

    const currentRow = await sheet.addRow({
        "First Name": 'testing'
    })

    const rowNum = currentRow._rowNumber;
    await sheet.loadCells(`A${rowNum - 1}:A${rowNum}`);
    const HS_number_cell = sheet.getCellByA1(`A${rowNum}`);
    // HS_number_cell.value = `HS${Number(sheet.getCellByA1(`A${rowNum - 1}`).value.toString().replace('HS', "")) + 1}`;
    // await HS_number_cell.save();
    // console.log();
    // console.log(Object.entries(rows[0]))
    // console.log(rows[0])
    // const info = await promisify(doc.getInfo)();
    // const data = await sheet.getRows()
    // console.log(data[6].);
    // const data = sheet.headerValues;
    // console.log(data);
    // const sheet = await doc.addSheet({ headerValues: ['name', 'email'] });

    // // append rows
    // const larryRow = await sheet.addRow({ name: 'Larry Page', email: 'larry@google.com' });
    // const moreRows = await sheet.addRows([
    //     { name: 'Sergey Brin', email: 'sergey@google.com' },
    //     { name: 'Eric Schmidt', email: 'eric@google.com' },
    // ]);

}

accessSpreadSheet();