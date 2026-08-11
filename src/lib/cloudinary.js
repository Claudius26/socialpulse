const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`, {
    method: "POST",
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");
  return { url: data.secure_url, public_id: data.public_id, resource_type: data.resource_type };
}
