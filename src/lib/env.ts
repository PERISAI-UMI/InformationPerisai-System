export interface AppConfig {
  databaseUrl: string;
  nodeEnv: string;
  appUrl: string;
  authSecret: string;
  storageDriver: "local" | "s3";
  isProduction: boolean;
}

export function validateEnv(): AppConfig {
  const databaseUrl = process.env.DATABASE_URL || "";
  const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "development-secret-key-12345";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const nodeEnv = process.env.NODE_ENV || "development";
  const storageDriver = (process.env.STORAGE_DRIVER === "s3" ? "s3" : "local") as "local" | "s3";

  if (nodeEnv === "production") {
    if (!databaseUrl) {
      console.warn("⚠️ Peringatan: DATABASE_URL belum diatur di lingkungan produksi.");
    }
    if (authSecret === "development-secret-key-12345") {
      console.warn("⚠️ Peringatan: AUTH_SECRET menggunakan nilai default.");
    }
  }

  return {
    databaseUrl,
    nodeEnv,
    appUrl,
    authSecret,
    storageDriver,
    isProduction: nodeEnv === "production",
  };
}

export const env = validateEnv();
