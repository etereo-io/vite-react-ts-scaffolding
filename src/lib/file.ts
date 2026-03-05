const MIME_TYPES = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
  mp4: "video/mp4",
  mp3: "audio/mpeg",
  json: "application/json",
  csv: "text/csv",
  txt: "text/plain",
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  ts: "text/typescript",
  zip: "application/zip",
  doc: "application/msword",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
} as const;

export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1 || lastDot === filename.length - 1) return "";
  return filename.slice(lastDot + 1).toLowerCase();
}

export function getFileName(filepath: string): string {
  const lastSlash = Math.max(
    filepath.lastIndexOf("/"),
    filepath.lastIndexOf("\\")
  );
  return lastSlash === -1 ? filepath : filepath.slice(lastSlash + 1);
}

export function getMimeType(filename: string): string {
  const ext = getFileExtension(filename);
  return (
    MIME_TYPES[ext as keyof typeof MIME_TYPES] ?? "application/octet-stream"
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes < 0) return "0 B";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  const threshold = 1024;

  let unitIndex = 0;
  let size = bytes;

  while (size >= threshold && unitIndex < units.length - 1) {
    size /= threshold;
    unitIndex++;
  }

  const formatted = unitIndex === 0 ? size.toString() : size.toFixed(2);
  return `${formatted} ${units[unitIndex]}`;
}
