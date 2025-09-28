const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3                   = require('../config/awsConfig');
const uploadToS3 = async (buffer, folder, filename, contentType) => {
  const key = `${folder}/${filename}`;
  const cmd = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key:    key,
    Body:   buffer,
    ContentType: contentType,
  });
  await s3.send(cmd);
};

module.exports = uploadToS3;
