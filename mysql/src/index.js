const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ERD_TEST'
});

connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("MYSQL CONNECTED")
});

(async () => {

    // const res = await connection.query("SELECT * FROM Users where ?", { name: "murtaza" }, (err, res) => {
    //     if (err) {
    //         console.log("Error===>", err);
    //         return;
    //     }
    //     console.log("Response===>", res[0])
    // })

    const res = await new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Users where name = 'murtaza'", {}, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });

    });

    console.log(res);

})()