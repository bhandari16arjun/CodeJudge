const { GetObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/awsConfig');

const streamToString = async (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (c) => chunks.push(c));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });

const getTestCasesFromS3 = async (folder, filename) => {
  const key = `${folder}/${filename}`;
  const cmd = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key:    key,
  });
  const res = await s3.send(cmd);
  const body = await streamToString(res.Body);
  return JSON.parse(body);
};

module.exports = { getTestCasesFromS3 };
