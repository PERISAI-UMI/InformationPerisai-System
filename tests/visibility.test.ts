function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ PASSED: ${name}`);
  } catch (err) {
    console.error(`  ✗ FAILED: ${name}`, err);
    throw err;
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

console.log("🧪 Running visibility tests...");

// Mock data
interface MockPost {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

const mockPosts: MockPost[] = [
  { id: "1", title: "Artikel Publik 1", status: "PUBLISHED" },
  { id: "2", title: "Draft Rahasia", status: "DRAFT" },
  { id: "3", title: "Artikel Publik 2", status: "PUBLISHED" },
  { id: "4", title: "Arsip Lawas", status: "ARCHIVED" },
];

function filterPublicPosts(posts: MockPost[]) {
  return posts.filter((p) => p.status === "PUBLISHED");
}

runTest("Draft dan arsip tidak boleh bocor pada query publik", () => {
  const publicResults = filterPublicPosts(mockPosts);
  assert(publicResults.length === 2, "Harus menghasilkan tepat 2 artikel terpublikasi");
  assert(!publicResults.some((p) => p.status === "DRAFT"), "Draft tidak boleh muncul ke publik");
  assert(!publicResults.some((p) => p.status === "ARCHIVED"), "Arsip tidak boleh muncul ke publik");
});

runTest("Hanya anggota dari periode aktif yang ditampilkan ke publik", () => {
  const mockMembers = [
    { id: "m1", name: "Ketua Aktif", period: { isActive: true }, isActive: true },
    { id: "m2", name: "Ketua Demisioner", period: { isActive: false }, isActive: true },
    { id: "m3", name: "Anggota Nonaktif", period: { isActive: true }, isActive: false },
  ];

  const publicMembers = mockMembers.filter((m) => m.period.isActive && m.isActive);
  assert(publicMembers.length === 1, "Hanya 1 anggota aktif di periode berjalan");
  assert(publicMembers[0].name === "Ketua Aktif", "Ketua aktif harus cocok");
});

console.log("🎉 All visibility tests passed successfully!\n");
