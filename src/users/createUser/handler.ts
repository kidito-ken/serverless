import { middyfy } from "@lib/middleware";
import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export default middyfy(async (event) => {
  const { name, email } = event.body;
  const command = new PutItemCommand({
    TableName: process.env.TABLE_NAME!,
    Item: {
      pk: { S: name },
      sk: { S: email },
    },
  });

  const response = await client.send(command);
  console.log(response);
  return {
    statusCode: 200,
    body: null
  }
});