import prisma from "../src/lib/db";

async function seedContent() {
  console.log("🌱 Menyiapkan seed data untuk T_Berita & T_Kompetisi...");
  const now = Math.floor(Date.now() / 1000);
  const oneDay = 86400;

  // 1. Tambahkan INSTEAD OF triggers untuk updatable views
  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER IF NOT EXISTS trg_web_posts_insert
    INSTEAD OF INSERT ON web_posts
    FOR EACH ROW
    BEGIN
      INSERT INTO T_Berita (
        id_departemen, judul, slug, kategori, ringkasan, konten, foto_cover, status, tanggal_publish, is_featured, created_at, updated_at
      ) VALUES (
        (SELECT id_departemen FROM M_Departemen WHERE slug = NEW.department_id LIMIT 1),
        NEW.title, NEW.slug, NEW.category, NEW.excerpt, NEW.content, NEW.cover_media_id, NEW.status, NEW.published_at, NEW.is_featured, NEW.created_at, NEW.updated_at
      );
    END;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER IF NOT EXISTS trg_web_opportunities_insert
    INSTEAD OF INSERT ON web_opportunities
    FOR EACH ROW
    BEGIN
      INSERT INTO T_Kompetisi (
        tipe, nama_kompetisi, slug, kategori, penyelenggara, deskripsi, deadline_pendaftaran, link_pendaftaran, link_poster, status, tanggal_publish, created_at, updated_at
      ) VALUES (
        NEW.type, NEW.title, NEW.slug, NEW.category, NEW.organizer, NEW.description, NEW.deadline_at, NEW.registration_url, NEW.poster_media_id, NEW.status, NEW.published_at, NEW.created_at, NEW.updated_at
      );
    END;
  `);

  console.log("✅ INSTEAD OF triggers berhasil diverifikasi.");

  // Dapatkan ID departemen
  const depts = (await prisma.$queryRawUnsafe(`SELECT id_departemen, slug FROM M_Departemen`)) as Array<{
    id_departemen: number;
    slug: string;
  }>;
  const deptMap: Record<string, number> = {};
  for (const d of depts) {
    deptMap[d.slug] = d.id_departemen;
  }

  // 2. Data Kegiatan / Posts
  const postsData = [
    {
      title: "Focus Group Discussion 2025: IPK Tinggi vs Kemampuan Berpikir Kritis",
      slug: "focus-group-discussion-2025-ipk-vs-berpikir-kritis",
      deptSlug: "penalaran",
      category: "Diskusi & Riset",
      isFeatured: 1,
      publishedAt: now - 2 * oneDay,
      excerpt: "Bedah mendalam mengenai korelasi prestasi akademik dengan ketajaman nalar saintifik mahasiswa bersama akademisi dan praktisi riset.",
      content: `<p class="lead">Apakah indeks prestasi kumulatif (IPK) yang tinggi selalu berbanding lurus dengan ketajaman berpikir kritis dan kapabilitas memecahkan persoalan kompleks? Pertanyaan mendasar inilah yang menjadi episentrum diskusi ilmiah dalam <strong>Focus Group Discussion (FGD) 2025</strong> yang diinisiasi oleh Bidang Penalaran dan Keilmuan UKM PERISAI UMI.</p>
      
      <h3>Dialektika Mahasiswa di Era Eksplorasi Pengetahuan</h3>
      <p>Acara yang diselenggarakan di Aula Fakultas Teknologi Industri UMI ini menghadirkan puluhan fungsionaris, akademisi, dan mahasiswa lintas program studi. Dalam sambutan pembukanya, Ketua Umum UKM PERISAI UMI menegaskan bahwa nilai di atas kertas hanyalah salah satu indikator evaluasi formatif. Kekuatan sejati seorang akademisi terletak pada kemampuannya merekonstruksi argumen, menguji hipotesis secara empiris, serta menghasilkan solusi bernilai tambah bagi masyarakat.</p>

      <blockquote>"Mahasiswa berprestasi bukan sekadar penghafal buku teks, melainkan penjelajah gagasan yang berani mempertanyakan asumsi dan melahirkan inovasi baru." — Fungsionaris Divisi Penalaran</blockquote>

      <h3>Tiga Pilar Evaluasi Ilmiah</h3>
      <ul>
        <li><strong>Kedalaman Epistemologis:</strong> Mendorong mahasiswa memahami dasar filosofis dari setiap ilmu yang dipelajari, bukan sekadar hafalan formula.</li>
        <li><strong>Keterampilan Sintesis Solutif:</strong> Melatih kemampuan mengintegrasikan literatur saintifik dengan problem kontekstual di masyarakat.</li>
        <li><strong>Integritas dan Etika Riset:</strong> Menjunjung tinggi kejujuran ilmiah, pencegahan fabrikasi data, dan penghargaan hak kekayaan intelektual.</li>
      </ul>

      <p>FGD ditutup dengan perumusan manifesto pembelajaran aktif yang akan diintegrasikan ke dalam program inkubasi karya tulis ilmiah UKM PERISAI UMI sepanjang tahun kepengurusan 2025/2026.</p>`,
      coverMediaId: "/og-default.jpg",
    },
    {
      title: "PERISAI Humanity: Restorasi Ekosistem Pesisir & Tanam 1.000 Mangrove",
      slug: "perisai-humanity-konservasi-pesisir-mangrove",
      deptSlug: "humas",
      category: "Pengabdian Masyarakat",
      isFeatured: 1,
      publishedAt: now - 5 * oneDay,
      excerpt: "Wujud kontribusi nyata fungsionaris PERISAI UMI dalam melestarikan sabuk hijau pesisir Sulawesi Selatan untuk mitigasi bencana abrasi.",
      content: `<p class="lead">Sebagai perwujudan Tri Dharma Perguruan Tinggi pilar pengabdian masyarakat, UKM PERISAI UMI menyelenggarakan program aksi lingkungan bertajuk <strong>PERISAI Humanity: Satu Mangrove, Seribu Manfaat</strong> di kawasan pesisir Maros - Makassar.</p>

      <h3>Mitigasi Perubahan Iklim Berbasis Saintifik</h3>
      <p>Tidak hanya sekadar menanam, kegiatan ini diawali dengan survei ekologi tanah dan pemilihan varietas <em>Rhizophora mucronata</em> yang memiliki daya adaptasi tinggi terhadap salinitas lokal. Tim riset lingkungan UKM PERISAI mendokumentasikan koordinat geospasial serta baseline karbon biru (blue carbon) untuk dipantau secara periodik.</p>

      <h3>Keterlibatan Masyarakat Pesisir</h3>
      <p>Aksi ini melibatkan kelompok nelayan setempat dan puluhan relawan mahasiswa UMI. Edukasi mengenai pentingnya sabuk mangrove sebagai benteng alami pemecah ombak dan habitat biota laut bernilai ekonomis disampaikan secara interaktif oleh fungsionaris Bidang Hubungan Masyarakat.</p>`,
      coverMediaId: "/og-default.jpg",
    },
    {
      title: "Delegasi PERISAI UMI Raih Medali Emas di LKTIN National Research Festival 2025",
      slug: "delegasi-perisai-raih-medali-emas-lktin-2025",
      deptSlug: "kompres",
      category: "Prestasi & Kejuaraan",
      isFeatured: 1,
      publishedAt: now - 9 * oneDay,
      excerpt: "Karya inovasi teknologi penjernih air limbah industri berbasis membran selulosa bakteri berhasil mengantarkan tim UMI menjuarai kompetisi tingkat nasional.",
      content: `<p class="lead">Prestasi membanggakan kembali dipersembahkan oleh fungsionaris UKM PERISAI UMI di kancah nasional. Tim delegasi riset berhasil menyabet <strong>Juara 1 (Medali Emas)</strong> dan penghargaan <em>Best Presentation</em> pada ajang National Scientific Research Festival 2025.</p>

      <h3>Inovasi Membran Hijau Berkelanjutan</h3>
      <p>Riset yang dibawakan mengusung judul implementasi nanokomposit selulosa bakterial dari limbah kulit nanas sebagai adsorben logam berat pada limbah cair industri tekstil. Prototipe ini dinilai dewan juri sangat aplikatif, hemat energi, dan ramah lingkungan.</p>

      <p>Ketua tim menyampaikan bahwa pencapaian ini merupakan buah dari pembinaan intensif di internal PERISAI UMI melalui bimbingan dosen pembina dan klinik uji karya ilmiah lintas divisi.</p>`,
      coverMediaId: "/og-default.jpg",
    },
    {
      title: "Bootcamp Penulisan Proposal Riset & Metodologi KTI Mahasiswa 2025",
      slug: "bootcamp-penulisan-proposal-riset-kti-2025",
      deptSlug: "ristek",
      category: "Pelatihan & KTI",
      isFeatured: 0,
      publishedAt: now - 14 * oneDay,
      excerpt: "Pelatihan intensif metodologi saintifik, perumusan rumusan masalah berkualitas, dan teknik sitasi referensi menggunakan Mendeley & Zotero.",
      content: `<p class="lead">Departemen Riset dan Teknologi menyelenggarakan Bootcamp Karya Tulis Ilmiah (KTI) yang ditujukan bagi fungsionaris muda dan mahasiswa UMI yang berminat mendalami dunia riset saintifik.</p>
      
      <p>Materi yang dibahas meliputi tahapan identifikasi celah riset (research gap), formulasi hipotesis yang teruji, penggunaan perangkat lunak bibliografi seperti Mendeley dan Zotero, serta pemahaman mendalam tentang standar sitasi IEEE dan APA edisi ke-7.</p>`,
      coverMediaId: "/og-default.jpg",
    },
    {
      title: "Kunjungan Studi Saintifik & Benchmarking ke BRIDA Sulawesi Selatan",
      slug: "kunjungan-studi-benchmarking-brida-sulsel",
      deptSlug: "humas",
      category: "Riset & Kolaborasi",
      isFeatured: 0,
      publishedAt: now - 20 * oneDay,
      excerpt: "Membangun sinergi hilirisasi riset mahasiswa dengan kebijakan pembangunan daerah bersama Badan Riset dan Inovasi Daerah.",
      content: `<p class="lead">Dalam rangka memperluas horizon implementasi riset, pengurus UKM PERISAI UMI melakukan kunjungan resmi ke kantor Badan Riset dan Inovasi Daerah (BRIDA) Provinsi Sulawesi Selatan.</p>

      <p>Pertemuan ini membahas peluang kolaborasi data, fasilitasi uji laboratorium pemerintah untuk prototipe mahasiswa, serta sinkronisasi tema riset mahasiswa dengan isu strategis ketahanan pangan dan energi terbarukan di kawasan Indonesia Timur.</p>`,
      coverMediaId: "/og-default.jpg",
    },
    {
      title: "Rapat Kerja & Upgrading Fungsionaris Generasi XI UKM PERISAI UMI",
      slug: "upgrading-dan-raker-generasi-xi-2025",
      deptSlug: "psdm",
      category: "Agenda Internal",
      isFeatured: 0,
      publishedAt: now - 28 * oneDay,
      excerpt: "Konsolidasi visi kepengurusan Generasi XI dalam mengokohkan PERISAI UMI sebagai episentrum budaya ilmiah mahasiswa berakhlak mulia.",
      content: `<p class="lead">Rapat Kerja (Raker) dan Upgrading Kepengurusan Generasi XI sukses diselenggarakan dengan suasana hangat dan penuh semangat kebersamaan intelektual.</p>

      <p>Melalui musyawarah kerja ini, disahkan seluruh kalender program kerja tahun 2025/2026 yang mengedepankan efektivitas, peningkatan kuantitas publikasi ilmiah mahasiswa, serta pendampingan kontingen UMI menuju PIMNAS ke-38.</p>`,
      coverMediaId: "/og-default.jpg",
    },
    {
      title: "Coaching Clinic PKM 8 Bidang: Bedah Kiat Lolos Pendanaan Belmawa",
      slug: "coaching-clinic-pkm-8-bidang-belmawa-2025",
      deptSlug: "kompres",
      category: "Pelatihan & KTI",
      isFeatured: 0,
      publishedAt: now - 35 * oneDay,
      excerpt: "Reviewer nasional membedah strategi penulisan proposal PKM-RE, PKM-K, PKM-PM, PKM-PI, dan PKM-KC agar tembus pendanaan Dikti.",
      content: `<p class="lead">Program Kreativitas Mahasiswa (PKM) merupakan barometer prestasi ilmiah perguruan tinggi di Indonesia. Untuk memaksimalkan peluang lolos, Divisi Kompetisi dan Prestasi mengadakan Coaching Clinic khusus.</p>

      <p>Ratusan proposal mahasiswa UMI dikurasi secara ketat dari aspek kesesuaian format panduan Belmawa, kebaruan ide (novelty), metodologi pelaksanaan, hingga kelayakan anggaran biaya (RAB).</p>`,
      coverMediaId: "/og-default.jpg",
    },
    {
      title: "Inisiasi Riset Multidisiplin Biosensor Ramah Lingkungan Bersama FTI & FK UMI",
      slug: "kolaborasi-riset-multidisiplin-biosensor-2025",
      deptSlug: "ristek",
      category: "Riset & Inovasi",
      isFeatured: 0,
      publishedAt: now - 42 * oneDay,
      excerpt: "Kolaborasi antara fungsionaris fakultas kedokteran dan teknik dalam merancang instrumen deteksi dini glukosa darah non-invasif.",
      content: `<p class="lead">Menjawab tantangan revolusi kesehatan digital, kolaborasi riset lintas fakultas diinisiasi oleh Bidang Riset dan Teknologi UKM PERISAI UMI.</p>

      <p>Proyek ini mengintegrasikan ilmu rekayasa elektronika dengan sains biomedis guna menghasilkan sensor diagnostik yang presisi namun terjangkau bagi masyarakat di wilayah 3T.</p>`,
      coverMediaId: "/og-default.jpg",
    },
    {
      title: "Seminar Nasional Hilirisasi Riset & Paten Inovasi Mahasiswa 2025",
      slug: "seminar-nasional-hilirisasi-riset-paten-2025",
      deptSlug: "penalaran",
      category: "Diskusi & Riset",
      isFeatured: 0,
      publishedAt: now - 48 * oneDay,
      excerpt: "Mendorong konversi luaran riset mahasiswa UMI menjadi paten terdaftar dan produk komersial yang berdaya saing.",
      content: `<p class="lead">UKM PERISAI UMI menggelar seminar nasional bertajuk akselerasi hilirisasi inovasi saintifik mahasiswa menuju perlindungan kekayaan intelektual (KI).</p><p>Hadir narasumber dari Direktorat Jenderal Kekayaan Intelektual (DJKI) yang membimbing peserta secara komprehensif dalam penyusunan spesifikasi paten sederhana dan hak cipta karya inovasi.</p>`,
      coverMediaId: "/og-default.jpg",
    },
    {
      title: "Workshop Public Speaking & Teknik Presentasi Sidang Ilmiah",
      slug: "workshop-public-speaking-sidang-ilmiah-2025",
      deptSlug: "psdm",
      category: "Pelatihan & KTI",
      isFeatured: 0,
      publishedAt: now - 55 * oneDay,
      excerpt: "Pembekalan retorika akademik, visualisasi data slide ilmiah, dan penguasaan panggung tanya-jawab dewan juri.",
      content: `<p class="lead">Kemampuan menyampaikan gagasan ilmiah secara artikulatif dan meyakinkan adalah kunci kemenangan dalam setiap kompetisi riset.</p><p>Melalui workshop intensif ini, para delegasi PERISAI dilatih teknik intonasi, body language, serta strategi menjawab sanggahan dewan juri secara elegan dan berbasis data.</p>`,
      coverMediaId: "/og-default.jpg",
    },
    {
      title: "Penyuluhan Mitigasi Bencana Berbasis Teknologi Komunitas di Pangkep",
      slug: "penyuluhan-mitigasi-bencana-komunitas-pangkep",
      deptSlug: "humas",
      category: "Pengabdian Masyarakat",
      isFeatured: 0,
      publishedAt: now - 62 * oneDay,
      excerpt: "Penerapan sistem peringatan dini banjir sederhana berbasis sensor ultrasonik bagi warga bantaran sungai di Kabupaten Pangkep.",
      content: `<p class="lead">Tim pengabdian UKM PERISAI UMI mengedukasi warga pesisir mengenai mitigasi bencana hidrometeorologi dan instalasi sensor debit air berbasis IoT.</p><p>Masyarakat setempat mengapresiasi solusi praktis mahasiswa yang mampu memberikan peringatan dini sirine otomatis saat debit air sungai melewati batas aman.</p>`,
      coverMediaId: "/og-default.jpg",
    },
    {
      title: "Medali Perak Lomba Karya Tulis Ilmiah Al-Qur'an (KTIA) Nasional 2025",
      slug: "medali-perak-ktia-nasional-2025",
      deptSlug: "kompres",
      category: "Prestasi & Kejuaraan",
      isFeatured: 0,
      publishedAt: now - 70 * oneDay,
      excerpt: "Integrasi nilai-nilai sains modern dan perspektif Al-Qur'an dalam tata kelola sumber daya air bersih antarkan tim raih Juara 2.",
      content: `<p class="lead">Prestasi membanggakan kembali diraih delegasi UKM PERISAI UMI dalam ajang Musabaqah Tilawatil Qur'an Mahasiswa Nasional cabang Karya Tulis Ilmiah Al-Qur'an (KTIA).</p><p>Karya berjudul konservasi sumber daya air berbasis tadabbur ayat-ayat kauniyah sukses menarik perhatian dewan juri berkat integrasi harmonis antara dalil naqli dan telaah sains empiris.</p>`,
      coverMediaId: "/og-default.jpg",
    },
    {
      title: "Kelas Literasi Data & Pengolahan Statistik Riset dengan R & Python",
      slug: "kelas-literasi-data-statistik-r-python-2025",
      deptSlug: "ristek",
      category: "Pelatihan & KTI",
      isFeatured: 0,
      publishedAt: now - 78 * oneDay,
      excerpt: "Pelatihan komputasi statistik, visualisasi grafik saintifik, dan pengujian hipotesis regresi bagi peneliti pemula.",
      content: `<p class="lead">Di era big data, peneliti dituntut mampu mengolah dataset mentah secara mandiri dan akurat tanpa terjebak bias interpretasi.</p><p>Departemen Riset memfasilitasi kelas komputasi intensif menggunakan bahasa pemrograman R dan pustaka Python Pandas-Seaborn untuk mempermudah analisis data skripsi dan riset PKM.</p>`,
      coverMediaId: "/og-default.jpg",
    },
    {
      title: "Studi Ekskursi Laboratorium Terpadu & Inkubasi Bisnis Inovatif UMI",
      slug: "studi-ekskursi-laboratorium-terpadu-umi",
      deptSlug: "media",
      category: "Agenda Internal",
      isFeatured: 0,
      publishedAt: now - 85 * oneDay,
      excerpt: "Kunjungan pengenalan fasilitas instrumen spektroskopi dan sentra inkubasi startup riset di lingkungan kampus UMI.",
      content: `<p class="lead">Guna memperkenalkan infrastruktur penelitian kampus, puluhan fungsionaris baru diajak mengunjungi Laboratorium Sentral Terpadu UMI.</p><p>Peserta mempelajari tata cara pengajuan izin penggunaan instrumen Scanning Electron Microscope (SEM), HPLC, serta alur pendaftaran produk riset ke inkubator bisnis kampus.</p>`,
      coverMediaId: "/og-default.jpg",
    },
  ];

  for (const post of postsData) {
    const deptId = deptMap[post.deptSlug] || 1;
    const existing = await prisma.$queryRawUnsafe(
      `SELECT id_berita FROM T_Berita WHERE slug = ?`,
      post.slug
    ) as Array<{ id_berita: number }>;

    if (existing.length === 0) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO T_Berita (id_departemen, judul, slug, kategori, ringkasan, konten, foto_cover, status, tanggal_publish, is_featured, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?)`,
        deptId,
        post.title,
        post.slug,
        post.category,
        post.excerpt,
        post.content,
        post.coverMediaId,
        post.publishedAt,
        post.isFeatured,
        post.publishedAt,
        now
      );
      console.log(`✅ Post dimasukkan ke T_Berita: ${post.title}`);
    } else {
      console.log(`ℹ️ Post sudah ada: ${post.slug}`);
    }
  }

  // 3. Data Kompetisi & Peluang
  const oppsData = [
    {
      title: "Program Kreativitas Mahasiswa (PKM) 8 Bidang 2025",
      slug: "pkm-8-bidang-kemendikbudristek-2025",
      type: "lomba",
      category: "RISET & INOVASI",
      tingkat: "Nasional",
      organizer: "Ditjen Diktiristek & Belmawa RI",
      deadlineAt: now + 24 * oneDay,
      registrationUrl: "https://simbelmawa.kemdikbud.go.id",
      posterMediaId: "/og-default.jpg",
      description: `<h3>Ajang Bergengsi Prestasi Ilmiah Mahasiswa Indonesia</h3>
      <p>Program Kreativitas Mahasiswa (PKM) merupakan skema pendanaan tahunan resmi dari Direktorat Jenderal Pendidikan Tinggi, Riset, dan Teknologi untuk menumbuhkembangkan inovasi saintifik mahasiswa di seluruh Indonesia.</p>

      <h4>Skema Bidang yang Dibuka:</h4>
      <ul>
        <li><strong>PKM-RE (Riset Eksakta):</strong> Eksplorasi sains, bioteknologi, rekayasa material, dan komputasi.</li>
        <li><strong>PKM-RSH (Riset Sosial Humaniora):</strong> Studi sosial, budaya, kebijakan publik, dan perilaku manusia.</li>
        <li><strong>PKM-K (Kewirausahaan):</strong> Pengembangan produk usaha kreatif dan solutif berbasis komoditas.</li>
        <li><strong>PKM-PM (Pengabdian Masyarakat):</strong> Penerapan Iptek untuk mitra masyarakat non-profit.</li>
        <li><strong>PKM-PI (Penerapan Iptek):</strong> Solusi teknologi untuk mitra industri kecil dan menengah (UMKM).</li>
        <li><strong>PKM-KC (Karsa Cipta):</strong> Pembuatan prototipe sistem fungsional berbasis rekayasa modern.</li>
        <li><strong>PKM-KI (Karya Inovatif):</strong> Produk inovatif siap pakai skala komersial berorientasi paten.</li>
        <li><strong>PKM-VGK (Video Gagasan Konstruktif):</strong> Solusi isu futuristik dalam bentuk visual sinematik.</li>
      </ul>

      <h4>Manfaat & Insentif:</h4>
      <p>Pendanaan riset Rp 6.000.000 s.d Rp 10.000.000 per proposal yang lolos, pendampingan kontingen kampus, konversi SKS mata kuliah (MBKM), dan tiket menuju ajang bergengsi <strong>PIMNAS ke-38</strong>.</p>`,
    },
    {
      title: "PIMNAS 38: Pekan Ilmiah Mahasiswa Nasional",
      slug: "pimnas-38-pekan-ilmiah-nasional-2025",
      type: "lomba",
      category: "KOMPETISI ILMIAH",
      tingkat: "Nasional",
      organizer: "Puspresnas Kemendikbudristek RI",
      deadlineAt: now + 45 * oneDay,
      registrationUrl: "https://pusatprestasinasional.kemdikbud.go.id",
      posterMediaId: "/og-default.jpg",
      description: `<h3>Puncak Kulminasi Talenta Peneliti Muda Kampus</h3>
      <p>Pekan Ilmiah Mahasiswa Nasional (PIMNAS) adalah panggung puncak kompetisi ilmiah mahasiswa tingkat nasional terbesar di Tanah Air. Ajang ini mempertemukan delegasi terbaik dari seluruh perguruan tinggi negeri maupun swasta yang telah lolos penilaian kemajuan riset PKM.</p>

      <h4>Kategori Penghargaan:</h4>
      <ul>
        <li>Medali Emas, Perak, Perunggu Kategori Presentasi Ilmiah</li>
        <li>Medali Emas, Perak, Perunggu Kategori Poster & Expo Riset</li>
        <li>Piala Bergilir Juara Umum Adhidaya Kertawidya</li>
        <li>Penghargaan Mahasiswa Bertalenta Terbaik</li>
      </ul>`,
    },
    {
      title: "PERISAI National Research Fair & LKTIN 2025",
      slug: "perisai-national-research-fair-lktin-2025",
      type: "lomba",
      category: "KARYA TULIS ILMIAH",
      tingkat: "Nasional",
      organizer: "UKM PERISAI UMI Makassar",
      deadlineAt: now + 18 * oneDay,
      registrationUrl: "https://perisai-umi.org/lktin-2025",
      posterMediaId: "/og-default.jpg",
      description: `<h3>Kompetisi Karya Tulis Ilmiah Nasional Tingkat Mahasiswa</h3>
      <p>UKM PERISAI UMI mengundang mahasiswa berprestasi dari seluruh penjuru Indonesia untuk berpartisipasi dalam <strong>LKTIN Research Fair 2025</strong> dengan tema sentral: <em>"Akselerasi Inovasi Berbasis Kearifan Lokal Menuju Indonesia Emas 2045"</em>.</p>

      <h4>Sub-Tema Lomba:</h4>
      <ul>
        <li>Energi Baru Terbarukan & Keberlanjutan Lingkungan</li>
        <li>Teknologi Cerdas & Transformasi Digital Industri 5.0</li>
        <li>Kesehatan, Bioteknologi & Ketahanan Pangan Nasional</li>
        <li>Ekonomi Inklusif & Pemberdayaan Masyarakat Pesisir</li>
      </ul>

      <h4>Total Hadiah:</h4>
      <p>Total hadiah uang tunai puluhan juta rupiah, piala bergilir Rektor UMI, sertifikat nasional ber-SK, serta publikasi karya terpilih di jurnal ilmiah terindeks SINTA.</p>`,
    },
    {
      title: "Innovillage 2025: Social Project & Digital Village Solution",
      slug: "innovillage-2025-social-project-telkom",
      type: "hibah",
      category: "PENGABDIAN & TEKNOLOGI",
      tingkat: "Nasional",
      organizer: "PT Telkom Indonesia & Kemendikbudristek",
      deadlineAt: now + 12 * oneDay,
      registrationUrl: "https://innovillage.id",
      posterMediaId: "/og-default.jpg",
      description: `<h3>Kompetisi Inovasi Sosial Digital untuk Negeri</h3>
      <p>Innovillage adalah program kompetisi socio-project tahunan yang menantang mahasiswa perguruan tinggi di seluruh Indonesia untuk melahirkan solusi digital aplikatif bagi persoalan riil masyarakat di desa.</p>

      <h4>Pendanaan & Dukungan:</h4>
      <p>Setiap proyek yang terpilih masuk dalam TOP 150 akan mendapatkan dana implementasi langsung hingga Rp 25.000.000 serta bimbingan intensif dari mentor industri PT Telkom Indonesia.</p>`,
    },
    {
      title: "Beasiswa Unggulan Kemendikbudristek Jenjang S1 Prestasi",
      slug: "beasiswa-unggulan-kemendikbudristek-2025",
      type: "beasiswa",
      category: "BEASISWA PENDIDIKAN",
      tingkat: "Nasional",
      organizer: "Puslapdik Kemendikbudristek",
      deadlineAt: now + 30 * oneDay,
      registrationUrl: "https://beasiswaunggulan.kemdikbud.go.id",
      posterMediaId: "/og-default.jpg",
      description: `<h3>Bantuan Biaya Pendidikan Penuh bagi Mahasiswa Berprestasi</h3>
      <p>Beasiswa Unggulan Masyarakat Berprestasi merupakan beasiswa berkelas dari Kemendikbudristek yang ditujukan bagi insan muda dengan rekam jejak prestasi kejuaraan minimal tingkat nasional atau talenta riset luar biasa.</p>

      <h4>Cakupan Beasiswa:</h4>
      <ul>
        <li>Biaya UKT / SPP Penuh hingga semester 8</li>
        <li>Uang saku bulanan (Living Allowance)</li>
        <li>Biaya buku dan referensi ilmiah tahunan</li>
        <li>Jejaring alumni penerima beasiswa seluruh Indonesia</li>
      </ul>`,
    },
    {
      title: "Djarum Beasiswa Plus: Leadership Development 2025",
      slug: "djarum-beasiswa-plus-2025",
      type: "beasiswa",
      category: "BEASISWA & LEADERSHIP",
      tingkat: "Nasional",
      organizer: "Djarum Foundation",
      deadlineAt: now + 8 * oneDay,
      registrationUrl: "https://djarumbeasiswaplus.org",
      posterMediaId: "/og-default.jpg",
      description: `<h3>Beasiswa Kepemimpinan & Soft Skills Berkualitas</h3>
      <p>Djarum Beasiswa Plus memberikan lebih dari sekadar dana pendidikan. Beswan Djarum mendapatkan pelatihan soft skills komprehensif yang dirancang untuk membentuk calon pemimpin tangguh masa depan Indonesia.</p>

      <h4>Program Pelatihan Eksklusif:</h4>
      <ul>
        <li>Character Building & Outward Bound Camp</li>
        <li>Leadership Development & Critical Thinking Training</li>
        <li>Competition Writing & International Exposure</li>
        <li>Community Empowerment Project</li>
      </ul>`,
    },
    {
      title: "KIBM 2025: Akselerasi Startup Mahasiswa Berbasis Riset",
      slug: "kibm-akselerasi-startup-riset-2025",
      type: "hibah",
      category: "STARTUP & BISNIS",
      tingkat: "Nasional",
      organizer: "Balai Pengembangan Talenta Indonesia (BPTI)",
      deadlineAt: now + 21 * oneDay,
      registrationUrl: "https://kibm.kemdikbud.go.id",
      posterMediaId: "/og-default.jpg",
      description: `<h3>Inkubasi Bisnis dan Komersialisasi Karya Inovasi</h3>
      <p>Kompetisi Inovasi Bisnis Mahasiswa (KIBM) memberikan pendanaan awal (seed funding) dan mentoring inkubasi bagi tim mahasiswa yang memiliki produk inovasi berbasis riset siap uji pasar.</p>`,
    },
    {
      title: "Call for Papers: International Conference on Multidisciplinary Research (ICMR) 2025",
      slug: "call-for-papers-icmr-umi-2025",
      type: "seminar",
      category: "KONFERENSI INTERNASIONAL",
      tingkat: "Internasional",
      organizer: "Universitas Muslim Indonesia",
      deadlineAt: now + 38 * oneDay,
      registrationUrl: "https://icmr.umi.ac.id",
      description: `<h3>Diseminasi Karya Ilmiah pada Konferensi Internasional Terindeks</h3>
      <p>Kesempatan emas bagi mahasiswa dan dosen muda untuk mempresentasikan artikel ilmiah di forum akademik internasional yang diselenggarakan oleh UMI bekerjasama dengan universitas mitra di Asia dan Eropa.</p>`,
    },
    {
      title: "LKTIN Maritim & Kemaritiman Nusantara 2025",
      slug: "lktin-kemaritiman-nusantara-2025",
      type: "lomba",
      category: "KARYA TULIS ILMIAH",
      tingkat: "Nasional",
      organizer: "Universitas Hasanuddin & KKP RI",
      deadlineAt: now + 16 * oneDay,
      registrationUrl: "https://maritim.unhas.ac.id/lktin",
      posterMediaId: "/og-default.jpg",
      description: `<h3>Kompetisi Gagasan Ilmiah Pengembangan Potensi Laut & Pesisir</h3>
      <p>Kompetisi Karya Tulis Ilmiah Nasional bidang kelautan, konservasi biota laut, dan teknologi perikanan berkelanjutan untuk mendukung ekonomi biru Indonesia.</p>`,
    },
    {
      title: "Beasiswa Riset Talenta Muda BRIN 2025",
      slug: "beasiswa-riset-talenta-brin-2025",
      type: "beasiswa",
      category: "RISET & INOVASI",
      tingkat: "Nasional",
      organizer: "Badan Riset dan Inovasi Nasional (BRIN)",
      deadlineAt: now + 28 * oneDay,
      registrationUrl: "https://beasiswa.brin.go.id",
      posterMediaId: "/og-default.jpg",
      description: `<h3>Dukungan Biaya Riset & Pembimbingan Peneliti Ahli BRIN</h3>
      <p>Skema bantuan dana tugas akhir dan skripsi berbasis laboratorium riset mutakhir BRIN dengan akses fasilitas riset bertaraf global.</p>`,
    },
    {
      title: "PKM Gagasan Futuristik Tertulis (PKM-GFT) & VGK 2025",
      slug: "pkm-gft-vgk-belmawa-2025",
      type: "lomba",
      category: "INISIATIF FUTURISTIK",
      tingkat: "Nasional",
      organizer: "Ditjen Diktiristek & Belmawa RI",
      deadlineAt: now + 35 * oneDay,
      registrationUrl: "https://simbelmawa.kemdikbud.go.id",
      posterMediaId: "/og-default.jpg",
      description: `<h3>Eksplorasi Ide Solutif Jangka Panjang Menuju Visi Masa Depan</h3>
      <p>Wadah gagasan visioner mahasiswa berupa naskah ilmiah futuristik dan video gagasan konstruktif yang responsif terhadap Sustainable Development Goals (SDGs).</p>`,
    },
    {
      title: "Hibah Matching Fund Kedaireka Kampus Merdeka 2025",
      slug: "hibah-matching-fund-kedaireka-2025",
      type: "hibah",
      category: "KOLABORASI INDUSTRI",
      tingkat: "Nasional",
      organizer: "Ditjen Diktiristek RI",
      deadlineAt: now + 40 * oneDay,
      registrationUrl: "https://kedaireka.id",
      posterMediaId: "/og-default.jpg",
      description: `<h3>Akselerasi Kemitraan Strategis Riset Kampus dan Dunia Usaha</h3>
      <p>Program pendanaan kolaborasi inovasi antara perguruan tinggi dengan dunia usaha dan industri (DUDI) untuk hilirisasi produk saintifik bernilai komersial tinggi.</p>`,
    },
  ];

  for (const opp of oppsData) {
    const existing = await prisma.$queryRawUnsafe(
      `SELECT id_kompetisi FROM T_Kompetisi WHERE slug = ?`,
      opp.slug
    ) as Array<{ id_kompetisi: number }>;

    if (existing.length === 0) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO T_Kompetisi (
          tipe, nama_kompetisi, slug, kategori, tingkat, penyelenggara, deskripsi,
          deadline_pendaftaran, link_pendaftaran, link_poster, status, tanggal_publish, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?)`,
        opp.type,
        opp.title,
        opp.slug,
        opp.category,
        opp.tingkat,
        opp.organizer,
        opp.description,
        opp.deadlineAt,
        opp.registrationUrl,
        opp.posterMediaId,
        now,
        now,
        now
      );
      console.log(`✅ Kompetisi dimasukkan ke T_Kompetisi: ${opp.title}`);
    } else {
      console.log(`ℹ️ Kompetisi sudah ada: ${opp.slug}`);
    }
  }

  // Verifikasi via view
  const postsCount = await prisma.post.count();
  const oppsCount = await prisma.opportunity.count();
  console.log(`🎉 SUKSES! web_posts count: ${postsCount}, web_opportunities count: ${oppsCount}`);
}

seedContent()
  .catch((e) => {
    console.error("❌ Error seeding content:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
