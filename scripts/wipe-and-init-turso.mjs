import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Load environment variables dari .env.local atau .env jika ada
if (fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^['"]|['"]$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error("❌ Kesalahan: TURSO_DATABASE_URL dan TURSO_AUTH_TOKEN wajib diatur di .env.local atau environment variables.");
  process.exit(1);
}

console.log("==================================================================");
console.log("🧹 TURSO TOTAL WIPE & CLEAN DATABASE INITIALIZATION");
console.log(`📡 Target: ${TURSO_URL}`);
console.log("==================================================================");

const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

const rawMembers = [
  { "ID PERISAI":"PRN0238", "Generasi":10, "Tugas dan Tanggung Jawab":"Ketua Umum", "NamaLengkap":"Aisyah Ramadhani Muchlis", "Tempat, Tanggal Lahir":"Wamena, 02 Oktober 2004 ", "Fakultas":"FEB", "Program Studi/Jurusan":"Manajemen", "NIM/Stambuk":"2220230181", "Angkatan":2023, "Email":"aisyahramadhani.m@gmail.com ", "No. Telepon/WA":"6281244899985", "Alamat":"BTP Blok G Baru ", "Linkedn":"linkedin.com/in/aisyahmuchlis", "Instagram":"instagram.com/aisyahmuchliis", "Hobi":"Organizing " },
  { "ID PERISAI":"PRN0241", "Generasi":10, "Tugas dan Tanggung Jawab":"Sekretaris Umum", "NamaLengkap":"Baiq Indar Pirayati", "Tempat, Tanggal Lahir":"Tammarunang, 17 Maret 2005", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120230025", "Angkatan":2023, "Email":"baiqindarp@gmail.com", "No. Telepon/WA":"6281243953198", "Alamat":"Pampang", "Linkedn":"linkedin.com/in/baiq-indar-p", "Instagram":"instagram.com/_baiqindar", "Hobi":"Menonton, membaca" },
  { "ID PERISAI":"PRN0250", "Generasi":10, "Tugas dan Tanggung Jawab":"Bendahara Umum", "NamaLengkap":"Muhammad Aidhil Aksan", "Tempat, Tanggal Lahir":"Tarakan, 18 Juli 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230308", "Angkatan":2023, "Email":"aidilaksan0909@gmail.com", "No. Telepon/WA":"6285349500696", "Alamat":"Jl. Perkebunan Makassar", "Linkedn":"linkedin.com/in/muhammad-aidhil-aksan", "Instagram":"instagram.com/nomathnolifee", "Hobi":"Futsal, basket" },
  { "ID PERISAI":"PRN0252", "Generasi":10, "Tugas dan Tanggung Jawab":"Kepala Departemen PSDM", "NamaLengkap":"Muhammad Rafli", "Tempat, Tanggal Lahir":"Gura, 06 Desember 2002", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230290", "Angkatan":2023, "Email":"raflyofficial6122@gmail.com", "No. Telepon/WA":"6282246641848", "Alamat":"Moncongloe Bulu, Kec. Moncong Loe, Kab. Maros", "Linkedn":null, "Instagram":"instagram.com/appy_6122", "Hobi":"Futsal" },
  { "ID PERISAI":"PRN0290", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli PSDM", "NamaLengkap":"Surya Putra Jie", "Tempat, Tanggal Lahir":"Motewe, 08 Agustus 2005", "Fakultas":"FP-BIOTAM", "Program Studi/Jurusan":"Agribisnis", "NIM/Stambuk":"8320240023", "Angkatan":2024, "Email":"suryaputrajie123@gmail.com", "No. Telepon/WA":"6287847710655", "Alamat":"Jl. Sukaria 13C", "Linkedn":null, "Instagram":"instagram.com/suryaputra_j01", "Hobi":"Membaca, memasak, menyanyi, traveling" },
  { "ID PERISAI":"PRN0291", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli PSDM", "NamaLengkap":"Wa Ode Aqilah", "Tempat, Tanggal Lahir":"Bau-Bau, 07 Oktober 2006", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120240069", "Angkatan":2024, "Email":"aqilahwaode07@gmail.com", "No. Telepon/WA":"6281356547094", "Alamat":"Makassar,Abdesir, Toa daeng III, Jln Mawar ", "Linkedn":"linkedin.com/in/wa-ode-aqilah", "Instagram":"instagram.com/aqil.ah0710", "Hobi":"Nonton" },
  { "ID PERISAI":"PRN0274", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli PSDM", "NamaLengkap":"Asmalinda Azis", "Tempat, Tanggal Lahir":"Makassar, 22 Juni 2006", "Fakultas":"FSIKP", "Program Studi/Jurusan":"Ilmu Komunikasi", "NIM/Stambuk":"6520240014", "Angkatan":2024, "Email":"asmlindazis@gmail.com", "No. Telepon/WA":"6281354539064", "Alamat":"Jln Sukamaju 8", "Linkedn":null, "Instagram":"instagram.com/asmlndazis", "Hobi":"Membaca" },
  { "ID PERISAI":"PRN0255", "Generasi":10, "Tugas dan Tanggung Jawab":"Kepala Departemen Media", "NamaLengkap":"Nahwa Kaka Saputra Anggareksa", "Tempat, Tanggal Lahir":"Kediri, 27 Februari 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230187", "Angkatan":2023, "Email":"nahwanirzam@gmail.com", "No. Telepon/WA":"62895800794794", "Alamat":"BTN Bumi Taeng Permai Blok B3/No 17 ", "Linkedn":"linkedin.com/in/nahwa-kaka-saputra-anggareksa", "Instagram":"instagram.com/nhw_kka", "Hobi":"Membaca" },
  { "ID PERISAI":"PRN0254", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli Media", "NamaLengkap":"Mutia Salianti", "Tempat, Tanggal Lahir":"Belopa, 16 Juni 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230223", "Angkatan":2023, "Email":"mutiasaliantii@gmail.com", "No. Telepon/WA":"6285175122168", "Alamat":"Jl. Urip Sumoharjo", "Linkedn":"linkedin.com/in/mutia-salianti", "Instagram":"instagram.com/mutiasaliantiii", "Hobi":"Nonton" },
  { "ID PERISAI":"PRN0272", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Media", "NamaLengkap":"Anaway Maryam Tenrisompa", "Tempat, Tanggal Lahir":"Kendari, 21 Agustus 2004", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230105", "Angkatan":2023, "Email":"anawaymaryam2104@gmail.com", "No. Telepon/WA":"6281340928902", "Alamat":"Jl. Abdesir", "Linkedn":null, "Instagram":"instagram.com/anwaymrryam_", "Hobi":"Menggambar" },
  { "ID PERISAI":"PRN0273", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Media", "NamaLengkap":"Andi Muhammad Syahrizan", "Tempat, Tanggal Lahir":"Sebatik, 23 Maret 2005", "Fakultas":"FAI", "Program Studi/Jurusan":"HKI", "NIM/Stambuk":"5120230011", "Angkatan":2023, "Email":"andisyahrizan23@gmail.com", "No. Telepon/WA":"6282159526508", "Alamat":"Komp. Griya batas kota Makassar-Maros", "Linkedn":"linkedin.com/in/andi-muhammad-syahrizan", "Instagram":"instagram.com/andysyahrzn", "Hobi":"Memancing" },
  { "ID PERISAI":"PRN0281", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Media", "NamaLengkap":"Muh. Fauzan Al Anshari", "Tempat, Tanggal Lahir":"Sorong , 7 September 2006", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240250", "Angkatan":2024, "Email":"fauzanalanshary247@gmail.com", "No. Telepon/WA":"6285217749332", "Alamat":"Makassar", "Linkedn":null, "Instagram":"instagram.com/fauzan.och", "Hobi":"Belajar" },
  { "ID PERISAI":"PRN0288", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Media", "NamaLengkap":"Putri Ananda Sagita", "Tempat, Tanggal Lahir":"Bira, 07 November 2003", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230126", "Angkatan":2023, "Email":"putrianandasagita07@gmail.com", "No. Telepon/WA":"6282346440433", "Alamat":"Jl. A.P Pettarani II Lr.7 No.2", "Linkedn":"linkedin.com/in/putri-ananda-sagita", "Instagram":"instagram.com/sghitaaa", "Hobi":"Nonton" },
  { "ID PERISAI":"PRN0286", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Media", "NamaLengkap":"Nabila Putri Lestari", "Tempat, Tanggal Lahir":"Tarakan, 29 Juni 2006", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120240053", "Angkatan":2024, "Email":"lestarinabila352@gmail.com", "No. Telepon/WA":"6285248227158", "Alamat":"Perum. Griya Safwa Blok B.18", "Linkedn":null, "Instagram":"instagram.com/nbilaptrilstri", "Hobi":"Nonton Anime dan mengedit" },
  { "ID PERISAI":"PRN0239", "Generasi":10, "Tugas dan Tanggung Jawab":"Kepala Departemen KOMPRES", "NamaLengkap":"Andi Yusliana", "Tempat, Tanggal Lahir":"Makassar, 01 Januari 2005", "Fakultas":"FF", "Program Studi/Jurusan":"Farmasi", "NIM/Stambuk":"15020230238", "Angkatan":2023, "Email":"andiyusliana6@gmail.com ", "No. Telepon/WA":"6285825273482", "Alamat":"Jl. Babussalam 1 No 20", "Linkedn":null, "Instagram":"instagram.com/andiyusliana01", "Hobi":"Baca novel" },
  { "ID PERISAI":"PRN0235", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"A. Aisya Sulistina", "Tempat, Tanggal Lahir":"Samaenre, 22 Juli 2003", "Fakultas":"FF", "Program Studi/Jurusan":"Farmasi", "NIM/Stambuk":"15020230196", "Angkatan":2023, "Email":"aisyasulistinaa@gmail.con", "No. Telepon/WA":"6281253728464", "Alamat":"Kaluku Bodoa Residence A5", "Linkedn":null, "Instagram":"instagram.com/aisyasulistina", "Hobi":"Basket, dengar lagu, shoping" },
  { "ID PERISAI":"PRN0243", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"Faradilla Ramadania Iski Thalib", "Tempat, Tanggal Lahir":"Manokwari, 19 Oktober 2004", "Fakultas":"FF", "Program Studi/Jurusan":"Farmasi", "NIM/Stambuk":"15020230204", "Angkatan":2023, "Email":"faradillarit@gmail.com", "No. Telepon/WA":"6281248849312", "Alamat":"Jl. Pampang 2", "Linkedn":"linkedin.com/in/faradilla-ramadania", "Instagram":"instagram.com/aesfara", "Hobi":"Membaca & menulis " },
  { "ID PERISAI":"PRN0263", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"Nuratika", "Tempat, Tanggal Lahir":"Bantaeng, 09 Oktober 2005", "Fakultas":"FF", "Program Studi/Jurusan":"Farmasi", "NIM/Stambuk":"15020230222", "Angkatan":2023, "Email":"09nuratikausman@gmail.com ", "No. Telepon/WA":"6287842198755", "Alamat":"Bumi Tamalanrea Permai", "Linkedn":null, "Instagram":"instagram.com/nnaatikaa", "Hobi":"Membaca" },
  { "ID PERISAI":"PRN0251", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"Muhammad Aidil", "Tempat, Tanggal Lahir":"Padang Sappa, 28 September 2005", "Fakultas":"FAI", "Program Studi/Jurusan":"HKI", "NIM/Stambuk":"5120230021", "Angkatan":2023, "Email":"muhammadaidil28092005@gmail.com", "No. Telepon/WA":"6282393844495", "Alamat":"Jl. Urip Sumoharjo", "Linkedn":null, "Instagram":"instagram.com/mhaidilll19", "Hobi":"Nonton, traveling" },
  { "ID PERISAI":"PRN0271", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"Ainun Nurul Safitri", "Tempat, Tanggal Lahir":"Soppeng, 02 November 2005", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120240054", "Angkatan":2024, "Email":"mufira47@gmail.com", "No. Telepon/WA":"6281250176833", "Alamat":" Jl Setuju, Tamalanrea", "Linkedn":"linkedin.com/in/ainun-nurul", "Instagram":"instagram.com/ainunnrlsafitri", "Hobi":"Memasak, membaca novel, nonton film" },
  { "ID PERISAI":"PRN0277", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"Fadil Angga Saputra", "Tempat, Tanggal Lahir":"Sinjai, 29 Desember 2005", "Fakultas":"FSIKP", "Program Studi/Jurusan":"Ilmu Komunikasi", "NIM/Stambuk":"652040074", "Angkatan":2024, "Email":"fadilanggasaputrraa@gmail.com ", "No. Telepon/WA":"6285796138072", "Alamat":"Moncongloe Maros", "Linkedn":null, "Instagram":"instagram.com/fadilanggasaputra", "Hobi":"Membaca , menulis, berenang , bulu tangkis" },
  { "ID PERISAI":"PRN0284", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"Hilal S. Ahmad", "Tempat, Tanggal Lahir":"Ternate, 30 Maret 2007", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240267", "Angkatan":2024, "Email":"hilalbsa7@gmail.com", "No. Telepon/WA":"6287865105912", "Alamat":"Jl. tupai lorong 14 no 4", "Linkedn":null, "Instagram":"instagram.com/_hilalbsa", "Hobi":"Menjelajahi hal baru dan mengeksplor tempat\" baru" },
  { "ID PERISAI":"PRN0265", "Generasi":10, "Tugas dan Tanggung Jawab":"Kepala Departemen HUMAS", "NamaLengkap":"Risha Dwi Pangestu", "Tempat, Tanggal Lahir":"Pontianak, 23 September 2005", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120230046", "Angkatan":2023, "Email":"rishadwipangestu469@gmail.com", "No. Telepon/WA":"6285388943636", "Alamat":"Jl. Tallasalapang, Aluddin", "Linkedn":"linkedin.com/in/risha-dwi-pangestu", "Instagram":"instagram.com/rishadwpngst", "Hobi":"Baca buku" },
  { "ID PERISAI":"PRN0236", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli HUMAS", "NamaLengkap":"Achmad Ersyad", "Tempat, Tanggal Lahir":"Makassar, 16 Agustus 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230312", "Angkatan":2023, "Email":"achmadersy16@gmail.com", "No. Telepon/WA":"6285340379174", "Alamat":"Jl. Maros Raya Blok B 51A", "Linkedn":null, "Instagram":"instagram.com/achmad_ersyad", "Hobi":"Travelling, olahraga, nonton" },
  { "ID PERISAI":"PRN0278", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli HUMAS", "NamaLengkap":"La Ode Ahmad Dinajad", "Tempat, Tanggal Lahir":"Raha, 22 Juli 2006", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240239", "Angkatan":2024, "Email":"ahmaddinajad09@gmail.com", "No. Telepon/WA":"6283838557227", "Alamat":"Jl.Pampang 4", "Linkedn":null, "Instagram":"instagram.com/_dnajad", "Hobi":"Membaca, Olahraga" },
  { "ID PERISAI":"PRN0285", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli HUMAS", "NamaLengkap":"Muh Zulkifli Hasril", "Tempat, Tanggal Lahir":"Makassar, 8 Februari 2006", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240266", "Angkatan":2024, "Email":"kipelcuy@gmail.com", "No. Telepon/WA":"6282344442793", "Alamat":"Jl. Borong Raya Baru 2", "Linkedn":null, "Instagram":"instagram.com/kipelll_", "Hobi":"Baca Komik" },
  { "ID PERISAI":"PRN0275", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli HUMAS", "NamaLengkap":"Aswar Kurniawan", "Tempat, Tanggal Lahir":"Kolaka, 8 Mei 2005", "Fakultas":"FP-BIOTAM", "Program Studi/Jurusan":"Agroteknologi", "NIM/Stambuk":"8220240030", "Angkatan":2024, "Email":"aswark235@gmail.com", "No. Telepon/WA":"6281244684880", "Alamat":"Perumahan Surandar 3 Samata , Gowa", "Linkedn":"linkedin.com/in/aswar-kurniawan", "Instagram":"instagram.com/aswarkurniawan_", "Hobi":"Menyanyi, menggambar, badminton " },
  { "ID PERISAI":"PRN0279", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli HUMAS", "NamaLengkap":"La Ode Muh. Dhefan Kasyfillah", "Tempat, Tanggal Lahir":"Raha , 28 Maret 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230232", "Angkatan":2023, "Email":"la.ode.muh.dhefan.01@gmail.com", "No. Telepon/WA":"6282214958313", "Alamat":"Pampang", "Linkedn":"linkedin.com/in/La-Ode-Muhammad-Dhaifan-Kasyfillah", "Instagram":"instagram.com/laodedhefan", "Hobi":"Olahraga" },
  { "ID PERISAI":"PRN0289", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli HUMAS", "NamaLengkap":"Siti Nur Azizah", "Tempat, Tanggal Lahir":"Makassar, 15 Mei 2005", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120230094", "Angkatan":2023, "Email":"sitinurazizahas8095964@gmail.com", "No. Telepon/WA":"6287755703384", "Alamat":"Jl. Paccerakkang No.87", "Linkedn":null, "Instagram":"instagram.com/zizah_r13", "Hobi":"Memasak, Nonton film, Dengar musik, Baking kue" },
  { "ID PERISAI":"PRN0253", "Generasi":10, "Tugas dan Tanggung Jawab":"Kepala Departemen RISTEK", "NamaLengkap":"Muhammad Rifky Saputra Scania", "Tempat, Tanggal Lahir":"Balikpapan, 02 Mei 2004", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230193", "Angkatan":2023, "Email":"rifky020504@gmail.com", "No. Telepon/WA":"6289503393609", "Alamat":"BTN Griya Maccopa Maros indah Blok F2 No1 ", "Linkedn":"www.linkedin.com/in/muhammad-rifky-saputra-scania", "Instagram":"instagram.com/justrifkyy_", "Hobi":"Menulis" },
  { "ID PERISAI":"PRN0258", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli RISTEK", "NamaLengkap":"Nayla Ananda", "Tempat, Tanggal Lahir":"Pare-Pare, 19 Januari 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230112", "Angkatan":2023, "Email":"naylaananda91@sma.belajar.id", "No. Telepon/WA":"6282317780847", "Alamat":"Jl. Ance Daeng Ngoyo Komp D'Boulevard Blok C7", "Linkedn":"linkedin.com/in/nayla-ananda", "Instagram":"instagram.com/naylaanandaa_", "Hobi":"Nonton" },
  { "ID PERISAI":"PRN0259", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli RISTEK", "NamaLengkap":"Ni'matun Nayiroh", "Tempat, Tanggal Lahir":"Malang, 12 Mei 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230262", "Angkatan":2023, "Email":"nayynima@gmail.com", "No. Telepon/WA":"6285853515150", "Alamat":"Jl. Lavender Kel. Pettuadae Kec. Turikale Kab. Maros", "Linkedn":"linkedin.com/in/nimatun-nayiro", "Instagram":"instagram.com/_nikmaa.nay", "Hobi":"Menulis, membaca, travelling" },
  { "ID PERISAI":"PRN0267", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli RISTEK", "NamaLengkap":"Rizqi Ananda Jalil", "Tempat, Tanggal Lahir":"Makassar, 26 Desember 2003", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230244", "Angkatan":2023, "Email":"rizqianandajalileducation@gmail.com", "No. Telepon/WA":"6282188094861", "Alamat":"Jl. Dg Kuling No. 4, Parang Tambung, Kec. Tamalate", "Linkedn":"linkedin.com/in/rizqi-ananda-jalil", "Instagram":"instagram.com/rizqianandajalil_", "Hobi":"Menulis" },
  { "ID PERISAI":"PRN0270", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli RISTEK", "NamaLengkap":"A. Nurul Fauziah Az-zahra ", "Tempat, Tanggal Lahir":"Sorowako . 10 Februari 2006", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240128", "Angkatan":2024, "Email":"andinurulfauziah87@gmail.com ", "No. Telepon/WA":"6285183241025", "Alamat":"Rusunawa UMI", "Linkedn":"linkedin.com/in/andinurulfauziah", "Instagram":"instagram.com/fauziiiaah.az", "Hobi":"Membaca, menonton, jalan jalan" },
  { "ID PERISAI":"PRN0283", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli RISTEK", "NamaLengkap":"Muhammad Adrian", "Tempat, Tanggal Lahir":"Kendari, 14 Mei 2006", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240262", "Angkatan":2024, "Email":"muhammadadrianriab675@gmail.com", "No. Telepon/WA":"6295333696572", "Alamat":"Jl. Pampang 1", "Linkedn":null, "Instagram":"instagram.com/simply.ryann_", "Hobi":"Merenung, Membaca, Hiking, Sepak Bola, Badminton" },
  { "ID PERISAI":"PRN0280", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli RISTEK", "NamaLengkap":"Leon Octa Pratama", "Tempat, Tanggal Lahir":"Kendari, 31 Oktober 2004", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240269", "Angkatan":2024, "Email":"leonpratama19@gmail.com", "No. Telepon/WA":"6285346393418", "Alamat":"Jl. RSI Faisal XVII", "Linkedn":"www.linkedin.com/in/leon-octa-pratama", "Instagram":"instagram.com/leonpratamaa", "Hobi":"Nonton " },
  { "ID PERISAI":"PRN0262", "Generasi":10, "Tugas dan Tanggung Jawab":"Kepala Departemen Penalaran", "NamaLengkap":"Nur Eka Saputri", "Tempat, Tanggal Lahir":"Makassar, 25 Agustus 2004", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120230036", "Angkatan":2023, "Email":"nurekasaputri43@gmail.com", "No. Telepon/WA":"6281242860657", "Alamat":"Jln. Kandea 3", "Linkedn":"linkedin.com/in/nur-eka-saputri", "Instagram":"instagram.com/nureka.saputri", "Hobi":"Traveling" },
  { "ID PERISAI":"PRN0240", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli Penalaran", "NamaLengkap":"Anisha Az-Zahrah", "Tempat, Tanggal Lahir":"Biak, 05 November 2005", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120230029", "Angkatan":2023, "Email":"azzahraannisa1128@gmail.com", "No. Telepon/WA":"6282371593486", "Alamat":"Jl. Arif Rahman Hakim ", "Linkedn":"linkedin.com/in/anisha-az-zahrah", "Instagram":"instagram./anishaazzahrah", "Hobi":"Olahraga" },
  { "ID PERISAI":"PRN0237", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli Penalaran", "NamaLengkap":"Afifa Turrofiah", "Tempat, Tanggal Lahir":"Kalitata, 24 Maret 2005", "Fakultas":"FAI", "Program Studi/Jurusan":"PGMI", "NIM/Stambuk":"10620230014", "Angkatan":2023, "Email":"ifaafifa699@gmail.com", "No. Telepon/WA":"6285338380232", "Alamat":"BTN Hamzy", "Linkedn":null, "Instagram":"instagram.com/afifa3122", "Hobi":"Membaca, memasak, travelling" },
  { "ID PERISAI":"PRN0276", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Penalaran", "NamaLengkap":"Elsa Salsabila", "Tempat, Tanggal Lahir":"Bontang , 26 Agustus 2005", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120240063", "Angkatan":2024, "Email":"uumi33550@gmail.com", "No. Telepon/WA":"6285753423622", "Alamat":"Rusunawa UMI", "Linkedn":"linkedin.com/in/elsa-salsabila", "Instagram":"instagram.com/elsaslsb_", "Hobi":"Memasak , menyanyi , travelling" },
  { "ID PERISAI":"PRN0287", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Penalaran", "NamaLengkap":"Nurfauziah", "Tempat, Tanggal Lahir":"Bima , 25 September 2006", "Fakultas":"FTI", "Program Studi/Jurusan":"Teknik Pertambangan", "NIM/Stambuk":"9320240087", "Angkatan":2024, "Email":"nurfaujia1509@gmail.com", "No. Telepon/WA":"6281263004906", "Alamat":"Tallo Lama", "Linkedn":"linkedin.com/in/Nur-Fauziah", "Instagram":"instagram.com/_zeeyyyyy", "Hobi":"Badminton" },
  { "ID PERISAI":"PRN0282", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Penalaran", "NamaLengkap":"Muh. Ishak Syam", "Tempat, Tanggal Lahir":"Saungeng, 20 Maret 2004", "Fakultas":"FP-BIOTAM", "Program Studi/Jurusan":"Agroteknologi", "NIM/Stambuk":"8220230025", "Angkatan":2023, "Email":"muhishaksyam07@gmail.com", "No. Telepon/WA":"6281242708249", "Alamat":" Jl Perintis kemerdekaan no.3", "Linkedn":null, "Instagram":"instagram.com/muh.ishaksyam", "Hobi":"Membaca " }
];

function parseTTL(raw) {
  if (!raw) return { tempat: null, tanggal: null };
  const parts = raw.split(",").map(s => s.trim());
  const tempat = parts[0] || null;
  const tglStr = parts[1] || "";
  if (!tglStr) return { tempat, tanggal: null };

  const match = tglStr.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!match) return { tempat, tanggal: null };

  const d = match[1].padStart(2, "0");
  const mName = match[2].toLowerCase();
  const y = match[3];

  const monthMap = {
    januari: "01", februari: "02", maret: "03", april: "04",
    mei: "05", juni: "06", juli: "07", agustus: "08",
    september: "09", oktober: "10", november: "11", desember: "12"
  };
  const m = monthMap[mName] || "01";
  return { tempat, tanggal: `${y}-${m}-${d}` };
}

function normalizeUrl(url, base) {
  if (!url) return null;
  let clean = url.trim().replace(/\s+/g, "");
  if (base === "instagram") {
    clean = clean.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
    clean = clean.replace(/^instagram\.\/?/i, "instagram.com/");
    clean = clean.replace(/^instagram\.com\//i, "");
    return clean ? `https://instagram.com/${clean}` : null;
  }
  if (base === "linkedin") {
    clean = clean.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
    return clean ? `https://${clean}` : null;
  }
  return clean;
}

function normalizePhone(raw) {
  if (!raw) return null;
  const s = String(raw).trim().replace(/[^0-9]/g, "");
  if (s.startsWith("62")) return `+${s}`;
  if (s.startsWith("0")) return `+62${s.slice(1)}`;
  return `+${s}`;
}

async function main() {
  console.log("1️⃣  Tahap 1: Inspeksi dan Hapus Bersih Seluruh Objek Database Turso...");

  // Nonaktifkan foreign keys selama pembersihan
  await client.execute("PRAGMA foreign_keys = OFF;");

  // Ambil semua tabel, views, dan trigger pengguna
  const masterRes = await client.execute(
    "SELECT type, name FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' AND name NOT LIKE '_litestream_%' ORDER BY type DESC"
  );

  console.log(`Ditemukan ${masterRes.rows.length} objek database yang akan dihapus.`);

  // Hapus views & triggers terlebih dahulu
  for (const row of masterRes.rows) {
    if (row.type === "trigger") {
      console.log(`   - Menghapus TRIGGER: ${row.name}`);
      await client.execute(`DROP TRIGGER IF EXISTS "${row.name}";`);
    } else if (row.type === "view") {
      console.log(`   - Menghapus VIEW: ${row.name}`);
      await client.execute(`DROP VIEW IF EXISTS "${row.name}";`);
    }
  }

  // Hapus tabel
  for (const row of masterRes.rows) {
    if (row.type === "table") {
      console.log(`   - Menghapus TABLE: ${row.name}`);
      await client.execute(`DROP TABLE IF EXISTS "${row.name}";`);
    }
  }

  // Aktifkan kembali foreign keys
  await client.execute("PRAGMA foreign_keys = ON;");
  console.log("✅ Seluruh isi database Turso telah BERSIH TOTAL!");

  console.log("\n2️⃣  Tahap 2: Menerapkan Skema DDL Baku (002_complete_perisai_schema.sql)...");
  const sql = fs.readFileSync("db/migrations/002_complete_perisai_schema.sql", "utf8");
  const cleanSql = sql
    .split("\n")
    .map(line => line.trim().startsWith("--") ? "" : line)
    .join("\n");

  const statements = cleanSql
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
    } catch (e) {
      console.warn("DDL notice:", e.message);
    }
  }
  console.log(`✅ Berhasil menerapkan ${statements.length} instruksi DDL skema 3NF ternormalisasi.`);

  console.log("\n3️⃣  Tahap 3: Seeding Data Master & Fungsionaris 2026/2027 (Tanpa BPH)...");
  const now = Math.floor(Date.now() / 1000);
  const defaultPasswordHash = crypto.createHash("sha256").update("perisai2026").digest("hex");

  // 3a. Fakultas
  const daftarFakultas = [
    { nama: "Fakultas Ekonomi dan Bisnis", kode: "FEB" },
    { nama: "Fakultas Kesehatan Masyarakat", kode: "FKM" },
    { nama: "Fakultas Ilmu Komputer", kode: "FIKOM" },
    { nama: "Fakultas Pertanian & Bioteknologi Pertanian", kode: "FP-BIOTAM" },
    { nama: "Fakultas Sastra dan Ilmu Komunikasi", kode: "FSIKP" },
    { nama: "Fakultas Agama Islam", kode: "FAI" },
    { nama: "Fakultas Farmasi", kode: "FF" },
    { nama: "Fakultas Teknologi Industri", kode: "FTI" },
    { nama: "Fakultas Teknik", kode: "FT" },
    { nama: "Fakultas Hukum", kode: "FH" },
    { nama: "Fakultas Kedokteran", kode: "FK" },
    { nama: "Fakultas Kedokteran Gigi", kode: "FKG" },
    { nama: "Fakultas Perikanan dan Ilmu Kelautan", kode: "FPIK" }
  ];

  const fakMap = {};
  for (const f of daftarFakultas) {
    await client.execute({
      sql: `INSERT INTO M_Fakultas (nama_fakultas, kode_fakultas, created_at, updated_at) VALUES (?, ?, ?, ?)`,
      args: [f.nama, f.kode, now, now]
    });
    const r = await client.execute({ sql: "SELECT id_fakultas FROM M_Fakultas WHERE kode_fakultas = ?", args: [f.kode] });
    if (r.rows[0]) fakMap[f.kode] = r.rows[0].id_fakultas;
  }

  // 3b. Jurusan
  const daftarJurusan = [
    { nama: "Manajemen", fakKode: "FEB", jenjang: "S1" },
    { nama: "Akuntansi", fakKode: "FEB", jenjang: "S1" },
    { nama: "Ilmu Ekonomi Pembangunan", fakKode: "FEB", jenjang: "S1" },
    { nama: "Kesehatan Masyarakat", fakKode: "FKM", jenjang: "S1" },
    { nama: "Kebidanan", fakKode: "FKM", jenjang: "D3" },
    { nama: "Teknik Informatika", fakKode: "FIKOM", jenjang: "S1" },
    { nama: "Sistem Informasi", fakKode: "FIKOM", jenjang: "S1" },
    { nama: "Agribisnis", fakKode: "FP-BIOTAM", jenjang: "S1" },
    { nama: "Agroteknologi", fakKode: "FP-BIOTAM", jenjang: "S1" },
    { nama: "Ilmu Komunikasi", fakKode: "FSIKP", jenjang: "S1" },
    { nama: "Sastra Inggris", fakKode: "FSIKP", jenjang: "S1" },
    { nama: "Sastra Indonesia", fakKode: "FSIKP", jenjang: "S1" },
    { nama: "HKI", fakKode: "FAI", jenjang: "S1" },
    { nama: "PGMI", fakKode: "FAI", jenjang: "S1" },
    { nama: "Pendidikan Agama Islam", fakKode: "FAI", jenjang: "S1" },
    { nama: "Farmasi", fakKode: "FF", jenjang: "S1" },
    { nama: "Teknik Pertambangan", fakKode: "FTI", jenjang: "S1" },
    { nama: "Teknik Kimia", fakKode: "FTI", jenjang: "S1" },
    { nama: "Teknik Industri", fakKode: "FTI", jenjang: "S1" },
    { nama: "Teknik Sipil", fakKode: "FT", jenjang: "S1" },
    { nama: "Teknik Mesin", fakKode: "FT", jenjang: "S1" },
    { nama: "Teknik Elektro", fakKode: "FT", jenjang: "S1" },
    { nama: "Teknik Arsitektur", fakKode: "FT", jenjang: "S1" },
    { nama: "Ilmu Hukum", fakKode: "FH", jenjang: "S1" },
    { nama: "Pendidikan Dokter", fakKode: "FK", jenjang: "S1" },
    { nama: "Pendidikan Dokter Gigi", fakKode: "FKG", jenjang: "S1" },
    { nama: "Pemanfaatan Sumberdaya Perikanan", fakKode: "FPIK", jenjang: "S1" }
  ];

  const jurMap = {};
  for (const j of daftarJurusan) {
    const fid = fakMap[j.fakKode] || 1;
    await client.execute({
      sql: `INSERT INTO M_Jurusan (id_fakultas, nama_jurusan, jenjang, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
      args: [fid, j.nama, j.jenjang, now, now]
    });
    const r = await client.execute({ sql: "SELECT id_jurusan FROM M_Jurusan WHERE nama_jurusan = ?", args: [j.nama] });
    if (r.rows[0]) jurMap[j.nama] = r.rows[0].id_jurusan;
  }

  // 3c. 6 Departemen Resmi (Tanpa BPH)
  const daftarDept = [
    { nama: "Penalaran dan Keilmuan", singkatan: "PENALARAN", slug: "penalaran", tupoksi: "Pengembangan budaya berpikir kritis, kajian ilmiah, dan forum diskusi akademis.", urutan: 1 },
    { nama: "Media dan Informasi", singkatan: "MEDIA", slug: "media", tupoksi: "Pusat kreasi visual, dokumentasi kegiatan, dan pengelolaan kanal digital.", urutan: 2 },
    { nama: "Riset dan Teknologi", singkatan: "RISTEK", slug: "ristek", tupoksi: "Pusat inovasi rekayasa teknologi, penelitian terapan, dan hilirisasi karya riset.", urutan: 3 },
    { nama: "Kompetisi dan Prestasi", singkatan: "KOMPRES", slug: "kompres", tupoksi: "Mewadahi bimbingan perlombaan ilmiah, delegasi kompetisi, dan rekognisi prestasi.", urutan: 4 },
    { nama: "Pengembangan Sumber Daya Manusia", singkatan: "PSDM", slug: "psdm", tupoksi: "Kaderisasi, pengembangan kepemimpinan, dan kesejahteraan seluruh fungsionaris.", urutan: 5 },
    { nama: "Hubungan Masyarakat", singkatan: "HUMAS", slug: "humas", tupoksi: "Menjalin relasi strategis, kemitraan lembaga, dan publikasi citra organisasi.", urutan: 6 },
  ];

  const deptMap = {};
  for (const d of daftarDept) {
    await client.execute({
      sql: `INSERT INTO M_Departemen (nama_departemen, singkatan, slug, tupoksi_utama, deskripsi_singkat, urutan, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      args: [d.nama, d.singkatan, d.slug, d.tupoksi, d.tupoksi, d.urutan, now, now]
    });
    const r = await client.execute({ sql: "SELECT id_departemen FROM M_Departemen WHERE slug = ?", args: [d.slug] });
    if (r.rows[0]) deptMap[d.singkatan] = r.rows[0].id_departemen;
  }

  // 3d. Periode 2026/2027
  await client.execute({
    sql: `INSERT INTO M_Periode (nama_periode, tahun_mulai, tahun_selesai, is_active, tema_kepengurusan, created_at, updated_at)
          VALUES ('2026/2027', 2026, 2027, 1, 'Inovasi Kolaboratif Menuju Perisai Emas', ?, ?)`,
    args: [now, now]
  });
  const pRes = await client.execute("SELECT id_periode FROM M_Periode WHERE nama_periode = '2026/2027'");
  const periodeId = pRes.rows[0].id_periode;

  // 3e. Roles RBAC (SUPER_ADMIN, ADMIN, KADEP, EDITOR, ANGGOTA)
  const allPermissions = [
    "posts:read", "posts:create", "posts:update", "posts:publish", "posts:delete",
    "opportunities:read", "opportunities:create", "opportunities:update", "opportunities:delete",
    "finance:read", "finance:create", "finance:update", "finance:delete", "finance:export",
    "programs:read", "programs:create", "programs:update", "programs:delete",
    "members:read", "members:create", "members:update", "members:delete",
    "departments:read", "departments:update", "departments:manage",
    "inbox:read", "inbox:mark_read", "inbox:delete",
    "gallery:read", "gallery:upload", "gallery:delete",
    "settings:read", "settings:update",
    "users:read", "users:create", "users:update", "users:assign_role",
    "audit:read"
  ];

  const daftarRoles = [
    {
      nama: "SUPER_ADMIN",
      label: "Administrator Teknis / Webmaster",
      desc: "Akses teknis penuh seluruh sistem CMS",
      permissions: allPermissions,
      isSystem: 1
    },
    {
      nama: "ADMIN",
      label: "Pengurus Inti & Kepala Departemen",
      desc: "Pimpinan operasional (Ketua Umum, Sekum, Bendum, Kadep)",
      permissions: allPermissions.filter(k => k !== "users:assign_role"),
      isSystem: 1
    },
    {
      nama: "KADEP",
      label: "Kepala Departemen",
      desc: "Akses program kerja dan anggota divisi departemen",
      permissions: [
        "programs:read", "programs:create", "programs:update",
        "members:read", "departments:read", "gallery:read", "gallery:upload",
        "posts:read", "opportunities:read"
      ],
      isSystem: 1
    },
    {
      nama: "EDITOR",
      label: "Staf Ahli / Kontributor Konten",
      desc: "Akses penulisan artikel, berita, dan galeri media",
      permissions: [
        "posts:read", "posts:create", "posts:update", "posts:publish",
        "gallery:read", "gallery:upload", "gallery:delete", "opportunities:read"
      ],
      isSystem: 1
    },
    {
      nama: "ANGGOTA",
      label: "Anggota Biasa",
      desc: "Akses profil pribadi anggota dan forum internal",
      permissions: [
        "posts:read", "opportunities:read", "programs:read", "members:read", "departments:read", "gallery:read"
      ],
      isSystem: 1
    },
  ];

  const roleMap = {};
  for (const r of daftarRoles) {
    await client.execute({
      sql: `INSERT INTO M_Role (nama_role, label, deskripsi, permissions, is_system, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [r.nama, r.label, r.desc, JSON.stringify(r.permissions), r.isSystem, now, now]
    });
    const res = await client.execute({ sql: "SELECT id_role FROM M_Role WHERE nama_role = ?", args: [r.nama] });
    if (res.rows[0]) roleMap[r.nama] = res.rows[0].id_role;
  }

  // 3f. Jabatan Fungsionaris
  const daftarJabatan = [
    { nama: "Ketua Umum", level: 1, urutan: 1 },
    { nama: "Sekretaris Umum", level: 2, urutan: 2 },
    { nama: "Bendahara Umum", level: 2, urutan: 3 },
    { nama: "Kepala Departemen", level: 3, urutan: 4 },
    { nama: "Staf Ahli", level: 4, urutan: 5 },
    { nama: "Anggota", level: 5, urutan: 6 },
  ];

  const jabMap = {};
  for (const j of daftarJabatan) {
    await client.execute({
      sql: `INSERT INTO M_Jabatan (nama_jabatan, level_hirarki, urutan, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
      args: [j.nama, j.level, j.urutan, now, now]
    });
    const res = await client.execute({ sql: "SELECT id_jabatan FROM M_Jabatan WHERE nama_jabatan = ?", args: [j.nama] });
    if (res.rows[0]) jabMap[j.nama] = res.rows[0].id_jabatan;
  }

  // 3g. Dewan Pembina & Penasihat
  const daftarPembina = [
    { nama: "Dr. Ir. H. M. Said, MT", gelar: "Dr., Ir., MT", jabatan: "Dewan Pembina Utama", kategori: "pembina", urutan: 1 },
    { nama: "Prof. Dr. Hj. Nurjannah, SE, M.Si", gelar: "Prof., Dr., M.Si", jabatan: "Dewan Penasihat Akademik", kategori: "pembina", urutan: 2 },
    { nama: "Ahmad Fauzan S.Kom", gelar: "S.Kom", jabatan: "Dewan Pertimbangan Organisasi (DPO)", kategori: "penasihat", urutan: 3 }
  ];
  for (const pb of daftarPembina) {
    await client.execute({
      sql: `INSERT INTO M_Pembina (nama, gelar, jabatan, kategori, urutan, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      args: [pb.nama, pb.gelar, pb.jabatan, pb.kategori, pb.urutan, now, now]
    });
  }

  // 3h. 33 Anggota Fungsionaris, Akun, dan Kepengurusan
  console.log("3h. Memasukkan 33 fungsionaris UKM PERISAI UMI...");
  let sortIdx = 1;
  for (const m of rawMembers) {
    const prn = m["ID PERISAI"].replace(/\s+/g, "");
    const nama = m["NamaLengkap"].trim();
    const nim = m["NIM/Stambuk"].trim();
    const jurusanName = m["Program Studi/Jurusan"].trim();
    const jurusanId = jurMap[jurusanName] || 1;
    const angkatan = Number(m["Angkatan"]) || 2023;
    const gen = Number(m["Generasi"]) || 10;
    const { tempat, tanggal } = parseTTL(m["Tempat, Tanggal Lahir"]);
    const email = m["Email"].trim().toLowerCase();
    const noWa = normalizePhone(m["No. Telepon/WA"]);
    const alamat = m["Alamat"] ? m["Alamat"].trim() : null;
    const linkedin = normalizeUrl(m["Linkedn"], "linkedin");
    const instagram = normalizeUrl(m["Instagram"], "instagram");
    const hobi = m["Hobi"] ? m["Hobi"].trim() : null;

    // Insert M_Anggota
    await client.execute({
      sql: `INSERT INTO M_Anggota (
              id_perisai, nama_lengkap, nim, id_jurusan, angkatan, gen, tempat_lahir,
              tanggal_lahir, jenis_kelamin, email, no_wa, alamat, linkedin, instagram,
              hobi, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'L', ?, ?, ?, ?, ?, ?, 'aktif', ?, ?)`,
      args: [prn, nama, nim, jurusanId, angkatan, gen, tempat, tanggal, email, noWa, alamat, linkedin, instagram, hobi, now, now]
    });

    // Mapping Jabatan, Departemen, & Role
    const tugas = m["Tugas dan Tanggung Jawab"].trim();
    let jabatanId = jabMap["Anggota"];
    let deptId = null; // Default null untuk Pengurus Inti
    let roleId = roleMap["ANGGOTA"];
    let tier = "staf";

    if (tugas === "Ketua Umum") {
      jabatanId = jabMap["Ketua Umum"];
      deptId = null;
      roleId = roleMap["SUPER_ADMIN"];
      tier = "inti";
    } else if (tugas === "Sekretaris Umum") {
      jabatanId = jabMap["Sekretaris Umum"];
      deptId = null;
      roleId = roleMap["ADMIN"] || roleMap["SUPER_ADMIN"];
      tier = "inti";
    } else if (tugas === "Bendahara Umum") {
      jabatanId = jabMap["Bendahara Umum"];
      deptId = null;
      roleId = roleMap["ADMIN"] || roleMap["SUPER_ADMIN"];
      tier = "inti";
    } else if (tugas.startsWith("Kepala Departemen")) {
      jabatanId = jabMap["Kepala Departemen"];
      const code = tugas.replace("Kepala Departemen", "").trim();
      deptId = deptMap[code] || null;
      roleId = roleMap["ADMIN"] || roleMap["KADEP"];
      tier = "kadep";
    } else if (tugas.startsWith("Staf Ahli")) {
      jabatanId = jabMap["Staf Ahli"];
      const code = tugas.replace("Staf Ahli", "").trim();
      deptId = deptMap[code] || null;
      roleId = (code === "MEDIA" || code === "HUMAS") ? roleMap["EDITOR"] : roleMap["ANGGOTA"];
      tier = "staf";
    }

    // Insert M_Akun
    await client.execute({
      sql: `INSERT INTO M_Akun (id_perisai, id_role, password_hash, is_active, created_at, updated_at)
            VALUES (?, ?, ?, 1, ?, ?)`,
      args: [prn, roleId, defaultPasswordHash, now, now]
    });

    // Insert T_Kepengurusan
    await client.execute({
      sql: `INSERT INTO T_Kepengurusan (id_periode, id_perisai, id_jabatan, id_departemen, tier, status, urutan, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 'aktif', ?, ?, ?)`,
      args: [periodeId, prn, jabatanId, deptId, tier, sortIdx++, now, now]
    });
  }

  // 3i. Pengaturan Default Sistem (T_Pengaturan)
  const defaultSettings = [
    { kunci: "nama_organisasi", nilai: "UKM PERISAI UMI Makassar", tipe: "string" },
    { kunci: "slogan", nilai: "Cendekia, Kritis, dan Berintegritas Ilmiah", tipe: "string" },
    { kunci: "email_resmi", nilai: "kontak@perisai-umi.org", tipe: "string" },
    { kunci: "no_telepon_resmi", nilai: "+6281244899985", tipe: "string" },
    { kunci: "alamat_sekretariat", nilai: "Gedung PKM Lt. 2 Kampus II Universitas Muslim Indonesia, Jl. Urip Sumoharjo KM. 5, Makassar", tipe: "string" },
    { kunci: "periode_aktif", nilai: "2026/2027", tipe: "string" },
    { kunci: "maintenance_mode", nilai: "0", tipe: "boolean" },
  ];
  for (const s of defaultSettings) {
    await client.execute({
      sql: `INSERT INTO T_Pengaturan (kunci, nilai, tipe, updated_at) VALUES (?, ?, ?, ?)`,
      args: [s.kunci, s.nilai, s.tipe, now]
    });
  }

  // 3j. Berita & Publikasi Ilmiah (T_Berita)
  const sampleBerita = [
    {
      deptSlug: "penalaran",
      judul: "Focus Group Discussion 2026: IPK Tinggi vs Kemampuan Berpikir Kritis",
      slug: "focus-group-discussion-2026-ipk-vs-berpikir-kritis",
      kategori: "Diskusi & Riset",
      ringkasan: "Bedah mendalam mengenai korelasi prestasi akademik dengan ketajaman nalar saintifik mahasiswa bersama akademisi dan praktisi riset.",
      konten: "<p>Apakah indeks prestasi kumulatif (IPK) yang tinggi selalu berbanding lurus dengan ketajaman berpikir kritis dan kapabilitas memecahkan persoalan kompleks? Pertanyaan mendasar inilah yang menjadi episentrum diskusi ilmiah dalam Focus Group Discussion (FGD) 2026 yang diinisiasi oleh Bidang Penalaran dan Keilmuan UKM PERISAI UMI.</p>",
      fotoCover: "/og-default.jpg",
      fotoDokumentasi: JSON.stringify(["/og-default.jpg"]),
      isFeatured: 1,
    },
    {
      deptSlug: "humas",
      judul: "PERISAI Humanity: Restorasi Ekosistem Pesisir & Tanam 1.000 Mangrove",
      slug: "perisai-humanity-konservasi-pesisir-mangrove",
      kategori: "Pengabdian Masyarakat",
      ringkasan: "Wujud kontribusi nyata fungsionaris PERISAI UMI dalam melestarikan sabuk hijau pesisir Sulawesi Selatan untuk mitigasi bencana abrasi.",
      konten: "<p>Sebagai perwujudan Tri Dharma Perguruan Tinggi pilar pengabdian masyarakat, UKM PERISAI UMI menyelenggarakan program aksi lingkungan bertajuk PERISAI Humanity: Satu Mangrove, Seribu Manfaat di kawasan pesisir Maros - Makassar.</p>",
      fotoCover: "/og-default.jpg",
      fotoDokumentasi: JSON.stringify(["/og-default.jpg"]),
      isFeatured: 1,
    },
    {
      deptSlug: "kompres",
      judul: "Delegasi PERISAI UMI Raih Medali Emas di LKTIN National Research Festival 2026",
      slug: "delegasi-perisai-raih-medali-emas-lktin-2026",
      kategori: "Prestasi & Kejuaraan",
      ringkasan: "Karya inovasi teknologi penjernih air limbah industri berbasis membran selulosa bakteri berhasil mengantarkan tim UMI menjuarai kompetisi tingkat nasional.",
      konten: "<p>Prestasi membanggakan kembali dipersembahkan oleh fungsionaris UKM PERISAI UMI di kancah nasional. Tim delegasi riset berhasil menyabet Juara 1 (Medali Emas) dan penghargaan Best Presentation pada ajang National Scientific Research Festival 2026.</p>",
      fotoCover: "/og-default.jpg",
      fotoDokumentasi: JSON.stringify(["/og-default.jpg"]),
      isFeatured: 1,
    },
  ];

  for (const b of sampleBerita) {
    const deptRows = await client.execute({ sql: "SELECT id_departemen FROM M_Departemen WHERE slug = ?", args: [b.deptSlug] });
    const deptId = deptRows.rows[0] ? deptRows.rows[0].id_departemen : null;
    await client.execute({
      sql: `INSERT INTO T_Berita (
              id_departemen, judul, slug, kategori, ringkasan, konten, foto_cover, foto_dokumentasi,
              penulis_id, status, tanggal_publish, is_featured, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PRN0253', 'published', ?, ?, ?, ?)`,
      args: [deptId, b.judul, b.slug, b.kategori, b.ringkasan, b.konten, b.fotoCover, b.fotoDokumentasi, now, b.isFeatured, now, now]
    });
  }

  // 3k. Direktori Peluang Kompetisi & Beasiswa (T_Kompetisi)
  const sampleKompetisi = [
    {
      nama: "Pekan Ilmiah Mahasiswa Nasional (PIMNAS) ke-39",
      slug: "pimnas-39-dikti-2026",
      tipe: "lomba",
      kategori: "PKM",
      tingkat: "Nasional",
      penyelenggara: "Kemendikbudristek & Balai Pengembangan Talenta Indonesia",
      deskripsi: "Ajang puncak kompetisi ilmiah dan inovasi mahasiswa terbesar di Indonesia.",
      deadline: now + 60 * 24 * 3600,
      tglPelaksanaan: "November 2026",
      deptSlug: "kompres"
    },
    {
      nama: "National Scientific Writing Competition (NSWC) 2026",
      slug: "nswc-ugm-2026",
      tipe: "lomba",
      kategori: "KTI",
      tingkat: "Nasional",
      penyelenggara: "BEM KM Universitas Gadjah Mada",
      deskripsi: "Lomba Karya Tulis Ilmiah Nasional seputar transisi energi hijau dan keberlanjutan sumber daya maritim.",
      deadline: now + 30 * 24 * 3600,
      tglPelaksanaan: "Agustus 2026",
      deptSlug: "kompres"
    }
  ];

  for (const k of sampleKompetisi) {
    const deptRows = await client.execute({ sql: "SELECT id_departemen FROM M_Departemen WHERE slug = ?", args: [k.deptSlug] });
    const deptId = deptRows.rows[0] ? deptRows.rows[0].id_departemen : null;
    await client.execute({
      sql: `INSERT INTO T_Kompetisi (
              id_departemen, tipe, nama_kompetisi, slug, kategori, tingkat, penyelenggara,
              deskripsi, deadline_pendaftaran, tanggal_pelaksanaan, link_pendaftaran, link_panduan, link_poster,
              status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'https://perisai-umi.org', 'https://perisai-umi.org', '/og-default.jpg', 'published', ?, ?)`,
      args: [deptId, k.tipe, k.nama, k.slug, k.kategori, k.tingkat, k.penyelenggara, k.deskripsi, k.deadline, k.tglPelaksanaan, now, now]
    });
  }

  // 3l. Program Kerja Unggulan
  const sampleProker = [
    {
      deptSlug: "psdm",
      nama: "Latihan Kepemimpinan Riset & Fungsionaris Emas (LKRF)",
      slug: "latihan-kepemimpinan-riset-fungsionaris-emas",
      deskripsi: "Peningkatan kapasitas manajerial, soliditas organisasi, dan orientasi kepengurusan berbasis adab dan riset ilmiah.",
      fotoCover: "/og-default.jpg",
      fotoDokumentasi: JSON.stringify(["/og-default.jpg"]),
      status: "terlaksana",
      urutan: 1,
    },
    {
      deptSlug: "penalaran",
      nama: "Klinik Metodologi Penelitian & Penulisan Ilmiah",
      slug: "klinik-metodologi-penelitian-ilmiah",
      deskripsi: "Workshop berkala bimbingan teknis metodologi penelitian, review jurnal bereputasi, dan penyusunan proposal PKM.",
      fotoCover: "/og-default.jpg",
      fotoDokumentasi: JSON.stringify(["/og-default.jpg"]),
      status: "berjalan",
      urutan: 2,
    },
    {
      deptSlug: "ristek",
      nama: "Inkubasi Prototipe & Karya Inovasi Teknologi Tepat Guna",
      slug: "inkubasi-prototipe-inovasi-teknologi",
      deskripsi: "Laboratorium inkubasi rekayasa perangkat lunak dan hardware ramah lingkungan untuk memfasilitasi riset aplikatif fungsionaris.",
      fotoCover: "/og-default.jpg",
      fotoDokumentasi: JSON.stringify(["/og-default.jpg"]),
      status: "berjalan",
      urutan: 3,
    },
    {
      deptSlug: "media",
      nama: "Penerbitan Majalah Ilmiah & Portal Jurnalistik Riset PERISAI",
      slug: "majalah-ilmiah-jurnalistik-riset",
      deskripsi: "Publikasi berkala majalah digital, buletin riset, serta dokumentasi seluruh kiprah inovasi civitas akademika UKM PERISAI UMI.",
      fotoCover: "/og-default.jpg",
      fotoDokumentasi: JSON.stringify(["/og-default.jpg"]),
      status: "rencana",
      urutan: 4,
    },
  ];

  for (const p of sampleProker) {
    const deptRows = await client.execute({ sql: "SELECT id_departemen FROM M_Departemen WHERE slug = ?", args: [p.deptSlug] });
    const deptId = deptRows.rows[0] ? deptRows.rows[0].id_departemen : 1;
    await client.execute({
      sql: `INSERT INTO T_Proker (
              id_departemen, id_periode, nama_proker, slug, deskripsi, foto_cover, foto_dokumentasi,
              status, urutan, diperbarui_oleh, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PRN0253', ?, ?)`,
      args: [deptId, periodeId, p.nama, p.slug, p.deskripsi, p.fotoCover, p.fotoDokumentasi, p.status, p.urutan, now, now]
    });
  }

  // 3m. Catatan Keuangan Awal
  await client.execute({
    sql: `INSERT INTO T_Keuangan (
            id_periode, jenis_transaksi, kategori, nominal, keterangan,
            tanggal_transaksi, bukti_nota, dicatat_oleh, created_at, updated_at
          ) VALUES (
            ?, 'pemasukan', 'Saldo Awal Kas', 5000000,
            'Saldo kas awal kepengurusan periode 2026/2027',
            '2026-01-01', '/nota-dummy.jpg', 'PRN0250', ?, ?
          )`,
    args: [periodeId, now, now]
  });

  console.log("\n==================================================================");
  console.log("🎉 DATABASE TURSO BERHASIL DIRESET TOTAL & DIBUAT BERSIH KEMBALI!");
  console.log("==================================================================");

  // Verifikasi Hitungan Baris
  const tables = [
    "M_Fakultas", "M_Jurusan", "M_Departemen", "M_Periode", "M_Role",
    "M_Jabatan", "M_Pembina", "M_Anggota", "M_Akun", "T_Kepengurusan",
    "T_Pengaturan", "T_Berita", "T_Kompetisi", "T_Proker", "T_Keuangan"
  ];
  for (const t of tables) {
    const c = await client.execute(`SELECT COUNT(*) as count FROM ${t}`);
    console.log(`   📦 ${t.padEnd(20)} : ${c.rows[0].count} data`);
  }
}

main().catch(err => {
  console.error("❌ Gagal reset database Turso:", err);
  process.exit(1);
});
