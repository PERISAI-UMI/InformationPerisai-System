import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const mode = process.argv[2];
const target = process.argv[3];
const snapshotPath = path.resolve(process.cwd(), "db", "protected-schema.snapshot.json");

if (!mode || !["sql", "live", "snapshot"].includes(mode)) {
  console.error("Usage: node db/guard.mjs <sql|live|snapshot> [target]");
  process.exit(1);
}

const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf-8"));
const protectedTables = Object.keys(snapshot.tables);

if (mode === "sql") {
  if (!target) {
    console.error("Error: Please provide SQL file path, e.g. node db/guard.mjs sql db/migrations/002_complete_perisai_schema.sql");
    process.exit(1);
  }
  const sql = fs.readFileSync(path.resolve(process.cwd(), target), "utf-8");
  const forbiddenPatterns = [
    /DROP\s+TABLE/i,
    /DROP\s+COLUMN/i,
    /ALTER\s+TABLE\s+(?!web_)/i,
    /DELETE\s+FROM\s+(?!web_)/i,
    /UPDATE\s+(?!web_)/i,
    /INSERT\s+INTO\s+(?!web_)/i,
  ];

  for (const pat of forbiddenPatterns) {
    if (pat.test(sql)) {
      console.error(`❌ SQL Guard check FAILED! Forbidden destructive pattern found: ${pat}`);
      process.exit(1);
    }
  }

  for (const pt of protectedTables) {
    const tableRef = new RegExp(`\\b${pt}\\b`, "i");
    const createOrDrop = new RegExp(`(CREATE|DROP|ALTER)\\s+TABLE\\s+${pt}\\b`, "i");
    if (createOrDrop.test(sql)) {
      console.error(`❌ SQL Guard check FAILED! Cannot alter or create protected table: ${pt}`);
      process.exit(1);
    }
  }

  console.log(`✅ SQL Guard check PASSED for: ${target}`);
  process.exit(0);
}

if (mode === "live") {
  const dbFile = target || "psdm-db.db";
  const db = new DatabaseSync(path.resolve(process.cwd(), dbFile));
  console.log(`🔍 Verifying live database against protected snapshot: ${dbFile}`);

  for (const [tableName, expected] of Object.entries(snapshot.tables)) {
    const cols = db.prepare(`PRAGMA table_info("${tableName}")`).all();
    if (!cols || cols.length === 0) {
      console.error(`❌ Live Guard FAILED: Protected table "${tableName}" is missing!`);
      process.exit(1);
    }

    const colNames = new Set(cols.map((c) => c.name));
    for (const expCol of expected.columns) {
      if (!colNames.has(expCol.name)) {
        console.error(`❌ Live Guard FAILED: Column "${expCol.name}" in table "${tableName}" is missing!`);
        process.exit(1);
      }
    }
  }

  console.log("✅ Live database integrity verified! All PSDM protected tables & columns are 100% intact.");
  process.exit(0);
}

if (mode === "snapshot") {
  const dbFile = target || "psdm-db.db";
  const db = new DatabaseSync(path.resolve(process.cwd(), dbFile));
  const newSnapshot = {
    generated_at: new Date().toISOString(),
    note: "Skema tabel milik sistem PSDM. Tidak berisi data.",
    tables: {},
  };

  for (const t of protectedTables) {
    const cols = db.prepare(`PRAGMA table_info("${t}")`).all();
    const indexes = db.prepare(`PRAGMA index_list("${t}")`).all();
    const fks = db.prepare(`PRAGMA foreign_key_list("${t}")`).all();

    newSnapshot.tables[t] = {
      columns: cols.map((c) => ({
        name: c.name,
        type: c.type,
        notnull: Boolean(c.notnull),
        pk: c.pk,
      })),
      indexes: indexes.map((idx) => ({
        name: idx.name,
        unique: Boolean(idx.unique),
      })),
      foreignKeys: fks.map((fk) => ({
        from: fk.from,
        table: fk.table,
        to: fk.to,
        on_delete: fk.on_delete,
      })),
    };
  }

  fs.writeFileSync(snapshotPath, JSON.stringify(newSnapshot, null, 2), "utf-8");
  console.log(`✅ Snapshot updated in ${snapshotPath}`);
  process.exit(0);
}
