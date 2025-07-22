import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION, // e.g. "eu-west-2"
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (fileBlob, key) => {
  const arrayBuffer = await fileBlob.arrayBuffer();
  const uint8Body = new Uint8Array(arrayBuffer);

  const params = {
    Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
    Key: key,
    Body: uint8Body,
    ContentType: fileBlob.type,
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    return response;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw error;
  }
};

