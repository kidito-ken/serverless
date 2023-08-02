import { middyfy } from "@lib/middleware";

import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const ddb = new DocumentClient({
    region: "us-east-1"
})

export default middyfy(async (event) => {
    const { name, email, newEmail } = event.body;

    if (!name || name.length === 0) {
        return {
            statusCode: 422,
            body: JSON.stringify({
                error: {
                    title: "ValidatationError",
                    message: "Name is required"
                }
            })
        }
    }
    console.log({ event });

    await ddb.update({
        TableName: process.env.TABLE_NAME!,
        Key: {
            "pk": name,
            "sk": email
        },
        AttributeUpdates: {
            "email": {
                Action: "PUT",
                Value: newEmail
            }
        }
    }).promise();

    return {
        statusCode: 200,
        body: null
    }
});