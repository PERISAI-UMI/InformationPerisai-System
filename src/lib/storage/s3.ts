/**
 * storage/s3.ts — Cloudflare R2 / AWS S3 Storage Driver (Edge-safe)
 *
 * Menggunakan @aws-sdk/client-s3 yang kompatibel dengan Web APIs standard.
 * Operasi upload menggunakan Uint8Array/Buffer (bukan Node.js Readable streams)
 * sehingga berjalan di Cloudflare Workers.
 *
 * Env vars yang dibaca (R2_* lebih diutamakan, S3_* sebagai alias):
 *   R2_ENDPOINT           / S3_ENDPOINT
 *   R2_BUCKET             / S3_BUCKET
 *   R2_ACCESS_KEY_ID      / S3_ACCESS_KEY_ID      / AWS_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY  / S3_SECRET_ACCESS_KEY  / AWS_SECRET_ACCESS_KEY
 *   R2_PUBLIC_URL         / S3_PUBLIC_URL
 *   R2_REGION             / S3_REGION             / AWS_REGION  (default: "auto")
 */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";

export class S3StorageDriver {
  private client: S3Client | null = null;
  private endpoint: string;
  private bucket: string;
  private publicUrl: string;
  private region: string;

  constructor() {
    this.endpoint =
      process.env.R2_ENDPOINT || process.env.S3_ENDPOINT || "";

    this.bucket =
      process.env.R2_BUCKET ||
      process.env.R2_BUCKET_NAME ||
      process.env.S3_BUCKET ||
      "";

    this.publicUrl =
      process.env.R2_PUBLIC_URL || process.env.S3_PUBLIC_URL || "";

    this.region =
      process.env.R2_REGION ||
      process.env.S3_REGION ||
      process.env.AWS_REGION ||
      "auto";

    const accessKeyId =
      process.env.R2_ACCESS_KEY_ID ||
      process.env.S3_ACCESS_KEY_ID ||
      process.env.AWS_ACCESS_KEY_ID ||
      "";

    const secretAccessKey =
      process.env.R2_SECRET_ACCESS_KEY ||
      process.env.S3_SECRET_ACCESS_KEY ||
      process.env.AWS_SECRET_ACCESS_KEY ||
      "";

    if (accessKeyId && secretAccessKey && this.bucket) {
      this.client = new S3Client({
        region: this.region,
        endpoint: this.endpoint || undefined,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        // Cloudflare R2 memerlukan path-style URL
        forcePathStyle: false,
      });
    }
  }

  /**
   * Apakah driver siap digunakan (kredensial tersedia).
   */
  get isConfigured(): boolean {
    return this.client !== null;
  }

  /**
   * Upload berkas ke R2/S3.
   * @param file     - Buffer atau Uint8Array (Web-standard, kompatibel dengan edge)
   * @param filename - Nama berkas yang sudah disanitasi
   * @param mimeType - MIME type berkas
   */
  async upload(
    file: Buffer | Uint8Array,
    filename: string,
    mimeType?: string
  ): Promise<{ url: string; path: string }> {
    const key = `uploads/${filename}`;

    if (!this.client || !this.bucket) {
      // Fallback aman jika kredensial belum dikonfigurasi
      console.warn(
        "[storage/s3] Kredensial R2/S3 belum dikonfigurasi " +
          "(R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET). " +
          "Menggunakan URL representatif sebagai fallback."
      );
      const fallbackUrl = this.publicUrl
        ? `${this.publicUrl.replace(/\/$/, "")}/${key}`
        : `/uploads/${filename}`;
      return { url: fallbackUrl, path: key };
    }

    // Konversi ke Uint8Array untuk kompatibilitas Web Streams di edge
    const body: Uint8Array =
      file instanceof Buffer ? new Uint8Array(file) : file;

    const params: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: mimeType || "application/octet-stream",
      // Semua objek bersifat publik-baca (sesuai konfigurasi bucket R2 publik)
    };

    await this.client.send(new PutObjectCommand(params));

    const url = this.buildPublicUrl(key);
    return { url, path: key };
  }

  /**
   * Hapus berkas dari R2/S3 berdasarkan storage key atau URL publik.
   */
  async delete(keyOrUrl: string): Promise<boolean> {
    if (!this.client || !this.bucket) {
      return false;
    }

    const cleanKey = this.normalizeKey(keyOrUrl);

    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: cleanKey,
        })
      );
      return true;
    } catch (error) {
      console.error(
        `[storage/s3] Gagal menghapus berkas '${cleanKey}':`,
        error
      );
      return false;
    }
  }

  /** Bangun URL publik untuk sebuah storage key */
  private buildPublicUrl(key: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl.replace(/\/$/, "")}/${key}`;
    }
    if (this.endpoint) {
      return `${this.endpoint.replace(/\/$/, "")}/${this.bucket}/${key}`;
    }
    return `/${key}`;
  }

  /**
   * Normalisasi key dari berbagai format:
   * - URL penuh (https://...) → ekstrak path
   * - Path dengan leading slash → hapus slash
   * - Path dengan prefix bucket → hapus prefix
   */
  private normalizeKey(input: string): string {
    let key = input;

    if (key.startsWith("http://") || key.startsWith("https://")) {
      try {
        const parsed = new URL(key);
        key = parsed.pathname.replace(/^\//, "");
        // Hapus prefix bucket jika ada (mis. "bucket-name/uploads/...")
        if (this.bucket && key.startsWith(`${this.bucket}/`)) {
          key = key.slice(this.bucket.length + 1);
        }
      } catch {
        key = key.replace(/^https?:\/\/[^/]+\//, "");
      }
    } else {
      key = key.replace(/^\//, "");
    }

    return key;
  }
}
