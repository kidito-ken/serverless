// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { middyfy } from '@lib/middleware';
// import * as fileType from 'file-type';
// import { url } from 'inspector';
// import { v4 as uuid } from 'uuid';

// const s3Client = new S3Client({});

// export default middyfy(async (event) => {
//   try {
//     // const body = JSON.parse(event.body);
//     const { image, mime} = event.body;
//     if (!image || !mime) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({
//           error: {
//             title: "ValidationError",
//             message: "Required info missing",
//           },
//         }),
//       };
//     }

//     // if (!allowedMimes.includes(body.mime)) {
//     //   return {
//     //     statusCode: 400,
//     //     body: JSON.stringify({
//     //       error: {
//     //         title: "ValidationError",
//     //         message: "Invalid MIME type",
//     //       },
//     //     }),
//     //   };
//     // }

//     // let imageData = image;
//     // if (body.image.substr(0, 7) === 'base64') {
//     //   imageData = body.image.substr(7, body.image.length);
//     // }
//     let imageData = image;

//     const buffer = Buffer.from(imageData, 'base64');
//     const fileInfo = await fileType.fromBuffer(buffer);
//     const detectedExt = fileInfo?.ext;
//     const detectedMime = fileInfo?.mime;

//     // if (detectedMime !== body.mime) {
//     //   return {
//     //     statusCode: 400,
//     //     body: JSON.stringify({
//     //       error: {
//     //         title: "ValidationError",
//     //         message: "Mime types don't match",
//     //       },
//     //     }),
//     //   };
//     // }

//     const name = uuid();
//     const key = `${name}.jpeg`;
//     console.log(`writing image to bucket called ${key}`);

//     const putObjectCommand = new PutObjectCommand({
//       Bucket: process.env.BUCKET_NAME!,
//       Key: key,
//       Body: buffer,
//       ContentType: mime,
//     });

//     const imageUrl = `https://${process.env.BUCKET_NAME}.s3-${process.env.REGION}.amazonaws.com/${key}`;


//     await s3Client.send(putObjectCommand);

//     return {
//       statusCode: 200,
//       body: imageUrl
//     };

//   } catch (error) {
//     console.log('error', error)
//     return {
//       statusCode: 400,
//       body: JSON.stringify({
//         error: {
//           title: "Something went wrong",
//           message: "IDK whats wrong lol",
//         },
//       }),
//     };
//   }
// });
