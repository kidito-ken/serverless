import { middyfy } from "@lib/middleware";

import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const ddb = new DocumentClient({
    region: "us-east-1"
})

export default middyfy(async () => {
    let returnedData;
    await ddb.scan({
        TableName: process.env.TABLE_NAME!,
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            returnedData = JSON.stringify(data.Items);
        }
    }).promise();

    return {
        statusCode: 200,
        body: returnedData
    }
});