// import * as AWS from 'aws-sdk';
const AWS = require('aws-sdk');
const https = require('https');
require('dotenv').config({ path: '../.env' });

const REGION = process.env.REGION;
const awsConfig = {
    region: REGION,
    "accessKeyId": process.env.ACCESS_KEY_ID,
    'secretAccessKey': process.env.SECRET_ACCESS_KEY,
};
AWS.config.update({ ...awsConfig });
//ref  https://github.com/aws-samples/aws-serverless-saas-layers/blob/master/Lab4/server/order-manager/order-manager-dal.js
(async () => {
    try {
        /**
         * Recommended Timestream write client SDK configuration:
         *  - Set SDK retry count to 10.
         *  - Use SDK DEFAULT_BACKOFF_STRATEGY
         *  - Set RequestTimeout to 20 seconds .
         *  - Set max connections to 5000 or higher.
         */
        const agent = new https.Agent({
            maxSockets: 5000,
        });

        const writeClient = new AWS.TimestreamWrite({
            maxRetries: 10,
            httpOptions: {
                timeout: 20000,
                agent: agent,
            },
        });

        const currentTime = Date.now().toString(); // Unix time in milliseconds

        const dimensions = [
            { Name: 'region', Value: 'us-east-1' },
            { Name: 'azure', Value: 'az1' },
            { Name: 'hostname', Value: 'host3' },
        ];

        const cpuUtilization = {
            Dimensions: dimensions,
            MeasureName: 'cpu_utilization',
            MeasureValue: '13.6',
            MeasureValueType: 'DOUBLE',
            Time: currentTime.toString(),
        };

        const memoryUtilization = {
            Dimensions: dimensions,
            MeasureName: 'memory_utilization',
            MeasureValue: '40',
            MeasureValueType: 'DOUBLE',
            Time: currentTime.toString(),
        };

        const records = [cpuUtilization, memoryUtilization];

        const params = {
            DatabaseName: 'TimeStreamDB',
            TableName: 'TSTable',
            Records: records,
        };

        const res = await writeClient.writeRecords(params).promise();
        console.log(res);

    } catch (err) {
        console.log(err);
    }
})()
