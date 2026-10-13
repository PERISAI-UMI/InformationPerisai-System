import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export class S3StorageDriver {
  private client: S3Client | null = null;
  private endpoint: string;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    this.endpoint =
      process.env.R2_ENDPOINT ||
      process.env.S3_ENDPOINT ||
      "";
    this.bucket =
      process.env.R2_BUCKET ||
      process.env.R2_BUCKET_NAME ||
      process.env.S3_BUCKET ||
      "";
    this.publicUrl =
      process.env.R2_PUBLIC_URL ||
      process.env.S3_PUBLIC_URL ||
      "";

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
    const region =
      process.env.R2_REGION ||
      process.env.S3_REGION ||
      process.env.AWS_REGION ||
      "auto";

    if (accessKeyId && secretAccessKey && this.bucket) {
      this.client = new S3Client({
        region,
        endpoint: this.endpoint ? this.endpoint : undefined,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
  }

  async upload(
    file: Buffer | Uint8Array,
    filename: string,
    mimeType?: string
  ): Promise<{ url: string; path: string }> {
    const key = `uploads/${Date.now()}-${filename}`;

    if (!this.client || !this.bucket) {
      console.warn(
        "⚠️ Kredensial Cloudflare R2 / S3 belum lengkap di env (R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET). " +
        "Penyimpanan menggunakan URL representatif fallback."
      );
      const fallbackUrl = this.publicUrl
        ? `${this.publicUrl.replace(/\/$/, "")}/${key}`
        : `/uploads/${filename}`;
      return { url: fallbackUrl, path: key };
    }

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimeType || "application/octet-stream",
      })
    );

    let url: string;
    if (this.publicUrl) {
      url = `${this.publicUrl.replace(/\/$/, "")}/${key}`;
    } else if (this.endpoint) {
      url = `${this.endpoint.replace(/\/$/, "")}/${this.bucket}/${key}`;
    } else {
      url = `/${key}`;
    }

    return {
      url,
      path: key,
    };
  }

  async delete(keyOrUrl: string): Promise<boolean> {
    if (!this.client || !this.bucket) {
      return false;
    }

    // Normalisasi kunci penyimpanan: jika input berupa URL penuh atau diawali slash, bersihkan
    let cleanKey = keyOrUrl;
    if (cleanKey.startsWith("http://") || cleanKey.startsWith("https://")) {
      try {
        const parsed = new URL(cleanKey);
        cleanKey = parsed.pathname.replace(/^\//, "");
        if (cleanKey.startsWith(`${this.bucket}/`)) {
          cleanKey = cleanKey.replace(`${this.bucket}/`, "");
        }
      } catch {
        cleanKey = cleanKey.replace(/^https?:\/\/[^/]+\//, "");
      }
    } else {
      cleanKey = cleanKey.replace(/^\//, "");
    }

    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: cleanKey,
        })
      );
      return true;
    } catch (error) {
      console.error(`Gagal menghapus berkas '${cleanKey}' dari Cloudflare R2 / S3:`, error);
      return false;
    }
  }
}

