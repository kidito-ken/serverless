import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { middyfy } from '@lib/middleware';

const s3Client = new S3Client({});

export default middyfy(async (event) => {
  // if (!event.requestContext.authorizer) {
  //   return {
  //     statusCode: 401,
  //     body: JSON.stringify({
  //       error: {
  //         title: 'Unauthorized',
  //         message: `User is not authenticated`,
  //       },
  //     }),
  //   };
  // }

  const { name, email, picture } = event.body;

  if (!name || name.length === 0 || !email || email.length === 0 || !picture || picture.length === 0) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: {
          title: 'ValidationError',
          message: 'Required information is missing',
        },
      }),
    };
  }

  console.log({ event });

  const bucketName = 'my-awesome-unique-long-s3-bucket-name-20230808';
  const objectKey = `${name}-${email}.jpg`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: picture,
    ContentType: 'image/jpeg',
  });

  try {
    const response = await s3Client.send(command);

    return {
      statusCode: 200,
      body: 'Profile Picture Uploaded Successfully!',
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Internal Server Error',
          message: 'Failed to upload profile picture',
        },
      }),
    };
  }
});