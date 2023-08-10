import Responses from '../Responses';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fileTypeFromBuffer } from 'file-type';
import { v4 as uuid } from 'uuid';
import { middyfy } from '@lib/middleware';

const s3Client = new S3Client({});

const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];

export default middyfy(async (event) => {
  try {
    const { image, mime } = event.body;

    if (!image || !mime) {
      return Responses._400({ message: 'incorrect body on request' });
    }

    // if (!allowedMimes.includes(mime)) {
    //   return Responses._400({ message: 'mime is not allowed ' });
    // }

    let imageData = image;
    if (image.substr(0, 7) === 'base64,') {
      imageData = image.substr(7, image.length);
    }

    const buffer = Buffer.from(imageData, 'base64');
    const fileInfo = await fileTypeFromBuffer(buffer);
    const detectedExt = fileInfo?.ext;
    const detectedMime = fileInfo?.mime;

    // if (detectedMime !== mime) {
    //   return Responses._400({ message: 'mime types dont match' });
    // }

    const name = uuid();
    const key = `${name}.jpeg`;

    console.log(`writing image to bucket called ${key}`);

    const putObjectCommand = new PutObjectCommand({
      Body: buffer,
      Key: key,
      ContentType: mime,
      Bucket: process.env.BUCKET_NAME,
    });

    const putObjectResponse = await s3Client.send(putObjectCommand);

    const url = `https://${process.env.BUCKET_NAME}.s3-${process.env.REGION}.amazonaws.com/${key}`;
    return Responses._200({
      imageURL: url,
    });
  } catch (error) {
    console.log('error', error);

    return Responses._400({
      message: error.message || 'failed to upload image',
    });
  }
});