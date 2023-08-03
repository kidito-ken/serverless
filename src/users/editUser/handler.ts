import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { middyfy } from "@lib/middleware";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export default middyfy(async (event) => {
    const { name, email, newEmail } = event.body;

    if (!name || name.length === 0 || !email || email.length === 0 || !newEmail || newEmail.length === 0) {
        return {
            statusCode: 422,
            body: JSON.stringify({
                error: {
                    title: "ValidatationError",
                    message: "required information is required"
                }
            })
        }
    }
    console.log({ event });

    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME!,
        Key: {
            "pk": name,
            "sk": email
        },
        UpdateExpression: "set email = :newEmail",
        ExpressionAttributeValues: {
            ":newEmail": newEmail
        },
        ReturnValues: "ALL_NEW"
    });

    const response = await docClient.send(command);
    return {
        statusCode: 200,
        body: "User Updated Successfully!"
    }
});