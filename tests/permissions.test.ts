import { can } from "../src/lib/permissions";
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

console.log("🎉 All permission tests passed successfully!\n");
