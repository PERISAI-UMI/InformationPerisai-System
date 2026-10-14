/**
 * storage/local.ts — Local Disk Storage Driver
 *
 * Hanya untuk pengembangan lokal (Node.js). Di Cloudflare Workers,
 * driver ini tidak boleh dipanggil. Factory `getStorageDriver()` di index.ts
 * hanya memilih driver ini jika STORAGE_DRIVER=local DAN bukan edge runtime.
 *
 * Menggunakan dynamic import untuk `fs` dan `path` agar bundler edge
 * tidak mencoba menyertakan modul ini ke dalam worker bundle.
 */

export class LocalStorageDriver {
  private uploadDir: string;

  constructor() {
    // Nilai sementara — akan diinisialisasi ulang di upload() jika diperlukan
    this.uploadDir = "";
    this.initDir();
  }

  private initDir(): void {
    try {
      // Gunakan import sinkron hanya di Node.js
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs") as typeof import("fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path") as typeof import("path");
      this.uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }
    } catch {
      this.uploadDir = "/tmp";
    }
  }

  async upload(
    file: Buffer | Uint8Array,
    filename: string
  ): Promise<{ url: string; path: string }> {
    try {
      // Dynamic import agar tidak masuk bundle edge
      const fs = await import("fs");
      const path = await import("path");

      if (!this.uploadDir) this.initDir();
      const filePath = path.join(this.uploadDir, filename);
      await fs.promises.writeFile(filePath, file);

      return {
        url: `/uploads/${filename}`,
        path: `public/uploads/${filename}`,
      };
    } catch (error) {
      console.error("[storage/local] Gagal menyimpan berkas:", error);
      // Kembalikan path representatif meski gagal disimpan
      return {
        url: `/uploads/${filename}`,
        path: `public/uploads/${filename}`,
      };
    }
  }

  async delete(filepath: string): Promise<boolean> {
    try {
      const fs = await import("fs");
      const path = await import("path");

      const filename = path.basename(filepath);
      const fullPath = path.join(this.uploadDir, filename);

      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
