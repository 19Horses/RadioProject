import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// 1. Create S3 client
const REGION = import.meta.env.VITE_AWS_REGION; // e.g., "us-east-1"
const s3Client = new S3Client({ region: REGION });

// 2. Define your bucket name
const BUCKET_NAME =import.meta.env.BUCKET_NAME;

// 3. List objects inside a folder (e.g., 'images/' or 'data/')
async function listObjects(prefix) {
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: prefix,  // folder path like "images/" or "data/"
  };

  try {
    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);
    return response.Contents || [];
  } catch (err) {
    console.error("Error listing objects:", err);
    return [];
  }
}

// 4. Get pre-signed URL for an object (for browser access)
async function getPresignedUrl(key) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  // URL expires in 1 hour (3600 seconds)
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}

// Example usage:
async function displayFiles() {
  // List all images
  const images = await listObjects("images/");
  // List all data files
  const dataFiles = await listObjects("data/");

  // Generate presigned URLs for images
  const imageUrls = await Promise.all(
    images.map(async (obj) => {
      const url = await getPresignedUrl(obj.Key);
      return { key: obj.Key, url };
    })
  );

  // Similarly for data files (if you want to show contents or links)
  const dataUrls = await Promise.all(
    dataFiles.map(async (obj) => {
      const url = await getPresignedUrl(obj.Key);
      return { key: obj.Key, url };
    })
  );

  

  // You can now pass these URLs to your frontend to display in a grid
}

displayFiles();
