import {
  formatFileSize,
  getFileExtension,
  getFileName,
  getMimeType
} from "./file";

describe("getFileExtension", () => {
  test("returns extension for a simple filename", () => {
    expect(getFileExtension("document.pdf")).toBe("pdf");
  });

  test("returns extension in lowercase", () => {
    expect(getFileExtension("photo.PNG")).toBe("png");
  });

  test("returns last extension for double-extension files", () => {
    expect(getFileExtension("archive.tar.gz")).toBe("gz");
  });

  test("returns empty string for files without extension", () => {
    expect(getFileExtension("README")).toBe("");
  });

  test("returns empty string when dot is the last character", () => {
    expect(getFileExtension("file.")).toBe("");
  });

  test("handles dotfiles", () => {
    expect(getFileExtension(".gitignore")).toBe("gitignore");
  });
});

describe("getFileName", () => {
  test("returns filename from a Unix path", () => {
    expect(getFileName("/home/user/document.pdf")).toBe("document.pdf");
  });

  test("returns filename from a Windows path", () => {
    expect(getFileName("C:\\Users\\user\\document.pdf")).toBe("document.pdf");
  });

  test("returns the string itself when there is no path separator", () => {
    expect(getFileName("document.pdf")).toBe("document.pdf");
  });

  test("handles trailing slash by returning empty string", () => {
    expect(getFileName("/home/user/")).toBe("");
  });

  test("handles nested path", () => {
    expect(getFileName("/a/b/c/d/file.txt")).toBe("file.txt");
  });
});

describe("getMimeType", () => {
  test("returns correct MIME type for pdf", () => {
    expect(getMimeType("report.pdf")).toBe("application/pdf");
  });

  test("returns correct MIME type for jpg", () => {
    expect(getMimeType("photo.jpg")).toBe("image/jpeg");
  });

  test("returns correct MIME type for jpeg", () => {
    expect(getMimeType("photo.jpeg")).toBe("image/jpeg");
  });

  test("returns correct MIME type for png", () => {
    expect(getMimeType("image.png")).toBe("image/png");
  });

  test("returns correct MIME type for svg", () => {
    expect(getMimeType("icon.svg")).toBe("image/svg+xml");
  });

  test("returns correct MIME type for json", () => {
    expect(getMimeType("data.json")).toBe("application/json");
  });

  test("returns correct MIME type for csv", () => {
    expect(getMimeType("data.csv")).toBe("text/csv");
  });

  test("returns correct MIME type for xlsx", () => {
    expect(getMimeType("spreadsheet.xlsx")).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  });

  test("returns octet-stream for unknown extension", () => {
    expect(getMimeType("file.xyz")).toBe("application/octet-stream");
  });

  test("returns octet-stream for file without extension", () => {
    expect(getMimeType("README")).toBe("application/octet-stream");
  });
});

describe("formatFileSize", () => {
  test("formats zero bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  test("formats bytes", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });

  test("formats kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1.00 KB");
  });

  test("formats megabytes", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1.00 MB");
  });

  test("formats gigabytes", () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe("1.00 GB");
  });

  test("formats terabytes", () => {
    expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe("1.00 TB");
  });

  test("formats fractional sizes", () => {
    expect(formatFileSize(1536)).toBe("1.50 KB");
  });

  test("handles negative bytes", () => {
    expect(formatFileSize(-100)).toBe("0 B");
  });

  test("formats large file sizes correctly", () => {
    expect(formatFileSize(5.5 * 1024 * 1024)).toBe("5.50 MB");
  });
});
