const { google } = require('googleapis');


/**
 * List Messages
 * The list messages function uses the gmail.users.messages.list to list the messages that meet the criteria given by the query param.
 */
exports.listMessages = (query, maxResults = 9) => (auth) => {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({ version: 'v1', auth });
        gmail.users.messages.list(
            {
                userId: 'me',
                q: query,
                maxResults,
            }, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!res.data.messages) {
                    resolve([]);
                    return;
                }
                console.log(res.data)
                resolve(res.data.messages);
            }
        );
    })
}

exports.getMessages = (messageId,) => (auth) => {
    return new Promise((resolve, reject) => {
        const gmail = google.gmail({ version: 'v1', auth });
        gmail.users.messages.get(
            {
                userId: 'me',
                id: messageId,
                format: ["minimal"]
            }, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!res.data) {
                    resolve([]);
                    return;
                }
                console.log(res)
                resolve(res.data.messages);
            }
        );
    })
}