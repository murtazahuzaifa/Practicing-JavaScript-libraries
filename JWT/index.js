const jwt = require('jsonwebtoken');
const secretDecodeToken = require('crypto').randomBytes(16).toString('hex');
require('dotenv').config()

console.log("secretDecodeToken ==>", secretDecodeToken);

const user = { username: 'Murtaza' };
const accessToken = jwt.sign(user, secretDecodeToken, { expiresIn: "20s" });

console.log(accessToken);


jwt.verify(process.env.TOKEN, "c39d5b577812f59ca3ad25ba2602af6f",
    (err, user) => {
        if (err) { console.log(err.stack); return; }
        console.log(user);
    });


