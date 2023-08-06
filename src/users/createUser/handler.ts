import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { middyfy } from "@lib/middleware";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const queueClient = new SQSClient({});

export default middyfy(async (event) => {
  const { name, email } = event.body;
  const command = new PutCommand({
    TableName: process.env.TABLE_NAME!,
    Item: {
      pk: name,
      sk: email,
    },
  });

  const response = await docClient.send(command);

  const queueCommand = new SendMessageCommand({
    QueueUrl: process.env.QUEUE_URL!,
    MessageBody: "User Created!"
  })

  await queueClient.send(queueCommand);

  return {
    statusCode: 200,
    body: "User Created Successfully!"
  }
});