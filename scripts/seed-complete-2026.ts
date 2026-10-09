import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const rawMembers = [
  {
    "No": 1,
    "ID PERISAI": "PRN 0238",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Ketua Umum",
    "NamaLengkap": "Aisyah Ramadhani Muchlis",
    "Tempat, Tanggal Lahir": "Wamena, 02 Oktober 2004 ",
    "Fakultas": "FEB",
    "Program Studi/Jurusan": "Manajemen",
    "NIM/Stambuk": "2220230181",
    "Angkatan": 2023,
    "Email": "aisyahramadhani.m@gmail.com ",
    "No. Telepon/WA": "6281244899985",
    "Alamat": "BTP Blok G Baru ",
    "Linkedn": "linkedin.com/in/aisyahmuchlis",
    "Instagram": "instagram.com/aisyahmuchliis",
    "Hobi": "Organizing "
  },
  {
    "No": 2,
    "ID PERISAI": "PRN 0241",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Sekretaris Umum",
    "NamaLengkap": "Baiq Indar Pirayati",
    "Tempat, Tanggal Lahir": "Tammarunang, 17 Maret 2005",
    "Fakultas": "FKM",
    "Program Studi/Jurusan": "Kesehatan Masyarakat",
    "NIM/Stambuk": "14120230025",
    "Angkatan": 2023,
    "Email": "baiqindarp@gmail.com",
    "No. Telepon/WA": "6281243953198",
    "Alamat": "Pampang",
    "Linkedn": "linkedin.com/in/baiq-indar-p",
    "Instagram": "instagram.com/_baiqindar",
    "Hobi": "Menonton, membaca"
  },
  {
    "No": 3,
    "ID PERISAI": "PRN 0250",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Bendahara Umum",
    "NamaLengkap": "Muhammad Aidhil Aksan",
    "Tempat, Tanggal Lahir": "Tarakan, 18 Juli 2005",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020230308",
    "Angkatan": 2023,
    "Email": "aidilaksan0909@gmail.com",
    "No. Telepon/WA": "6285349500696",
    "Alamat": "Jl. Perkebunan Makassar",
    "Linkedn": "linkedin.com/in/muhammad-aidhil-aksan",
    "Instagram": "instagram.com/nomathnolifee",
    "Hobi": "Futsal, basket"
  },
  {
    "No": 4,
    "ID PERISAI": "PRN 0252",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Kepala Departemen PSDM",
    "NamaLengkap": "Muhammad Rafli",
    "Tempat, Tanggal Lahir": "Gura, 06 Desember 2002",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020230290",
    "Angkatan": 2023,
    "Email": "raflyofficial6122@gmail.com",
    "No. Telepon/WA": "6282246641848",
    "Alamat": "Moncongloe Bulu, Kec. Moncong Loe, Kab. Maros",
    "Linkedn": null,
    "Instagram": "instagram.com/appy_6122",
    "Hobi": "Futsal"
  },
  {
    "No": 5,
    "ID PERISAI": "PRN 0290",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli PSDM",
    "NamaLengkap": "Surya Putra Jie",
    "Tempat, Tanggal Lahir": "Motewe, 08 Agustus 2005",
    "Fakultas": "FP-BIOTAM",
    "Program Studi/Jurusan": "Agribisnis",
    "NIM/Stambuk": "8320240023",
    "Angkatan": 2024,
    "Email": "suryaputrajie123@gmail.com",
    "No. Telepon/WA": "6287847710655",
    "Alamat": "Jl. Sukaria 13C",
    "Linkedn": null,
    "Instagram": "instagram.com/suryaputra_j01",
    "Hobi": "Membaca, memasak, menyanyi, traveling"
  },
  {
    "No": 6,
    "ID PERISAI": "PRN 0291",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli PSDM",
    "NamaLengkap": "Wa Ode Aqilah",
    "Tempat, Tanggal Lahir": "Bau-Bau, 07 Oktober 2006",
    "Fakultas": "FKM",
    "Program Studi/Jurusan": "Kesehatan Masyarakat",
    "NIM/Stambuk": "14120240069",
    "Angkatan": 2024,
    "Email": "aqilahwaode07@gmail.com",
    "No. Telepon/WA": "6281356547094",
    "Alamat": "Makassar,Abdesir, Toa daeng III, Jln Mawar ",
    "Linkedn": "linkedin.com/in/wa-ode-aqilah",
    "Instagram": "instagram.com/aqil.ah0710",
    "Hobi": "Nonton"
  },
  {
    "No": 7,
    "ID PERISAI": "PRN 0274",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli PSDM",
    "NamaLengkap": "Asmalinda Azis",
    "Tempat, Tanggal Lahir": "Makassar, 22 Juni 2006",
    "Fakultas": "FSIKP",
    "Program Studi/Jurusan": "Ilmu Komunikasi",
    "NIM/Stambuk": "6520240014",
    "Angkatan": 2024,
    "Email": "asmlindazis@gmail.com",
    "No. Telepon/WA": "6281354539064",
    "Alamat": "Jln Sukamaju 8",
    "Linkedn": null,
    "Instagram": "instagram.com/asmlndazis",
    "Hobi": "Membaca"
  },
  {
    "No": 8,
    "ID PERISAI": "PRN 0255",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Kepala Departemen Media",
    "NamaLengkap": "Nahwa Kaka Saputra Anggareksa",
    "Tempat, Tanggal Lahir": "Kediri, 27 Februari 2005",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020230187",
    "Angkatan": 2023,
    "Email": "nahwanirzam@gmail.com",
    "No. Telepon/WA": "62895800794794",
    "Alamat": "BTN Bumi Taeng Permai Blok B3/No 17 ",
    "Linkedn": "linkedin.com/in/nahwa-kaka-saputra-anggareksa",
    "Instagram": "instagram.com/nhw_kka",
    "Hobi": "Membaca"
  },
  {
    "No": 9,
    "ID PERISAI": "PRN 0254",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Staf Ahli Media",
    "NamaLengkap": "Mutia Salianti",
    "Tempat, Tanggal Lahir": "Belopa, 16 Juni 2005",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020230223",
    "Angkatan": 2023,
    "Email": "mutiasaliantii@gmail.com",
    "No. Telepon/WA": "6285175122168",
    "Alamat": "Jl. Urip Sumoharjo",
    "Linkedn": "linkedin.com/in/mutia-salianti",
    "Instagram": "instagram.com/mutiasaliantiii",
    "Hobi": "Nonton"
  },
  {
    "No": 10,
    "ID PERISAI": "PRN 0272",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli Media",
    "NamaLengkap": "Anaway Maryam Tenrisompa",
    "Tempat, Tanggal Lahir": "Kendari, 21 Agustus 2004",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020230105",
    "Angkatan": 2023,
    "Email": "anawaymaryam2104@gmail.com",
    "No. Telepon/WA": "6281340928902",
    "Alamat": "Jl. Abdesir",
    "Linkedn": null,
    "Instagram": "instagram.com/anwaymrryam_",
    "Hobi": "Menggambar"
  },
  {
    "No": 11,
    "ID PERISAI": "PRN 0273",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli Media",
    "NamaLengkap": "Andi Muhammad Syahrizan",
    "Tempat, Tanggal Lahir": "Sebatik, 23 Maret 2005",
    "Fakultas": "FAI",
    "Program Studi/Jurusan": "HKI",
    "NIM/Stambuk": "5120230011",
    "Angkatan": 2023,
    "Email": "andisyahrizan23@gmail.com",
    "No. Telepon/WA": "6282159526508",
    "Alamat": "Komp. Griya batas kota Makassar-Maros",
    "Linkedn": "linkedin.com/in/andi-muhammad-syahrizan",
    "Instagram": "instagram.com/andysyahrzn",
    "Hobi": "Memancing"
  },
  {
    "No": 12,
    "ID PERISAI": "PRN 0281",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli Media",
    "NamaLengkap": "Muh. Fauzan Al Anshari",
    "Tempat, Tanggal Lahir": "Sorong , 7 September 2006",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020240250",
    "Angkatan": 2024,
    "Email": "fauzanalanshary247@gmail.com",
    "No. Telepon/WA": "6285217749332",
    "Alamat": "Makassar",
    "Linkedn": null,
    "Instagram": "instagram.com/fauzan.och",
    "Hobi": "Belajar"
  },
  {
    "No": 13,
    "ID PERISAI": "PRN 0288",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli Media",
    "NamaLengkap": "Putri Ananda Sagita",
    "Tempat, Tanggal Lahir": "Bira, 07 November 2003",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020230126",
    "Angkatan": 2023,
    "Email": "putrianandasagita07@gmail.com",
    "No. Telepon/WA": "6282346440433",
    "Alamat": "Jl. A.P Pettarani II Lr.7 No.2",
    "Linkedn": "linkedin.com/in/putri-ananda-sagita",
    "Instagram": "instagram.com/sghitaaa",
    "Hobi": "Nonton"
  },
  {
    "No": 14,
    "ID PERISAI": "PRN 0286",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli Media",
    "NamaLengkap": "Nabila Putri Lestari",
    "Tempat, Tanggal Lahir": "Tarakan, 29 Juni 2006",
    "Fakultas": "FKM",
    "Program Studi/Jurusan": "Kesehatan Masyarakat",
    "NIM/Stambuk": "14120240053",
    "Angkatan": 2024,
    "Email": "lestarinabila352@gmail.com",
    "No. Telepon/WA": "6285248227158",
    "Alamat": "Perum. Griya Safwa Blok B.18",
    "Linkedn": null,
    "Instagram": "instagram.com/nbilaptrilstri",
    "Hobi": "Nonton Anime dan mengedit"
  },
  {
    "No": 15,
    "ID PERISAI": "PRN 0239",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Kepala Departemen KOMPRES",
    "NamaLengkap": "Andi Yusliana",
    "Tempat, Tanggal Lahir": "Makassar, 01 Januari 2005",
    "Fakultas": "FF",
    "Program Studi/Jurusan": "Farmasi",
    "NIM/Stambuk": "15020230238",
    "Angkatan": 2023,
    "Email": "andiyusliana6@gmail.com ",
    "No. Telepon/WA": "6285825273482",
    "Alamat": "Jl. Babussalam 1 No 20",
    "Linkedn": null,
    "Instagram": "instagram.com/andiyusliana01",
    "Hobi": "Baca novel"
  },
  {
    "No": 16,
    "ID PERISAI": "PRN 0235",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Staf Ahli KOMPRES",
    "NamaLengkap": "A. Aisya Sulistina",
    "Tempat, Tanggal Lahir": "Samaenre, 22 Juli 2003",
    "Fakultas": "FF",
    "Program Studi/Jurusan": "Farmasi",
    "NIM/Stambuk": "15020230196",
    "Angkatan": 2023,
    "Email": "aisyasulistinaa@gmail.con",
    "No. Telepon/WA": "6281253728464",
    "Alamat": "Kaluku Bodoa Residence A5",
    "Linkedn": null,
    "Instagram": "instagram.com/aisyasulistina",
    "Hobi": "Basket, dengar lagu, shoping"
  },
  {
    "No": 17,
    "ID PERISAI": "PRN 0243",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Staf Ahli KOMPRES",
    "NamaLengkap": "Faradilla Ramadania Iski Thalib",
    "Tempat, Tanggal Lahir": "Manokwari, 19 Oktober 2004",
    "Fakultas": "FF",
    "Program Studi/Jurusan": "Farmasi",
    "NIM/Stambuk": "15020230204",
    "Angkatan": 2023,
    "Email": "faradillarit@gmail.com",
    "No. Telepon/WA": "6281248849312",
    "Alamat": "Jl. Pampang 2",
    "Linkedn": "linkedin.com/in/faradilla-ramadania",
    "Instagram": "instagram.com/aesfara",
    "Hobi": "Membaca & menulis "
  },
  {
    "No": 18,
    "ID PERISAI": "PRN 0263",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Staf Ahli KOMPRES",
    "NamaLengkap": "Nuratika",
    "Tempat, Tanggal Lahir": "Bantaeng, 09 Oktober 2005",
    "Fakultas": "FF",
    "Program Studi/Jurusan": "Farmasi",
    "NIM/Stambuk": "15020230222",
    "Angkatan": 2023,
    "Email": "09nuratikausman@gmail.com ",
    "No. Telepon/WA": "6287842198755",
    "Alamat": "Bumi Tamalanrea Permai",
    "Linkedn": null,
    "Instagram": "instagram.com/nnaatikaa",
    "Hobi": "Membaca"
  },
  {
    "No": 19,
    "ID PERISAI": "PRN 0251",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Staf Ahli KOMPRES",
    "NamaLengkap": "Muhammad Aidil",
    "Tempat, Tanggal Lahir": "Padang Sappa, 28 September 2005",
    "Fakultas": "FAI",
    "Program Studi/Jurusan": "HKI",
    "NIM/Stambuk": "5120230021",
    "Angkatan": 2023,
    "Email": "muhammadaidil28092005@gmail.com",
    "No. Telepon/WA": "6282393844495",
    "Alamat": "Jl. Urip Sumoharjo",
    "Linkedn": null,
    "Instagram": "instagram.com/mhaidilll19",
    "Hobi": "Nonton, traveling"
  },
  {
    "No": 20,
    "ID PERISAI": "PRN 0271",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli KOMPRES",
    "NamaLengkap": "Ainun Nurul Safitri",
    "Tempat, Tanggal Lahir": "Soppeng, 02 November 2005",
    "Fakultas": "FKM",
    "Program Studi/Jurusan": "Kesehatan Masyarakat",
    "NIM/Stambuk": "14120240054",
    "Angkatan": 2024,
    "Email": "mufira47@gmail.com",
    "No. Telepon/WA": "6281250176833",
    "Alamat": " Jl Setuju, Tamalanrea",
    "Linkedn": "linkedin.com/in/ainun-nurul",
    "Instagram": "instagram.com/ainunnrlsafitri",
    "Hobi": "Memasak, membaca novel, nonton film"
  },
  {
    "No": 21,
    "ID PERISAI": "PRN 0277",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli KOMPRES",
    "NamaLengkap": "Fadil Angga Saputra",
    "Tempat, Tanggal Lahir": "Sinjai, 29 Desember 2005",
    "Fakultas": "FSIKP",
    "Program Studi/Jurusan": "Ilmu Komunikasi",
    "NIM/Stambuk": "652040074",
    "Angkatan": 2024,
    "Email": "fadilanggasaputrraa@gmail.com ",
    "No. Telepon/WA": "6285796138072",
    "Alamat": "Moncongloe Maros",
    "Linkedn": null,
    "Instagram": "instagram.com/fadilanggasaputra",
    "Hobi": "Membaca , menulis, berenang , bulu tangkis"
  },
  {
    "No": 22,
    "ID PERISAI": "PRN 0284",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli KOMPRES",
    "NamaLengkap": "Hilal S. Ahmad",
    "Tempat, Tanggal Lahir": "Ternate, 30 Maret 2007",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020240267",
    "Angkatan": 2024,
    "Email": "hilalbsa7@gmail.com",
    "No. Telepon/WA": "6287865105912",
    "Alamat": "Jl. tupai lorong 14 no 4",
    "Linkedn": null,
    "Instagram": "instagram.com/_hilalbsa",
    "Hobi": "Menjelajahi hal baru dan mengeksplor tempat\" baru"
  },
  {
    "No": 23,
    "ID PERISAI": "PRN 0265",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Kepala Departemen HUMAS",
    "NamaLengkap": "Risha Dwi Pangestu",
    "Tempat, Tanggal Lahir": "Pontianak, 23 September 2005",
    "Fakultas": "FKM",
    "Program Studi/Jurusan": "Kesehatan Masyarakat",
    "NIM/Stambuk": "14120230046",
    "Angkatan": 2023,
    "Email": "rishadwipangestu469@gmail.com",
    "No. Telepon/WA": "6285388943636",
    "Alamat": "Jl. Tallasalapang, Aluddin",
    "Linkedn": "linkedin.com/in/risha-dwi-pangestu",
    "Instagram": "instagram.com/rishadwpngst",
    "Hobi": "Baca buku"
  },
  {
    "No": 24,
    "ID PERISAI": "PRN 0236",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Staf Ahli HUMAS",
    "NamaLengkap": "Achmad Ersyad",
    "Tempat, Tanggal Lahir": "Makassar, 16 Agustus 2005",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020230312",
    "Angkatan": 2023,
    "Email": "achmadersy16@gmail.com",
    "No. Telepon/WA": "6285340379174",
    "Alamat": "Jl. Maros Raya Blok B 51A",
    "Linkedn": null,
    "Instagram": "instagram.com/achmad_ersyad",
    "Hobi": "Travelling, olahraga, nonton"
  },
  {
    "No": 25,
    "ID PERISAI": "PRN 0278",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli HUMAS",
    "NamaLengkap": "La Ode Ahmad Dinajad",
    "Tempat, Tanggal Lahir": "Raha, 22 Juli 2006",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020240239",
    "Angkatan": 2024,
    "Email": "ahmaddinajad09@gmail.com",
    "No. Telepon/WA": "6283838557227",
    "Alamat": "Jl.Pampang 4",
    "Linkedn": null,
    "Instagram": "instagram.com/_dnajad",
    "Hobi": "Membaca, Olahraga"
  },
  {
    "No": 26,
    "ID PERISAI": "PRN 0285",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli HUMAS",
    "NamaLengkap": "Muh Zulkifli Hasril",
    "Tempat, Tanggal Lahir": "Makassar, 8 Februari 2006",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020240266",
    "Angkatan": 2024,
    "Email": "kipelcuy@gmail.com",
    "No. Telepon/WA": "6282344442793",
    "Alamat": "Jl. Borong Raya Baru 2",
    "Linkedn": null,
    "Instagram": "instagram.com/kipelll_",
    "Hobi": "Baca Komik"
  },
  {
    "No": 27,
    "ID PERISAI": "PRN 0275",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli HUMAS",
    "NamaLengkap": "Aswar Kurniawan",
    "Tempat, Tanggal Lahir": "Kolaka, 8 Mei 2005",
    "Fakultas": "FP-BIOTAM",
    "Program Studi/Jurusan": "Agroteknologi",
    "NIM/Stambuk": "8220240030",
    "Angkatan": 2024,
    "Email": "aswark235@gmail.com",
    "No. Telepon/WA": "6281244684880",
    "Alamat": "Perumahan Surandar 3 Samata , Gowa",
    "Linkedn": "linkedin.com/in/aswar-kurniawan",
    "Instagram": "instagram.com/aswarkurniawan_",
    "Hobi": "Menyanyi, menggambar, badminton "
  },
  {
    "No": 28,
    "ID PERISAI": "PRN 0279",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli HUMAS",
    "NamaLengkap": "La Ode Muh. Dhefan Kasyfillah",
    "Tempat, Tanggal Lahir": "Raha , 28 Maret 2005",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020230232",
    "Angkatan": 2023,
    "Email": "la.ode.muh.dhefan.01@gmail.com",
    "No. Telepon/WA": "6282214958313",
    "Alamat": "Pampang",
    "Linkedn": "linkedin.com/in/La-Ode-Muhammad-Dhaifan-Kasyfillah",
    "Instagram": "instagram.com/laodedhefan",
    "Hobi": "Olahraga"
  },
  {
    "No": 29,
    "ID PERISAI": "PRN 0289",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli HUMAS",
    "NamaLengkap": "Siti Nur Azizah",
    "Tempat, Tanggal Lahir": "Makassar, 15 Mei 2005",
    "Fakultas": "FKM",
    "Program Studi/Jurusan": "Kesehatan Masyarakat",
    "NIM/Stambuk": "14120230094",
    "Angkatan": 2023,
    "Email": "sitinurazizahas8095964@gmail.com",
    "No. Telepon/WA": "6287755703384",
    "Alamat": "Jl. Paccerakkang No.87",
    "Linkedn": null,
    "Instagram": "instagram.com/zizah_r13",
    "Hobi": "Memasak, Nonton film, Dengar musik, Baking kue"
  },
  {
    "No": 30,
    "ID PERISAI": "PRN 0253",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Kepala Departemen RISTEK",
    "NamaLengkap": "Muhammad Rifky Saputra Scania",
    "Tempat, Tanggal Lahir": "Balikpapan, 02 Mei 2004",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020230193",
    "Angkatan": 2023,
    "Email": "rifky020504@gmail.com",
    "No. Telepon/WA": "6289503393609",
    "Alamat": "BTN Griya Maccopa Maros indah Blok F2 No1 ",
    "Linkedn": "www.linkedin.com/in/muhammad-rifky-saputra-scania",
    "Instagram": "instagram.com/justrifkyy_",
    "Hobi": "Menulis"
  },
  {
    "No": 31,
    "ID PERISAI": "PRN 0258",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Staf Ahli RISTEK",
    "NamaLengkap": "Nayla Ananda",
    "Tempat, Tanggal Lahir": "Pare-Pare, 19 Januari 2005",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020230112",
    "Angkatan": 2023,
    "Email": "naylaananda91@sma.belajar.id",
    "No. Telepon/WA": "6282317780847",
    "Alamat": "Jl. Ance Daeng Ngoyo Komp D'Boulevard Blok C7",
    "Linkedn": "linkedin.com/in/nayla-ananda",
    "Instagram": "instagram.com/naylaanandaa_",
    "Hobi": "Nonton"
  },
  {
    "No": 32,
    "ID PERISAI": "PRN 0259",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Staf Ahli RISTEK",
    "NamaLengkap": "Ni'matun Nayiroh",
    "Tempat, Tanggal Lahir": "Malang, 12 Mei 2005",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020230262",
    "Angkatan": 2023,
    "Email": "nayynima@gmail.com",
    "No. Telepon/WA": "6285853515150",
    "Alamat": "Jl. Lavender Kel. Pettuadae Kec. Turikale Kab. Maros",
    "Linkedn": "linkedin.com/in/nimatun-nayiro",
    "Instagram": "instagram.com/_nikmaa.nay",
    "Hobi": "Menulis, membaca, travelling"
  },
  {
    "No": 33,
    "ID PERISAI": "PRN 0267",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Staf Ahli RISTEK",
    "NamaLengkap": "Rizqi Ananda Jalil",
    "Tempat, Tanggal Lahir": "Makassar, 26 Desember 2003",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020230244",
    "Angkatan": 2023,
    "Email": "rizqianandajalileducation@gmail.com",
    "No. Telepon/WA": "6282188094861",
    "Alamat": "Jl. Dg Kuling No. 4, Parang Tambung, Kec. Tamalate",
    "Linkedn": "linkedin.com/in/rizqi-ananda-jalil",
    "Instagram": "instagram.com/rizqianandajalil_",
    "Hobi": "Menulis"
  },
  {
    "No": 34,
    "ID PERISAI": "PRN 0270",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli RISTEK",
    "NamaLengkap": "A. Nurul Fauziah Az-zahra ",
    "Tempat, Tanggal Lahir": "Sorowako . 10 Februari 2006",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020240128",
    "Angkatan": 2024,
    "Email": "andinurulfauziah87@gmail.com ",
    "No. Telepon/WA": "6285183241025",
    "Alamat": "Rusunawa UMI",
    "Linkedn": "linkedin.com/in/andinurulfauziah",
    "Instagram": "instagram.com/fauziiiaah.az",
    "Hobi": "Membaca, menonton, jalan jalan"
  },
  {
    "No": 35,
    "ID PERISAI": "PRN 0283",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli RISTEK",
    "NamaLengkap": "Muhammad Adrian",
    "Tempat, Tanggal Lahir": "Kendari, 14 Mei 2006",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020240262",
    "Angkatan": 2024,
    "Email": "muhammadadrianriab675@gmail.com",
    "No. Telepon/WA": "6295333696572",
    "Alamat": "Jl. Pampang 1",
    "Linkedn": null,
    "Instagram": "instagram.com/simply.ryann_",
    "Hobi": "Merenung, Membaca, Hiking, Sepak Bola, Badminton"
  },
  {
    "No": 36,
    "ID PERISAI": "PRN 0280",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli RISTEK",
    "NamaLengkap": "Leon Octa Pratama",
    "Tempat, Tanggal Lahir": "Kendari, 31 Oktober 2004",
    "Fakultas": "FIKOM",
    "Program Studi/Jurusan": "Teknik Informatika",
    "NIM/Stambuk": "13020240269",
    "Angkatan": 2024,
    "Email": "leonpratama19@gmail.com",
    "No. Telepon/WA": "6285346393418",
    "Alamat": "Jl. RSI Faisal XVII",
    "Linkedn": "www.linkedin.com/in/leon-octa-pratama",
    "Instagram": "instagram.com/leonpratamaa",
    "Hobi": "Nonton "
  },
  {
    "No": 37,
    "ID PERISAI": "PRN 0262",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Kepala Departemen Penalaran",
    "NamaLengkap": "Nur Eka Saputri",
    "Tempat, Tanggal Lahir": "Makassar, 25 Agustus 2004",
    "Fakultas": "FKM",
    "Program Studi/Jurusan": "Kesehatan Masyarakat",
    "NIM/Stambuk": "14120230036",
    "Angkatan": 2023,
    "Email": "nurekasaputri43@gmail.com",
    "No. Telepon/WA": "6281242860657",
    "Alamat": "Jln. Kandea 3",
    "Linkedn": "linkedin.com/in/nur-eka-saputri",
    "Instagram": "instagram.com/nureka.saputri",
    "Hobi": "Traveling"
  },
  {
    "No": 38,
    "ID PERISAI": "PRN 0240",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Staf Ahli Penalaran",
    "NamaLengkap": "Anisha Az-Zahrah",
    "Tempat, Tanggal Lahir": "Biak, 05 November 2005",
    "Fakultas": "FKM",
    "Program Studi/Jurusan": "Kesehatan Masyarakat",
    "NIM/Stambuk": "14120230029",
    "Angkatan": 2023,
    "Email": "azzahraannisa1128@gmail.com",
    "No. Telepon/WA": "6282371593486",
    "Alamat": "Jl. Arif Rahman Hakim ",
    "Linkedn": "linkedin.com/in/anisha-az-zahrah",
    "Instagram": "instagram.com/anishaazzahrah",
    "Hobi": "Olahraga"
  },
  {
    "No": 39,
    "ID PERISAI": "PRN 0237",
    "Generasi": 10,
    "Tugas dan Tanggung Jawab": "Staf Ahli Penalaran",
    "NamaLengkap": "Afifa Turrofiah",
    "Tempat, Tanggal Lahir": "Kalitata, 24 Maret 2005",
    "Fakultas": "FAI",
    "Program Studi/Jurusan": "PGMI",
    "NIM/Stambuk": "10620230014",
    "Angkatan": 2023,
    "Email": "ifaafifa699@gmail.com",
    "No. Telepon/WA": "6285338380232",
    "Alamat": "BTN Hamzy",
    "Linkedn": null,
    "Instagram": "instagram.com/afifa3122",
    "Hobi": "Membaca, memasak, travelling"
  },
  {
    "No": 40,
    "ID PERISAI": "PRN 0276",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli Penalaran",
    "NamaLengkap": "Elsa Salsabila",
    "Tempat, Tanggal Lahir": "Bontang , 26 Agustus 2005",
    "Fakultas": "FKM",
    "Program Studi/Jurusan": "Kesehatan Masyarakat",
    "NIM/Stambuk": "14120240063",
    "Angkatan": 2024,
    "Email": "uumi33550@gmail.com",
    "No. Telepon/WA": "6285753423622",
    "Alamat": "Rusunawa UMI",
    "Linkedn": "linkedin.com/in/elsa-salsabila",
    "Instagram": "instagram.com/elsaslsb_",
    "Hobi": "Memasak , menyanyi , travelling"
  },
  {
    "No": 41,
    "ID PERISAI": "PRN 0287",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli Penalaran",
    "NamaLengkap": "Nurfauziah",
    "Tempat, Tanggal Lahir": "Bima , 25 September 2006",
    "Fakultas": "FTI",
    "Program Studi/Jurusan": "Teknik Pertambangan",
    "NIM/Stambuk": "9320240087",
    "Angkatan": 2024,
    "Email": "nurfaujia1509@gmail.com",
    "No. Telepon/WA": "6281263004906",
    "Alamat": "Tallo Lama",
    "Linkedn": "linkedin.com/in/Nur-Fauziah",
    "Instagram": "instagram.com/_zeeyyyyy",
    "Hobi": "Badminton"
  },
  {
    "No": 42,
    "ID PERISAI": "PRN 0282",
    "Generasi": 11,
    "Tugas dan Tanggung Jawab": "Staf Ahli Penalaran",
    "NamaLengkap": "Muh. Ishak Syam",
    "Tempat, Tanggal Lahir": "Saungeng, 20 Maret 2004",
    "Fakultas": "FP-BIOTAM",
    "Program Studi/Jurusan": "Agroteknologi",
    "NIM/Stambuk": "8220230025",
    "Angkatan": 2023,
    "Email": "muhishaksyam07@gmail.com",
    "No. Telepon/WA": "6281242708249",
    "Alamat": " Jl Perintis kemerdekaan no.3",
    "Linkedn": null,
    "Instagram": "instagram.com/muh.ishaksyam",
    "Hobi": "Membaca "
  }
];

function parseTTL(raw: string) {
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

  const monthMap: Record<string, string> = {
    januari: "01",
    februari: "02",
    maret: "03",
    april: "04",
    mei: "05",
    juni: "06",
    juli: "07",
    agustus: "08",
    september: "09",
    oktober: "10",
    november: "11",
    desember: "12",
  };

  const m = monthMap[mName] || "01";
  return { tempat, tanggal: `${y}-${m}-${d}` };
}

function normalizeUrl(url: string | null, base: "instagram" | "linkedin") {
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

function normalizePhone(raw: string | number | null) {
  if (!raw) return null;
  const s = String(raw).trim().replace(/[^0-9]/g, "");
  if (s.startsWith("62")) return `+${s}`;
  if (s.startsWith("0")) return `+62${s.slice(1)}`;
  return `+${s}`;
}

async function main() {
  const dbPath = path.resolve(process.cwd(), "psdm-db.db");
  console.log(`🔌 Opening SQLite Database: ${dbPath}`);
  const db = new DatabaseSync(dbPath);

  // 1. Eksekusi DDL Migration 002
  console.log("🚀 Executing DDL 002_complete_perisai_schema.sql...");
  const sql = fs.readFileSync(path.resolve(process.cwd(), "db/migrations/002_complete_perisai_schema.sql"), "utf-8");
  
  // Pisahkan perintah SQL berdasarkan semicolon
  const statements = sql
    .split(/;\s*$/m)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    db.exec(stmt);
  }
  console.log(`✅ Applied ${statements.length} migration statements to SQLite.`);

  // 2. Seeding Master Data
  console.log("🌱 Seeding Master Data (Fakultas, Jurusan, Departemen, Jabatan, Periode, Role)...");
  const now = Math.floor(Date.now() / 1000);

  // A. Fakultas
  const fakultasMap: Record<string, number> = {};
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
    { nama: "Fakultas Kedokteran", kode: "FK" },
    { nama: "Fakultas Kedokteran Gigi", kode: "FKG" },
    { nama: "Fakultas Hukum", kode: "FH" },
    { nama: "Fakultas Perikanan dan Ilmu Kelautan", kode: "FPIK" },
  ];

  for (const f of daftarFakultas) {
    db.prepare(`
      INSERT INTO M_Fakultas (nama_fakultas, kode_fakultas, created_at, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(nama_fakultas) DO UPDATE SET kode_fakultas=excluded.kode_fakultas
    `).run(f.nama, f.kode, now, now);

    const row = db.prepare("SELECT id_fakultas FROM M_Fakultas WHERE kode_fakultas = ?").get(f.kode) as { id_fakultas: number };
    fakultasMap[f.kode] = row.id_fakultas;
  }

  // B. Jurusan
  const jurusanMap: Record<string, number> = {};
  const daftarJurusan = [
    { nama: "Manajemen", fakKode: "FEB", jenjang: "S1" },
    { nama: "Kesehatan Masyarakat", fakKode: "FKM", jenjang: "S1" },
    { nama: "Teknik Informatika", fakKode: "FIKOM", jenjang: "S1" },
    { nama: "Sistem Informasi", fakKode: "FIKOM", jenjang: "S1" },
    { nama: "Agribisnis", fakKode: "FP-BIOTAM", jenjang: "S1" },
    { nama: "Agroteknologi", fakKode: "FP-BIOTAM", jenjang: "S1" },
    { nama: "Ilmu Komunikasi", fakKode: "FSIKP", jenjang: "S1" },
    { nama: "HKI", fakKode: "FAI", jenjang: "S1" },
    { nama: "PGMI", fakKode: "FAI", jenjang: "S1" },
    { nama: "Farmasi", fakKode: "FF", jenjang: "S1" },
    { nama: "Teknik Pertambangan", fakKode: "FTI", jenjang: "S1" },
  ];

  for (const j of daftarJurusan) {
    const fakId = fakultasMap[j.fakKode];
    if (fakId) {
      db.prepare(`
        INSERT INTO M_Jurusan (id_fakultas, nama_jurusan, jenjang, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(fakId, j.nama, j.jenjang, now, now);

      const row = db.prepare("SELECT id_jurusan FROM M_Jurusan WHERE nama_jurusan = ? AND id_fakultas = ?").get(j.nama, fakId) as { id_jurusan: number };
      jurusanMap[j.nama] = row.id_jurusan;
    }
  }

  // C. Departemen
  const deptMap: Record<string, number> = {};
  const daftarDept = [
    { nama: "Badan Pengurus Harian", singkatan: "BPH", slug: "bph", tupoksi: "Pimpinan eksekutif dan pemegang kendali arah kebijakan organisasi.", urutan: 1 },
    { nama: "Pengembangan Sumber Daya Manusia", singkatan: "PSDM", slug: "psdm", tupoksi: "Kaderisasi, pengembangan kepemimpinan, dan kesejahteraan seluruh fungsionaris.", urutan: 2 },
    { nama: "Media dan Informasi", singkatan: "MEDIA", slug: "media", tupoksi: "Pusat kreasi visual, dokumentasi kegiatan, dan pengelolaan kanal digital.", urutan: 3 },
    { nama: "Kompetisi dan Prestasi", singkatan: "KOMPRES", slug: "kompres", tupoksi: "Mewadahi bimbingan perlombaan ilmiah, delegasi kompetisi, dan rekognisi prestasi.", urutan: 4 },
    { nama: "Hubungan Masyarakat", singkatan: "HUMAS", slug: "humas", tupoksi: "Menjalin relasi strategis, kemitraan lembaga, dan publikasi citra organisasi.", urutan: 5 },
    { nama: "Riset dan Teknologi", singkatan: "RISTEK", slug: "ristek", tupoksi: "Pusat inovasi rekayasa teknologi, penelitian terapan, dan hilirisasi karya riset.", urutan: 6 },
    { nama: "Penalaran dan Keilmuan", singkatan: "PENALARAN", slug: "penalaran", tupoksi: "Pengembangan budaya berpikir kritis, kajian ilmiah, dan forum diskusi akademis.", urutan: 7 },
    { nama: "Trisula Riset Strategis", singkatan: "TRISULA", slug: "trisula", tupoksi: "Garda khusus pengembangan riset strategis dan pengawalan prestasi unggulan.", urutan: 8 },
  ];

  for (const d of daftarDept) {
    db.prepare(`
      INSERT INTO M_Departemen (nama_departemen, singkatan, slug, tupoksi_utama, deskripsi_singkat, urutan, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET 
        nama_departemen=excluded.nama_departemen,
        singkatan=excluded.singkatan,
        tupoksi_utama=excluded.tupoksi_utama
    `).run(d.nama, d.singkatan, d.slug, d.tupoksi, d.tupoksi, d.urutan, now, now);

    const row = db.prepare("SELECT id_departemen FROM M_Departemen WHERE slug = ?").get(d.slug) as { id_departemen: number };
    deptMap[d.singkatan] = row.id_departemen;
  }

  // D. Periode 2026/2027
  db.prepare(`
    INSERT INTO M_Periode (nama_periode, tahun_mulai, tahun_selesai, is_active, tema_kepengurusan, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(nama_periode) DO UPDATE SET is_active=1
  `).run("2026/2027", 2026, 2027, 1, "Inovasi Kolaboratif Menuju Perisai Emas", now, now);

  const periodeRow = db.prepare("SELECT id_periode FROM M_Periode WHERE nama_periode = '2026/2027'").get() as { id_periode: number };
  const periodeId = periodeRow.id_periode;

  // E. Roles
  const roleMap: Record<string, number> = {};
  const daftarRoles = [
    { nama: "SUPER_ADMIN", label: "Super Administrator", desc: "Akses penuh seluruh sistem dan manajemen pengguna" },
    { nama: "BPH", label: "Badan Pengurus Harian", desc: "Akses pimpinan eksekutif dan keuangan" },
    { nama: "KADEP", label: "Kepala Departemen", desc: "Akses program kerja dan anggota divisi" },
    { nama: "EDITOR", label: "Editor Konten", desc: "Akses artikel berita, kompetisi, dan galeri" },
    { nama: "ANGGOTA", label: "Anggota Fungsionaris", desc: "Akses profil pribadi" },
  ];

  for (const r of daftarRoles) {
    db.prepare(`
      INSERT INTO M_Role (nama_role, label, deskripsi, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(nama_role) DO UPDATE SET label=excluded.label, deskripsi=excluded.deskripsi
    `).run(r.nama, r.label, r.desc, now, now);

    const row = db.prepare("SELECT id_role FROM M_Role WHERE nama_role = ?").get(r.nama) as { id_role: number };
    roleMap[r.nama] = row.id_role;
  }

  // F. Jabatan Standar
  const jabatanMap: Record<string, number> = {};
  const daftarJabatan = [
    { nama: "Ketua Umum", level: 1, urutan: 1 },
    { nama: "Sekretaris Umum", level: 2, urutan: 2 },
    { nama: "Bendahara Umum", level: 2, urutan: 3 },
    { nama: "Kepala Departemen", level: 3, urutan: 4 },
    { nama: "Staf Ahli", level: 4, urutan: 5 },
    { nama: "Anggota", level: 5, urutan: 6 },
  ];

  for (const j of daftarJabatan) {
    db.prepare(`
      INSERT INTO M_Jabatan (nama_jabatan, level_hirarki, urutan, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(j.nama, j.level, j.urutan, now, now);

    const row = db.prepare("SELECT id_jabatan FROM M_Jabatan WHERE nama_jabatan = ?").get(j.nama) as { id_jabatan: number };
    jabatanMap[j.nama] = row.id_jabatan;
  }

  // 3. Masukkan 42 Data Anggota, Akun & Kepengurusan
  console.log(`📥 Inserting ${rawMembers.length} Fungsionaris 2026-2027 into M_Anggota, M_Akun & T_Kepengurusan...`);
  
  // Default password hash: "perisai2026" (SHA-256 hash)
  const defaultPasswordHash = crypto.createHash("sha256").update("perisai2026").digest("hex");

  let orderIndex = 1;
  for (const m of rawMembers) {
    const prn = m["ID PERISAI"].trim();
    const nama = m["NamaLengkap"].trim();
    const nim = String(m["NIM/Stambuk"]).trim();
    const angkatan = Number(m["Angkatan"]) || 2023;
    const gen = Number(m["Generasi"]) || 10;
    const prodiName = m["Program Studi/Jurusan"].trim();
    const jurusanId = jurusanMap[prodiName] || null;

    const { tempat, tanggal } = parseTTL(m["Tempat, Tanggal Lahir"]);
    const email = m["Email"].trim();
    const noWa = normalizePhone(m["No. Telepon/WA"]);
    const alamat = m["Alamat"] ? m["Alamat"].trim() : null;
    const linkedin = normalizeUrl(m["Linkedn"], "linkedin");
    const instagram = normalizeUrl(m["Instagram"], "instagram");
    const hobi = m["Hobi"] ? m["Hobi"].trim() : null;
    const quotes = "Bergerak berinovasi, berkarakter memimpin.";

    // Insert M_Anggota
    db.prepare(`
      INSERT INTO M_Anggota (
        id_perisai, nama_lengkap, nim, id_jurusan, angkatan, gen,
        tempat_lahir, tanggal_lahir, email, no_wa, alamat,
        linkedin, instagram, hobi, quotes, foto_url, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'aktif', ?, ?)
      ON CONFLICT(id_perisai) DO UPDATE SET
        nama_lengkap=excluded.nama_lengkap,
        nim=excluded.nim,
        id_jurusan=excluded.id_jurusan,
        angkatan=excluded.angkatan,
        gen=excluded.gen,
        tempat_lahir=excluded.tempat_lahir,
        tanggal_lahir=excluded.tanggal_lahir,
        email=excluded.email,
        no_wa=excluded.no_wa,
        alamat=excluded.alamat,
        linkedin=excluded.linkedin,
        instagram=excluded.instagram,
        hobi=excluded.hobi
    `).run(
      prn, nama, nim, jurusanId, angkatan, gen,
      tempat, tanggal, email, noWa, alamat,
      linkedin, instagram, hobi, quotes, "/maskot.png",
      now, now
    );

    // Tentukan Jabatan & Departemen
    const tugas = m["Tugas dan Tanggung Jawab"].trim();
    let jabatanId = jabatanMap["Anggota"];
    let deptId: number | null = null;
    let roleId = roleMap["ANGGOTA"];

    if (tugas === "Ketua Umum") {
      jabatanId = jabatanMap["Ketua Umum"];
      deptId = deptMap["BPH"];
      roleId = roleMap["SUPER_ADMIN"];
    } else if (tugas === "Sekretaris Umum") {
      jabatanId = jabatanMap["Sekretaris Umum"];
      deptId = deptMap["BPH"];
      roleId = roleMap["BPH"];
    } else if (tugas === "Bendahara Umum") {
      jabatanId = jabatanMap["Bendahara Umum"];
      deptId = deptMap["BPH"];
      roleId = roleMap["BPH"];
    } else if (tugas.startsWith("Kepala Departemen")) {
      jabatanId = jabatanMap["Kepala Departemen"];
      roleId = roleMap["KADEP"];
      if (tugas.includes("PSDM")) deptId = deptMap["PSDM"];
      else if (tugas.includes("Media")) deptId = deptMap["MEDIA"];
      else if (tugas.includes("KOMPRES")) deptId = deptMap["KOMPRES"];
      else if (tugas.includes("HUMAS")) deptId = deptMap["HUMAS"];
      else if (tugas.includes("RISTEK")) deptId = deptMap["RISTEK"];
      else if (tugas.includes("Penalaran")) deptId = deptMap["PENALARAN"];
    } else if (tugas.startsWith("Staf Ahli")) {
      jabatanId = jabatanMap["Staf Ahli"];
      roleId = roleMap["EDITOR"];
      if (tugas.includes("PSDM")) deptId = deptMap["PSDM"];
      else if (tugas.includes("Media")) deptId = deptMap["MEDIA"];
      else if (tugas.includes("KOMPRES")) deptId = deptMap["KOMPRES"];
      else if (tugas.includes("HUMAS")) deptId = deptMap["HUMAS"];
      else if (tugas.includes("RISTEK")) deptId = deptMap["RISTEK"];
      else if (tugas.includes("Penalaran")) deptId = deptMap["PENALARAN"];
    }

    // Insert M_Akun
    db.prepare(`
      INSERT INTO M_Akun (id_perisai, id_role, password_hash, is_active, created_at, updated_at)
      VALUES (?, ?, ?, 1, ?, ?)
      ON CONFLICT(id_perisai) DO UPDATE SET id_role=excluded.id_role
    `).run(prn, roleId, defaultPasswordHash, now, now);

    // Insert T_Kepengurusan (Periode 2026/2027)
    db.prepare(`
      INSERT INTO T_Kepengurusan (id_periode, id_perisai, id_jabatan, id_departemen, status, urutan, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'aktif', ?, ?, ?)
      ON CONFLICT(id_periode, id_perisai, id_jabatan) DO UPDATE SET 
        id_departemen=excluded.id_departemen,
        urutan=excluded.urutan
    `).run(periodeId, prn, jabatanId, deptId, orderIndex++, now, now);
  }

  // 4. Sinkronisasi dengan tabel website lama agar langsung tampil di UI web!
  console.log("🔄 Synchronizing with web_members & web_periods so website UI immediately reflects this...");
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      nama TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS web_periods (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      start_date INTEGER NOT NULL,
      end_date INTEGER,
      is_current INTEGER NOT NULL DEFAULT 0
    );
    DROP TABLE IF EXISTS web_members;
    CREATE TABLE web_members (
      id TEXT PRIMARY KEY,
      period_id TEXT NOT NULL,
      department_id TEXT,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      tier TEXT NOT NULL DEFAULT 'staf',
      linkedin_url TEXT,
      photo_media_id TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );
  `);

  // Insert default departments for compatibility
  for (const d of daftarDept) {
    db.prepare(`
      INSERT OR IGNORE INTO departments (id, nama)
      VALUES (?, ?)
    `).run(d.slug, d.nama);
  }

  // Update web_periods
  db.prepare(`
    INSERT INTO web_periods (id, name, start_date, end_date, is_current)
    VALUES ('period-2026-2027', '2026/2027', 1767225600, 1798761600, 1)
    ON CONFLICT(id) DO UPDATE SET is_current=1
  `).run();

  // Re-insert into web_members
  const kepengurusanRows = db.prepare(`
    SELECT k.urutan, k.status, a.id_perisai, a.nama_lengkap, a.linkedin, j.nama_jabatan, d.singkatan, d.slug as dept_slug
    FROM T_Kepengurusan k
    JOIN M_Anggota a ON k.id_perisai = a.id_perisai
    JOIN M_Jabatan j ON k.id_jabatan = j.id_jabatan
    LEFT JOIN M_Departemen d ON k.id_departemen = d.id_departemen
    WHERE k.id_periode = ?
    ORDER BY k.urutan ASC
  `).all(periodeId) as Array<{
    urutan: number;
    status: string;
    id_perisai: string;
    nama_lengkap: string;
    linkedin: string | null;
    nama_jabatan: string;
    singkatan: string | null;
    dept_slug: string | null;
  }>;

  for (const row of kepengurusanRows) {
    let tier = "staf";
    if (row.nama_jabatan === "Ketua Umum" || row.nama_jabatan === "Sekretaris Umum" || row.nama_jabatan === "Bendahara Umum") {
      tier = "bph";
    } else if (row.nama_jabatan === "Kepala Departemen") {
      tier = "kadep";
    }

    const deptIdStr = row.dept_slug || null;

    db.prepare(`
      INSERT INTO web_members (id, period_id, department_id, name, position, tier, linkedin_url, sort_order, is_active)
      VALUES (?, 'period-2026-2027', ?, ?, ?, ?, ?, ?, 1)
    `).run(
      `mem-${row.id_perisai.replace(/\s+/g, "_")}`,
      deptIdStr,
      row.nama_lengkap,
      row.nama_jabatan + (row.singkatan && row.singkatan !== "BPH" ? ` ${row.singkatan}` : ""),
      tier,
      row.linkedin,
      row.urutan
    );
  }

  console.log("🎉 Seeding completed successfully! 21 Tables created & populated with 2026/2027 Kepengurusan.");
}

main().catch(err => {
  console.error("❌ Migration error:", err);
  process.exit(1);
});
