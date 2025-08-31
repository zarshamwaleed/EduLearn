// src/utils/getImageUrl.js
export function getImageUrl(path) {
  if (!path) return "/default-profile-pic.jpg";
  const cleanPath = path.replace(/^\.\/?/, ""); // remove ./ from start
  const base = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
  return `${base}/${cleanPath}`;
}