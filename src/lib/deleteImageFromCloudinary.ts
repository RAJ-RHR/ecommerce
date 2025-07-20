// /lib/deleteImageFromCloudinary.ts
export async function deleteImageFromCloudinary(imageUrl: string) {
  const publicId = extractPublicId(imageUrl);
  if (!publicId) return;

  await fetch('/api/delete-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId }),
  });
}

function extractPublicId(url: string) {
  const match = url.match(/\/v\d+\/(.+)\.\w+$/);
  return match ? match[1] : null;
}
