import * as prismaConfig from "prisma/config";

const define = (prismaConfig as any).defineConfig || (prismaConfig as any).definePrismaConfig || ((c: any) => c);

export default define({
  datasource: {
    url: process.env.DATABASE_URL || "file:./psdm-db.db",
  },
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});

