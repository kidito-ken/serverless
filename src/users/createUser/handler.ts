import { middyfy } from "@lib/middleware";

import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const ddb = new DocumentClient({
  region: "us-east-1"
})

export default middyfy(async (event) => {
  const { name, email, phoneNumber } = event.body;

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

  await ddb.put({
    TableName: process.env.TABLE_NAME!,
    Item: {
      "pk": "user",
      "sk": email
    }
  }).promise();

  return {
    statusCode: 201,
    body: null
  }
});