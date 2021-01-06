// import * as AWS from 'aws-sdk';
const AWS = require('aws-sdk');
const https = require('https');
require('dotenv').config({ path: '.env' });

// ref https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamQuery.html
// ref Simple queries https://docs.aws.amazon.com/timestream/latest/developerguide/sample-queries.basic-scenarios.html
const REGION = process.env.REGION;
console.log(REGION);
const awsConfig = {
    region: REGION,
    "accessKeyId": process.env.ACCESS_KEY_ID,
    'secretAccessKey': process.env.SECRET_ACCESS_KEY,
};
AWS.config.update({ ...awsConfig });
AWS.config.region = REGION;

const DatabaseName = 'MultiTanentAppProject15_TimeStreamDB';
const TableName = 'ResourceMetricsTable';

const agent = new https.Agent({
    maxSockets: 5000,
});
const readClient = new AWS.TimestreamQuery({
    maxRetries: 10,
    httpOptions: {
        timeout: 20000,
        agent: agent,
    },
});

(async () => {

    var params = {
        // QueryString: `SELECT * FROM "${DatabaseName}"."${TableName}" ORDER BY time LIMIT 10`, /* required */
        QueryString: `SELECT resource, measure_value::double, measure_name 
                        FROM "${DatabaseName}"."${TableName}" 
                        WHERE tanentId = '8f03ae9cf14c5be9d969d330fe1b9219' 
                        ORDER BY time`, /* required */
        // QueryString: `SELECT * FROM "${DatabaseName}"."${TableName}" WHERE measure_value::double = 40.0 ORDER BY time DESC LIMIT 10`, /* required */
        // QueryString: `SELECT * FROM "${DatabaseName}"."${TableName}" measure_name = 'cpu_utilization' ORDER BY time DESC LIMIT 10`, /* required */
        // ClientToken: 'STRING_VALUE',
        // MaxRows: 1,
        // NextToken: "AYABeLYQyljH9QLZadirrFqlWd0AAAABAAdhd3Mta21zAEthcm46YXdzOmttczp1cy13ZXN0LTI6MzgzODMzNTc4NDA0OmtleS84ZjRlZDIxMi0wMzg5LTQ1OWYtYjQxZS02NmI4MTIxMjA2MmUAuAECAQB4-9SRMEGb_uGND0DsbPwdSFNx_V3tsDMQCZEfcQtIG_kB0WlbY5xJ9pqrfskTZDPkDwAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDAOtgB-LaSlJKHCyywIBEIA7y0eh9JPCn-dGOrJVzVtZUo49SxFF1s53grB5EYEJ4qvC67p_kjORHPOHzbhZFi_T6SeSeNIYAzyWq3oCAAAAAAwAABAAAAAAAAAAAAAAAAAAlTfp-XFYUo8CQaF626WADf____8AAAABAAAAAAAAAAAAAAABAAABI0PeF8mufch9BZ2fsiN3PXf-CYykAaYiVw6yNoOtJxNXCQ4dpL71IVMi0fuBh0viLkCz3B5Sx4st5eSEVZ6HV2xdfxBFqR7MLCNmyCN3tykRXWWV-r6o3F1pnl7INSM_cgIyrjJRngc5envWrvuk9cTxRu1XMUfY8koLNtH3ut65aGrfmM7Jy0_TB6EvmYQvZQLZ8h0O_KFN-UU07Q4p_IiMWJ8NoMxAOGMLp8wYrCf5az_ir_TY7H-n_XQW9D5g1qJA7fUu0OMFZfaxmdkKPRJQFGC1Z7Ew1gh-JJ98l-ALVFz85VfwW03E6xaR-LWhRZcwlZl8s1ZnhDftcqlJBwbIC-LuB3z6jHUgkKpUpUCyZv4Cr4XrzkiOet-isvNEFJiD-y9czOPstwmcg-PdheA0wDI"
        // NextToken: "AYABeFza534BsixphKtukCmvdpoAAAABAAdhd3Mta21zAEthcm46YXdzOmttczp1cy13ZXN0LTI6MzgzODMzNTc4NDA0OmtleS84ZjRlZDIxMi0wMzg5LTQ1OWYtYjQxZS02NmI4MTIxMjA2MmUAuAECAQB4-9SRMEGb_uGND0DsbPwdSFNx_V3tsDMQCZEfcQtIG_kBc6z2sTOHCVssn1YzUw54yAAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDBubicUwcVc4YfyEXAIBEIA7kNHDpVEc2GtjNzepEjKdMml5iv9CWIZP5_AVWkq42wGnOcJp1sRUCrJUiEIt0ckVr1-qPYYkJ0INwaACAAAAAAwAABAAAAAAAAAAAAAAAAAAMZ0yTDOMUD11Dlr_skPywv____8AAAABAAAAAAAAAAAAAAABAAABI7KMpeiwwf243eelUkw3WzV6q90xH6KWPpsknWNt8S2Oa0fv_apIBc2GpBz_1KreQ5gW_N_Q0GShnrmORCOBdLu8qQyQ34v_hMAX4Rs59w45SPhYUEo3yRyCUrEQOx1kqS9nS4GkG2a3aJgVdk1h2M2VdZhiEafL-PQmjsbEumHF4DVHmVaRwMmvUpDgkZFEvOUAbH_sAIzAeIZhMyA3Gi4JkRmSEaBzTHphXpVhuv4cwPobc8nUin0MBHVirsYbZOPvKVir3gNacZYFAUbeIxZ2_qPYcTNB9oypzsoIvGlhxDxUAgVLE9rluHUWFBBXcYdC5g9ff6sV8S-RxlVwHk7-keuIIhlqzxsf7l7jhm91kEzzcbzLrc-ECaC844qz7HJtIHtB_D9fXPfETkFPqexdrWc"
    };
    readClient.query(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(/*JSON.stringify(data, null, 2) */ data, data.Rows.length);           // successful response
            console.log(data.Rows[0].Data[0].ScalarValue);
            const usage = {
                readCapacityUnits: data.Rows.filter(({ Data }) => Data[2].ScalarValue === "readCapacityUnit"),
                writeCapacityUnits: data.Rows.filter(({ Data }) => Data[2].ScalarValue === "writeCapacityUnit"),
                computeTime: data.Rows.filter(({ Data }) => Data[2].ScalarValue === "computeTime"),
                requests: data.Rows.filter(({ Data }) => Data[2].ScalarValue === "request"),
            }
            console.log({
                readCapacityUnits: usage.readCapacityUnits.map(({ Data }) => Number(Data[1].ScalarValue)).reduce((a, b) => (a + b), 0),
                writeCapacityUnits: usage.writeCapacityUnits.map(({ Data }) => Number(Data[1].ScalarValue)).reduce((a, b) => (a + b), 0),
                computeTime: usage.computeTime.map(({ Data }) => Number(Data[1].ScalarValue)).reduce((a, b) => (a + b), 0),
                requests: usage.requests.map(({ Data }) => Number(Data[1].ScalarValue)).reduce((a, b) => (a + b), 0),
            })
        }
    });

})()