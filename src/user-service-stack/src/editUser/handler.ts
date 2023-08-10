import { PublishCommand } from '@aws-sdk/client-sns';
import { SNSClient } from '@aws-sdk/client-sns';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { middyfy } from "@lib/middleware";

const snsClient = new SNSClient({});
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export default middyfy(async (event) => {
    // if (!event.requestContext.authorizer) {
    //     return {
    //         statusCode: 401,
    //         body: JSON.stringify({
    //             error: {
    //                 title: 'Unauthorized',
    //                 message: 'User is not authenticated',
    //             },
    //         }),
    //     };
    // }
    const { name, email, newEmail } = event.body;

    if (!name || name.length === 0 || !email || email.length === 0 || !newEmail || newEmail.length === 0) {
        return {
            statusCode: 422,
            body: JSON.stringify({
                error: {
                    title: "ValidationError",
                    message: "Required info missing",
                },
            }),
        };
    }
    console.log({ event });

    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME!,
        Key: {
            "pk": name,
            "sk": email,
        },
        UpdateExpression: "set email = :newEmail",
        ExpressionAttributeValues: {
            ":newEmail": newEmail,
        },
        ReturnValues: "ALL_NEW",
    });

    const response = await docClient.send(command);


    await snsClient.send(new PublishCommand({
        Message: "User Created!",
        TopicArn: process.env.SNS_ARN!,
        MessageAttributes: {
          MessageName: {
            DataType: 'String',
            StringValue: 'Update',
          }
        }
      }));
    // const messageParameters = {
    //     Message: "User Updated!",
    //     TopicArn: process.env.SNS_ARN!,
    //     MessageAttributes: {
    //         MessageName: {
    //             DataType: 'String',
    //             StringValue: 'Update',
    //         },
    //     },
    // };

    // await snsClient.send(new PublishCommand(messageParameters));

    return {
        statusCode: 200,
        body: "User Updated Successfully!",
    };
});