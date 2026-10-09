import * as fs from "fs";
import * as path from "path";

export class LocalStorageDriver {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Buffer, filename: string): Promise<{ url: string; path: string }> {
    const filePath = path.join(this.uploadDir, filename);
    await fs.promises.writeFile(filePath, file);
    return {
      url: `/uploads/${filename}`,
      path: `public/uploads/${filename}`,
    };
  }

  async delete(filepath: string): Promise<boolean> {
    const filename = path.basename(filepath);
    const fullPath = path.join(this.uploadDir, filename);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      return true;
    }
    return false;
  }
}
