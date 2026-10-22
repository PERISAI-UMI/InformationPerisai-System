import { can, hasPermission } from "../src/lib/permissions";
import type { AuthUser } from "../src/types";

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

console.log("🧪 Running permissions tests...");

// Test 1: Pengguna Anonim harus ditolak untuk aksi manajemen
runTest("Pengguna anonim harus ditolak untuk semua aksi mutasi", () => {
  assert(can(null, "create", "posts") === false, "Anonim tidak boleh membuat post");
  assert(can(undefined, "delete", "users") === false, "Anonim tidak boleh menghapus user");
});

// Test 2: Pengguna non-aktif harus ditolak
runTest("Pengguna non-aktif ditolak sekalipun memiliki role SUPER_ADMIN", () => {
  const inactiveUser: AuthUser = {
    id: "usr_1",
    name: "User Nonaktif",
    email: "nonaktif@perisai.org",
    role: "SUPER_ADMIN",
    isActive: false,
  };
  assert(can(inactiveUser, "read", "posts") === false, "User non-aktif tidak boleh memiliki akses");
});

// Test 3: Editor tidak boleh menghapus atau mengelola users
runTest("Role EDITOR tidak boleh menghapus post atau mengelola users", () => {
  const editor: AuthUser = {
    id: "usr_2",
    name: "Editor",
    email: "editor@perisai.org",
    role: "EDITOR",
    isActive: true,
  };
  assert(can(editor, "create", "posts") === true, "Editor boleh membuat post");
  assert(can(editor, "delete", "posts") === false, "Editor tidak boleh menghapus post");
  assert(can(editor, "create", "users") === false, "Editor tidak boleh membuat user");
});

// Test 4: Admin tidak boleh membuat atau menghapus akun user
runTest("Role ADMIN tidak boleh membuat atau menghapus user", () => {
  const admin: AuthUser = {
    id: "usr_3",
    name: "Admin",
    email: "admin@perisai.org",
    role: "ADMIN",
    isActive: true,
  };
  assert(can(admin, "create", "posts") === true, "Admin boleh membuat post");
  assert(can(admin, "delete", "posts") === true, "Admin boleh menghapus post");
  assert(can(admin, "create", "users") === false, "Admin tidak boleh membuat user baru");
  assert(can(admin, "delete", "users") === false, "Admin tidak boleh menghapus user");
});

// Test 5: Super Admin memiliki akses tak terbatas
runTest("Role SUPER_ADMIN memiliki akses penuh ke seluruh sumber daya", () => {
  const superAdmin: AuthUser = {
    id: "usr_4",
    name: "Super Admin",
    email: "sa@perisai.org",
    role: "SUPER_ADMIN",
    isActive: true,
  };
  assert(can(superAdmin, "create", "users") === true, "Super admin boleh membuat user");
  assert(can(superAdmin, "delete", "users") === true, "Super admin boleh menghapus user");
  assert(can(superAdmin, "manage", "settings") === true, "Super admin boleh mengelola settings");
});

// Test 6: hasPermission dengan dynamic permissions dari role
runTest("hasPermission menghormati array permissions dinamis pada AuthUser", () => {
  const customUser: AuthUser = {
    id: "usr_custom",
    name: "Pengurus Kustom",
    email: "custom@perisai.org",
    role: "ADMIN",
    isActive: true,
    permissions: ["opportunities:read", "opportunities:create", "programs:read"],
  };

  assert(hasPermission(customUser, "opportunities:read") === true, "User kustom harus diizinkan opportunities:read");
  assert(hasPermission(customUser, "opportunities:create") === true, "User kustom harus diizinkan opportunities:create");
  assert(hasPermission(customUser, "opportunities:delete") === false, "User kustom ditolak opportunities:delete");
  assert(hasPermission(customUser, "posts:create") === false, "User kustom ditolak posts:create");
});

// Test 7: Isolasi batas wilayah departemen
runTest("hasPermission menegakkan isolasi kepemilikan departemen untuk Kadep", () => {
  const kadepMedia: AuthUser = {
    id: "usr_kadep_media",
    name: "Kadep Media",
    email: "kadep.media@perisai.org",
    role: "ADMIN",
    isActive: true,
    departmentId: "media",
    departmentNumericId: 2,
    positionTitle: "Kepala Departemen Media",
    tier: "departemen",
    permissions: ["programs:read", "programs:create", "programs:update"],
  };

  // Departemen sendiri -> Izinkan
  assert(
    hasPermission(kadepMedia, "programs:update", { departmentId: 2 }) === true,
    "Kadep boleh mengelola proker departemennya sendiri"
  );
  // Departemen orang lain -> Tolak
  assert(
    hasPermission(kadepMedia, "programs:update", { departmentId: 3 }) === false,
    "Kadep tidak boleh mengelola proker departemen lain"
  );
});

console.log("🎉 All permission tests passed successfully!\n");

