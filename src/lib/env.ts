export interface AppConfig {
  databaseUrl: string;
  tursoUrl?: string;
  nodeEnv: string;
  appUrl: string;
  authSecret: string;
  storageDriver: "local" | "s3" | "r2";
  isProduction: boolean;
}

export function validateEnv(): AppConfig {
  const databaseUrl = process.env.DATABASE_URL || "";
  const tursoUrl = process.env.TURSO_DATABASE_URL || (databaseUrl.startsWith("libsql://") ? databaseUrl : undefined);
  const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "development-secret-key-12345";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const nodeEnv = process.env.NODE_ENV || "development";
  const rawDriver = (process.env.STORAGE_DRIVER || "").toLowerCase();
  const storageDriver = (rawDriver === "s3" || rawDriver === "r2" ? rawDriver : "local") as "local" | "s3" | "r2";

  if (nodeEnv === "production") {
    if (!databaseUrl && !tursoUrl) {
      console.warn("⚠️ Peringatan: DATABASE_URL atau TURSO_DATABASE_URL belum diatur di lingkungan produksi.");
    }
    if (authSecret === "development-secret-key-12345") {
      console.warn("⚠️ Peringatan: AUTH_SECRET menggunakan nilai default.");
    }
  }

  return {
    databaseUrl,
    tursoUrl,
    nodeEnv,
    appUrl,
    authSecret,
    storageDriver,
    isProduction: nodeEnv === "production",
  };
}

export const env = validateEnv();

