const extensions: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
  "application/pdf": ["pdf"],
}

export async function validateUpload(file: File): Promise<string | null> {
  const extension = file.name.split(".").pop()?.toLowerCase() || ""
  if (!extensions[file.type]?.includes(extension)) return "Use a JPG, PNG, WebP, GIF or PDF with a matching file extension."
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer())
  const starts = (...values: number[]) => values.every((value, index) => bytes[index] === value)
  const ascii = new TextDecoder().decode(bytes)
  const valid = {
    "image/jpeg": starts(0xff, 0xd8, 0xff),
    "image/png": starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a),
    "image/gif": ascii.startsWith("GIF87a") || ascii.startsWith("GIF89a"),
    "image/webp": ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP",
    "application/pdf": ascii.startsWith("%PDF-"),
  }[file.type]
  return valid ? null : "The file contents do not match its declared format."
}
