export const uploadToBackend = async (fileBlob, key, contentType) => {
  const formData = new FormData();
  formData.append("file", fileBlob);
  formData.append("key", key);
  formData.append("contentType", contentType);

  const response = await fetch("https://your-backend.onrender.com/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upload failed: ${error}`);
  }

  const result = await response.json();
  return result;
};

