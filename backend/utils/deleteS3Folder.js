const { ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/awsConfig');

const BUCKET = process.env.AWS_S3_BUCKET_NAME;

async function deleteS3Folder(folder) {
  const listRes = await s3.send(new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: `${folder}/`
  }));

  const keys = (listRes.Contents || []).map(obj => ({ Key: obj.Key }));
  if (!keys.length) return;

  await s3.send(new DeleteObjectsCommand({
    Bucket: BUCKET,
    Delete: { Objects: keys }
  }));
}

module.exports = deleteS3Folder;
