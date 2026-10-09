const fs = require('fs');

const extraModels = `

// ========================================================
// STRUKTUR DATA BARU 2026/2027 (M_* & T_*)
// ========================================================

model MFakultas {
  idFakultas   Int        @id @default(autoincrement()) @map("id_fakultas")
  namaFakultas String     @unique @map("nama_fakultas")
  kodeFakultas String?    @unique @map("kode_fakultas")
  createdAt    Int        @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt    Int        @default(dbgenerated("(unixepoch())")) @map("updated_at")

  jurusan      MJurusan[]

  @@map("M_Fakultas")
}

model MJurusan {
  idJurusan   Int        @id @default(autoincrement()) @map("id_jurusan")
  idFakultas  Int        @map("id_fakultas")
  namaJurusan String     @map("nama_jurusan")
  jenjang     String     @default("S1")
  createdAt   Int        @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt   Int        @default(dbgenerated("(unixepoch())")) @map("updated_at")

  fakultas    MFakultas  @relation(fields: [idFakultas], references: [idFakultas], onDelete: Cascade)
  anggota     MAnggota[]

  @@map("M_Jurusan")
}

model MDepartemen {
  idDepartemen     Int             @id @default(autoincrement()) @map("id_departemen")
  namaDepartemen   String          @unique @map("nama_departemen")
  singkatan        String          @unique
  slug             String          @unique
  tupoksiUtama     String?         @map("tupoksi_utama")
  deskripsiSingkat String?         @map("deskripsi_singkat")
  visi             String?
  misi             String?
  fotoGrup         String?         @map("foto_grup")
  urutan           Int             @default(0)
  isActive         Int             @default(1) @map("is_active")
  createdAt        Int             @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt        Int             @default(dbgenerated("(unixepoch())")) @map("updated_at")

  jabatan          MJabatan[]
  kepengurusan     TKepengurusan[]
  proker           TProker[]
  berita           TBerita[]
  kompetisi        TKompetisi[]

  @@map("M_Departemen")
}

model MJabatan {
  idJabatan     Int             @id @default(autoincrement()) @map("id_jabatan")
  idDepartemen  Int?            @map("id_departemen")
  namaJabatan   String          @map("nama_jabatan")
  levelHirarki  Int             @default(5) @map("level_hirarki")
  urutan        Int             @default(0)
  createdAt     Int             @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt     Int             @default(dbgenerated("(unixepoch())")) @map("updated_at")

  departemen    MDepartemen?    @relation(fields: [idDepartemen], references: [idDepartemen], onDelete: SetNull)
  kepengurusan  TKepengurusan[]

  @@map("M_Jabatan")
}

model MPeriode {
  idPeriode        Int             @id @default(autoincrement()) @map("id_periode")
  namaPeriode      String          @unique @map("nama_periode")
  tahunMulai       Int             @map("tahun_mulai")
  tahunSelesai     Int             @map("tahun_selesai")
  isActive         Int             @default(0) @map("is_active")
  temaKepengurusan String?         @map("tema_kepengurusan")
  visi             String?
  misi             String?
  createdAt        Int             @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt        Int             @default(dbgenerated("(unixepoch())")) @map("updated_at")

  kepengurusan     TKepengurusan[]
  proker           TProker[]
  keuangan         TKeuangan[]

  @@map("M_Periode")
}

model MRole {
  idRole    Int      @id @default(autoincrement()) @map("id_role")
  namaRole  String   @unique @map("nama_role")
  label     String
  deskripsi String?
  createdAt Int      @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt Int      @default(dbgenerated("(unixepoch())")) @map("updated_at")

  akun      MAkun[]

  @@map("M_Role")
}

model MAnggota {
  idPerisai    String          @id @map("id_perisai")
  namaLengkap  String          @map("nama_lengkap")
  nim          String          @unique
  idJurusan    Int?            @map("id_jurusan")
  angkatan     Int
  gen          Int
  tempatLahir  String?         @map("tempat_lahir")
  tanggalLahir String?         @map("tanggal_lahir")
  jenisKelamin String?         @default("L") @map("jenis_kelamin")
  email        String          @unique
  noWa         String?         @map("no_wa")
  alamat       String?
  linkedin     String?
  instagram    String?
  hobi         String?
  quotes       String?
  fotoUrl      String?         @map("foto_url")
  status       String          @default("aktif")
  createdAt    Int             @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt    Int             @default(dbgenerated("(unixepoch())")) @map("updated_at")

  jurusan      MJurusan?       @relation(fields: [idJurusan], references: [idJurusan], onDelete: SetNull)
  akun         MAkun?
  kepengurusan TKepengurusan[]
  prestasi     TPrestasi[]
  prokerPj     TProker[]       @relation("ProkerPenanggungJawab")
  beritaDitulis TBerita[]      @relation("BeritaPenulis")
  keuanganDicatat TKeuangan[]  @relation("KeuanganDicatatOleh")

  @@map("M_Anggota")
}

model MAkun {
  idAkun       Int        @id @default(autoincrement()) @map("id_akun")
  idPerisai    String     @unique @map("id_perisai")
  idRole       Int        @map("id_role")
  passwordHash String     @map("password_hash")
  isActive     Int        @default(1) @map("is_active")
  lastLogin    Int?       @map("last_login")
  createdAt    Int        @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt    Int        @default(dbgenerated("(unixepoch())")) @map("updated_at")

  anggota      MAnggota   @relation(fields: [idPerisai], references: [idPerisai], onDelete: Cascade)
  role         MRole      @relation(fields: [idRole], references: [idRole], onDelete: Restrict)
  sesi         TSesi[]

  @@map("M_Akun")
}

model TSesi {
  idSesi    String   @id @map("id_sesi")
  idAkun    Int      @map("id_akun")
  token     String   @unique
  ipAddress String?  @map("ip_address")
  userAgent String?  @map("user_agent")
  payload   String?
  expiresAt Int      @map("expires_at")
  createdAt Int      @default(dbgenerated("(unixepoch())")) @map("created_at")

  akun      MAkun    @relation(fields: [idAkun], references: [idAkun], onDelete: Cascade)

  @@map("T_Sesi")
}

model TKepengurusan {
  idKepengurusan Int          @id @default(autoincrement()) @map("id_kepengurusan")
  idPeriode      Int          @map("id_periode")
  idPerisai      String       @map("id_perisai")
  idJabatan      Int          @map("id_jabatan")
  idDepartemen   Int?         @map("id_departemen")
  status         String       @default("aktif")
  urutan         Int          @default(0)
  createdAt      Int          @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt      Int          @default(dbgenerated("(unixepoch())")) @map("updated_at")

  periode        MPeriode     @relation(fields: [idPeriode], references: [idPeriode], onDelete: Cascade)
  anggota        MAnggota     @relation(fields: [idPerisai], references: [idPerisai], onDelete: Cascade)
  jabatan        MJabatan     @relation(fields: [idJabatan], references: [idJabatan], onDelete: Restrict)
  departemen     MDepartemen? @relation(fields: [idDepartemen], references: [idDepartemen], onDelete: SetNull)

  @@unique([idPeriode, idPerisai, idJabatan])
  @@map("T_Kepengurusan")
}

model TProker {
  idProker             Int          @id @default(autoincrement()) @map("id_proker")
  idDepartemen         Int          @map("id_departemen")
  idPeriode            Int          @map("id_periode")
  namaProker           String       @map("nama_proker")
  slug                 String       @unique
  deskripsi            String?
  targetPelaksanaan    String?      @map("target_pelaksanaan")
  indikatorKeberhasilan String?     @map("indikator_keberhasilan")
  penanggungJawabId    String?      @map("penanggung_jawab_id")
  fotoCover            String?      @map("foto_cover")
  status               String       @default("rencana")
  urutan               Int          @default(0)
  createdAt            Int          @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt            Int          @default(dbgenerated("(unixepoch())")) @map("updated_at")

  departemen           MDepartemen  @relation(fields: [idDepartemen], references: [idDepartemen], onDelete: Cascade)
  periode              MPeriode     @relation(fields: [idPeriode], references: [idPeriode], onDelete: Cascade)
  penanggungJawab      MAnggota?    @relation("ProkerPenanggungJawab", fields: [penanggungJawabId], references: [idPerisai], onDelete: SetNull)

  @@map("T_Proker")
}

model TBerita {
  idBerita       Int          @id @default(autoincrement()) @map("id_berita")
  idDepartemen   Int?         @map("id_departemen")
  judul          String
  slug           String       @unique
  kategori       String       @default("berita")
  ringkasan      String?
  konten         String
  fotoCover      String?      @map("foto_cover")
  penulisId      String?      @map("penulis_id")
  status         String       @default("draft")
  tanggalPublish Int?         @map("tanggal_publish")
  isFeatured     Int          @default(0) @map("is_featured")
  views          Int          @default(0)
  createdAt      Int          @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt      Int          @default(dbgenerated("(unixepoch())")) @map("updated_at")

  departemen     MDepartemen? @relation(fields: [idDepartemen], references: [idDepartemen], onDelete: SetNull)
  penulis        MAnggota?    @relation("BeritaPenulis", fields: [penulisId], references: [idPerisai], onDelete: SetNull)

  @@map("T_Berita")
}

model TKompetisi {
  idKompetisi        Int          @id @default(autoincrement()) @map("id_kompetisi")
  idDepartemen       Int?         @map("id_departemen")
  namaKompetisi      String       @map("nama_kompetisi")
  slug               String       @unique
  kategori           String       @default("KTI")
  tingkat            String       @default("Nasional")
  penyelenggara      String
  deskripsi          String?
  deadlinePendaftaran Int?        @map("deadline_pendaftaran")
  tanggalPelaksanaan String?      @map("tanggal_pelaksanaan")
  linkPendaftaran    String?      @map("link_pendaftaran")
  linkPanduan        String?      @map("link_panduan")
  linkPoster         String?      @map("link_poster")
  status             String       @default("published")
  views              Int          @default(0)
  createdAt          Int          @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt          Int          @default(dbgenerated("(unixepoch())")) @map("updated_at")

  departemen         MDepartemen? @relation(fields: [idDepartemen], references: [idDepartemen], onDelete: SetNull)

  @@map("T_Kompetisi")
}

model TPrestasi {
  idPrestasi      Int       @id @default(autoincrement()) @map("id_prestasi")
  idPerisai       String    @map("id_perisai")
  namaKompetisi   String    @map("nama_kompetisi")
  judulKarya      String?   @map("judul_karya")
  kategori        String?
  tingkat         String    @default("Nasional")
  peringkat       String
  tahun           Int
  penyelenggara   String?
  anggotaTim      String?   @map("anggota_tim")
  fotoDokumentasi String?   @map("foto_dokumentasi")
  linkSertifikat  String?   @map("link_sertifikat")
  createdAt       Int       @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt       Int       @default(dbgenerated("(unixepoch())")) @map("updated_at")

  anggota         MAnggota  @relation(fields: [idPerisai], references: [idPerisai], onDelete: Cascade)

  @@map("T_Prestasi")
}

model TKeuangan {
  idTransaksi      Int       @id @default(autoincrement()) @map("id_transaksi")
  idPeriode        Int       @map("id_periode")
  jenisTransaksi   String    @map("jenis_transaksi")
  kategori         String    @default("Kas Bulanan")
  nominal          Float     @default(0)
  keterangan       String
  tanggalTransaksi String    @map("tanggal_transaksi")
  buktiNota        String?   @map("bukti_nota")
  dicatatOleh      String?   @map("dicatat_oleh")
  createdAt        Int       @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt        Int       @default(dbgenerated("(unixepoch())")) @map("updated_at")

  periode          MPeriode  @relation(fields: [idPeriode], references: [idPeriode], onDelete: Cascade)
  dicatatOlehUser  MAnggota? @relation("KeuanganDicatatOleh", fields: [dicatatOleh], references: [idPerisai], onDelete: SetNull)

  @@map("T_Keuangan")
}

model TGaleri {
  idGaleri        Int     @id @default(autoincrement()) @map("id_galeri")
  judul           String
  kategori        String  @default("Kegiatan")
  fotoUrl         String  @map("foto_url")
  deskripsi       String?
  tanggalKegiatan String? @map("tanggal_kegiatan")
  isFeatured      Int     @default(0) @map("is_featured")
  urutan          Int     @default(0)
  createdAt       Int     @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt       Int     @default(dbgenerated("(unixepoch())")) @map("updated_at")

  @@map("T_Galeri")
}

model TPesanMasuk {
  idPesan       Int     @id @default(autoincrement()) @map("id_pesan")
  namaPengirim  String  @map("nama_pengirim")
  email         String
  noWa          String? @map("no_wa")
  instansi      String?
  tujuan        String  @default("pertanyaan")
  subjek        String
  isiPesan      String  @map("isi_pesan")
  isRead        Int     @default(0) @map("is_read")
  dibalasPada   Int?    @map("dibalas_pada")
  dibalasOleh   String? @map("dibalas_oleh")
  ipAddress     String? @map("ip_address")
  createdAt     Int     @default(dbgenerated("(unixepoch())")) @map("created_at")

  @@map("T_Pesan_Masuk")
}

model TStatistik {
  idStatistik Int     @id @default(autoincrement()) @map("id_statistik")
  label       String
  nilai       String
  deskripsi   String?
  urutan      Int     @default(0)
  isActive    Int     @default(1) @map("is_active")
  createdAt   Int     @default(dbgenerated("(unixepoch())")) @map("created_at")
  updatedAt   Int     @default(dbgenerated("(unixepoch())")) @map("updated_at")

  @@map("T_Statistik")
}

model TPengaturan {
  kunci          String  @id
  nilai          String?
  tipe           String  @default("string")
  diperbaruiOleh String? @map("diperbarui_oleh")
  updatedAt      Int     @default(dbgenerated("(unixepoch())")) @map("updated_at")

  @@map("T_Pengaturan")
}

model TAuditLog {
  idLog     Int     @id @default(autoincrement()) @map("id_log")
  idAkun    Int?    @map("id_akun")
  aksi      String
  entitas   String
  idEntitas String? @map("id_entitas")
  dataLama  String? @map("data_lama")
  dataBaru  String? @map("data_baru")
  ipAddress String? @map("ip_address")
  userAgent String? @map("user_agent")
  createdAt Int     @default(dbgenerated("(unixepoch())")) @map("created_at")

  @@map("T_Audit_Log")
}

model TMedia {
  idMedia          String  @id @map("id_media")
  namaBerkas       String  @map("nama_berkas")
  kunciPenyimpanan String  @unique @map("kunci_penyimpanan")
  url              String
  tipeMime         String  @map("tipe_mime")
  ukuranByte       Int     @map("ukuran_byte")
  lebar            Int?
  tinggi           Int?
  altText          String? @map("alt_text")
  diunggahOleh     String? @map("diunggah_oleh")
  createdAt        Int     @default(dbgenerated("(unixepoch())")) @map("created_at")

  @@map("T_Media")
}
`;

const current = fs.readFileSync('prisma/schema.prisma', 'utf8');
if (!current.includes('model MFakultas')) {
  fs.writeFileSync('prisma/schema.prisma', current.trim() + '\n' + extraModels);
  console.log('✅ Successfully added all 21 models to prisma/schema.prisma');
} else {
  console.log('ℹ️ Models already present');
}
