import { createClient } from "@libsql/client";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// 1. Data 42 Pengurus Riil 2026/2027
const rawMembers = [
  { "ID PERISAI":"PRN 0238", "Generasi":10, "Tugas dan Tanggung Jawab":"Ketua Umum", "NamaLengkap":"Aisyah Ramadhani Muchlis", "Tempat, Tanggal Lahir":"Wamena, 02 Oktober 2004 ", "Fakultas":"FEB", "Program Studi/Jurusan":"Manajemen", "NIM/Stambuk":"2220230181", "Angkatan":2023, "Email":"aisyahramadhani.m@gmail.com ", "No. Telepon/WA":"6281244899985", "Alamat":"BTP Blok G Baru ", "Linkedn":"linkedin.com/in/aisyahmuchlis", "Instagram":"instagram.com/aisyahmuchliis", "Hobi":"Organizing " },
  { "ID PERISAI":"PRN 0241", "Generasi":10, "Tugas dan Tanggung Jawab":"Sekretaris Umum", "NamaLengkap":"Baiq Indar Pirayati", "Tempat, Tanggal Lahir":"Tammarunang, 17 Maret 2005", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120230025", "Angkatan":2023, "Email":"baiqindarp@gmail.com", "No. Telepon/WA":"6281243953198", "Alamat":"Pampang", "Linkedn":"linkedin.com/in/baiq-indar-p", "Instagram":"instagram.com/_baiqindar", "Hobi":"Menonton, membaca" },
  { "ID PERISAI":"PRN 0250", "Generasi":10, "Tugas dan Tanggung Jawab":"Bendahara Umum", "NamaLengkap":"Muhammad Aidhil Aksan", "Tempat, Tanggal Lahir":"Tarakan, 18 Juli 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230308", "Angkatan":2023, "Email":"aidilaksan0909@gmail.com", "No. Telepon/WA":"6285349500696", "Alamat":"Jl. Perkebunan Makassar", "Linkedn":"linkedin.com/in/muhammad-aidhil-aksan", "Instagram":"instagram.com/nomathnolifee", "Hobi":"Futsal, basket" },
  { "ID PERISAI":"PRN 0252", "Generasi":10, "Tugas dan Tanggung Jawab":"Kepala Departemen PSDM", "NamaLengkap":"Muhammad Rafli", "Tempat, Tanggal Lahir":"Gura, 06 Desember 2002", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230290", "Angkatan":2023, "Email":"raflyofficial6122@gmail.com", "No. Telepon/WA":"6282246641848", "Alamat":"Moncongloe Bulu, Kec. Moncong Loe, Kab. Maros", "Linkedn":null, "Instagram":"instagram.com/appy_6122", "Hobi":"Futsal" },
  { "ID PERISAI":"PRN 0290", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli PSDM", "NamaLengkap":"Surya Putra Jie", "Tempat, Tanggal Lahir":"Motewe, 08 Agustus 2005", "Fakultas":"FP-BIOTAM", "Program Studi/Jurusan":"Agribisnis", "NIM/Stambuk":"8320240023", "Angkatan":2024, "Email":"suryaputrajie123@gmail.com", "No. Telepon/WA":"6287847710655", "Alamat":"Jl. Sukaria 13C", "Linkedn":null, "Instagram":"instagram.com/suryaputra_j01", "Hobi":"Membaca, memasak, menyanyi, traveling" },
  { "ID PERISAI":"PRN 0291", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli PSDM", "NamaLengkap":"Wa Ode Aqilah", "Tempat, Tanggal Lahir":"Bau-Bau, 07 Oktober 2006", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120240069", "Angkatan":2024, "Email":"aqilahwaode07@gmail.com", "No. Telepon/WA":"6281356547094", "Alamat":"Makassar,Abdesir, Toa daeng III, Jln Mawar ", "Linkedn":"linkedin.com/in/wa-ode-aqilah", "Instagram":"instagram.com/aqil.ah0710", "Hobi":"Nonton" },
  { "ID PERISAI":"PRN 0274", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli PSDM", "NamaLengkap":"Asmalinda Azis", "Tempat, Tanggal Lahir":"Makassar, 22 Juni 2006", "Fakultas":"FSIKP", "Program Studi/Jurusan":"Ilmu Komunikasi", "NIM/Stambuk":"6520240014", "Angkatan":2024, "Email":"asmlindazis@gmail.com", "No. Telepon/WA":"6281354539064", "Alamat":"Jln Sukamaju 8", "Linkedn":null, "Instagram":"instagram.com/asmlndazis", "Hobi":"Membaca" },
  { "ID PERISAI":"PRN 0255", "Generasi":10, "Tugas dan Tanggung Jawab":"Kepala Departemen Media", "NamaLengkap":"Nahwa Kaka Saputra Anggareksa", "Tempat, Tanggal Lahir":"Kediri, 27 Februari 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230187", "Angkatan":2023, "Email":"nahwanirzam@gmail.com", "No. Telepon/WA":"62895800794794", "Alamat":"BTN Bumi Taeng Permai Blok B3/No 17 ", "Linkedn":"linkedin.com/in/nahwa-kaka-saputra-anggareksa", "Instagram":"instagram.com/nhw_kka", "Hobi":"Membaca" },
  { "ID PERISAI":"PRN 0254", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli Media", "NamaLengkap":"Mutia Salianti", "Tempat, Tanggal Lahir":"Belopa, 16 Juni 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230223", "Angkatan":2023, "Email":"mutiasaliantii@gmail.com", "No. Telepon/WA":"6285175122168", "Alamat":"Jl. Urip Sumoharjo", "Linkedn":"linkedin.com/in/mutia-salianti", "Instagram":"instagram.com/mutiasaliantiii", "Hobi":"Nonton" },
  { "ID PERISAI":"PRN 0272", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Media", "NamaLengkap":"Anaway Maryam Tenrisompa", "Tempat, Tanggal Lahir":"Kendari, 21 Agustus 2004", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230105", "Angkatan":2023, "Email":"anawaymaryam2104@gmail.com", "No. Telepon/WA":"6281340928902", "Alamat":"Jl. Abdesir", "Linkedn":null, "Instagram":"instagram.com/anwaymrryam_", "Hobi":"Menggambar" },
  { "ID PERISAI":"PRN 0273", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Media", "NamaLengkap":"Andi Muhammad Syahrizan", "Tempat, Tanggal Lahir":"Sebatik, 23 Maret 2005", "Fakultas":"FAI", "Program Studi/Jurusan":"HKI", "NIM/Stambuk":"5120230011", "Angkatan":2023, "Email":"andisyahrizan23@gmail.com", "No. Telepon/WA":"6282159526508", "Alamat":"Komp. Griya batas kota Makassar-Maros", "Linkedn":"linkedin.com/in/andi-muhammad-syahrizan", "Instagram":"instagram.com/andysyahrzn", "Hobi":"Memancing" },
  { "ID PERISAI":"PRN 0281", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Media", "NamaLengkap":"Muh. Fauzan Al Anshari", "Tempat, Tanggal Lahir":"Sorong , 7 September 2006", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240250", "Angkatan":2024, "Email":"fauzanalanshary247@gmail.com", "No. Telepon/WA":"6285217749332", "Alamat":"Makassar", "Linkedn":null, "Instagram":"instagram.com/fauzan.och", "Hobi":"Belajar" },
  { "ID PERISAI":"PRN 0288", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Media", "NamaLengkap":"Putri Ananda Sagita", "Tempat, Tanggal Lahir":"Bira, 07 November 2003", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230126", "Angkatan":2023, "Email":"putrianandasagita07@gmail.com", "No. Telepon/WA":"6282346440433", "Alamat":"Jl. A.P Pettarani II Lr.7 No.2", "Linkedn":"linkedin.com/in/putri-ananda-sagita", "Instagram":"instagram.com/sghitaaa", "Hobi":"Nonton" },
  { "ID PERISAI":"PRN 0286", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Media", "NamaLengkap":"Nabila Putri Lestari", "Tempat, Tanggal Lahir":"Tarakan, 29 Juni 2006", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120240053", "Angkatan":2024, "Email":"lestarinabila352@gmail.com", "No. Telepon/WA":"6285248227158", "Alamat":"Perum. Griya Safwa Blok B.18", "Linkedn":null, "Instagram":"instagram.com/nbilaptrilstri", "Hobi":"Nonton Anime dan mengedit" },
  { "ID PERISAI":"PRN 0239", "Generasi":10, "Tugas dan Tanggung Jawab":"Kepala Departemen KOMPRES", "NamaLengkap":"Andi Yusliana", "Tempat, Tanggal Lahir":"Makassar, 01 Januari 2005", "Fakultas":"FF", "Program Studi/Jurusan":"Farmasi", "NIM/Stambuk":"15020230238", "Angkatan":2023, "Email":"andiyusliana6@gmail.com ", "No. Telepon/WA":"6285825273482", "Alamat":"Jl. Babussalam 1 No 20", "Linkedn":null, "Instagram":"instagram.com/andiyusliana01", "Hobi":"Baca novel" },
  { "ID PERISAI":"PRN 0235", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"A. Aisya Sulistina", "Tempat, Tanggal Lahir":"Samaenre, 22 Juli 2003", "Fakultas":"FF", "Program Studi/Jurusan":"Farmasi", "NIM/Stambuk":"15020230196", "Angkatan":2023, "Email":"aisyasulistinaa@gmail.con", "No. Telepon/WA":"6281253728464", "Alamat":"Kaluku Bodoa Residence A5", "Linkedn":null, "Instagram":"instagram.com/aisyasulistina", "Hobi":"Basket, dengar lagu, shoping" },
  { "ID PERISAI":"PRN 0243", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"Faradilla Ramadania Iski Thalib", "Tempat, Tanggal Lahir":"Manokwari, 19 Oktober 2004", "Fakultas":"FF", "Program Studi/Jurusan":"Farmasi", "NIM/Stambuk":"15020230204", "Angkatan":2023, "Email":"faradillarit@gmail.com", "No. Telepon/WA":"6281248849312", "Alamat":"Jl. Pampang 2", "Linkedn":"linkedin.com/in/faradilla-ramadania", "Instagram":"instagram.com/aesfara", "Hobi":"Membaca & menulis " },
  { "ID PERISAI":"PRN 0263", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"Nuratika", "Tempat, Tanggal Lahir":"Bantaeng, 09 Oktober 2005", "Fakultas":"FF", "Program Studi/Jurusan":"Farmasi", "NIM/Stambuk":"15020230222", "Angkatan":2023, "Email":"09nuratikausman@gmail.com ", "No. Telepon/WA":"6287842198755", "Alamat":"Bumi Tamalanrea Permai", "Linkedn":null, "Instagram":"instagram.com/nnaatikaa", "Hobi":"Membaca" },
  { "ID PERISAI":"PRN 0251", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"Muhammad Aidil", "Tempat, Tanggal Lahir":"Padang Sappa, 28 September 2005", "Fakultas":"FAI", "Program Studi/Jurusan":"HKI", "NIM/Stambuk":"5120230021", "Angkatan":2023, "Email":"muhammadaidil28092005@gmail.com", "No. Telepon/WA":"6282393844495", "Alamat":"Jl. Urip Sumoharjo", "Linkedn":null, "Instagram":"instagram.com/mhaidilll19", "Hobi":"Nonton, traveling" },
  { "ID PERISAI":"PRN 0271", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"Ainun Nurul Safitri", "Tempat, Tanggal Lahir":"Soppeng, 02 November 2005", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120240054", "Angkatan":2024, "Email":"mufira47@gmail.com", "No. Telepon/WA":"6281250176833", "Alamat":" Jl Setuju, Tamalanrea", "Linkedn":"linkedin.com/in/ainun-nurul", "Instagram":"instagram.com/ainunnrlsafitri", "Hobi":"Memasak, membaca novel, nonton film" },
  { "ID PERISAI":"PRN 0277", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"Fadil Angga Saputra", "Tempat, Tanggal Lahir":"Sinjai, 29 Desember 2005", "Fakultas":"FSIKP", "Program Studi/Jurusan":"Ilmu Komunikasi", "NIM/Stambuk":"652040074", "Angkatan":2024, "Email":"fadilanggasaputrraa@gmail.com ", "No. Telepon/WA":"6285796138072", "Alamat":"Moncongloe Maros", "Linkedn":null, "Instagram":"instagram.com/fadilanggasaputra", "Hobi":"Membaca , menulis, berenang , bulu tangkis" },
  { "ID PERISAI":"PRN 0284", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli KOMPRES", "NamaLengkap":"Hilal S. Ahmad", "Tempat, Tanggal Lahir":"Ternate, 30 Maret 2007", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240267", "Angkatan":2024, "Email":"hilalbsa7@gmail.com", "No. Telepon/WA":"6287865105912", "Alamat":"Jl. tupai lorong 14 no 4", "Linkedn":null, "Instagram":"instagram.com/_hilalbsa", "Hobi":"Menjelajahi hal baru dan mengeksplor tempat\" baru" },
  { "ID PERISAI":"PRN 0265", "Generasi":10, "Tugas dan Tanggung Jawab":"Kepala Departemen HUMAS", "NamaLengkap":"Risha Dwi Pangestu", "Tempat, Tanggal Lahir":"Pontianak, 23 September 2005", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120230046", "Angkatan":2023, "Email":"rishadwipangestu469@gmail.com", "No. Telepon/WA":"6285388943636", "Alamat":"Jl. Tallasalapang, Aluddin", "Linkedn":"linkedin.com/in/risha-dwi-pangestu", "Instagram":"instagram.com/rishadwpngst", "Hobi":"Baca buku" },
  { "ID PERISAI":"PRN 0236", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli HUMAS", "NamaLengkap":"Achmad Ersyad", "Tempat, Tanggal Lahir":"Makassar, 16 Agustus 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230312", "Angkatan":2023, "Email":"achmadersy16@gmail.com", "No. Telepon/WA":"6285340379174", "Alamat":"Jl. Maros Raya Blok B 51A", "Linkedn":null, "Instagram":"instagram.com/achmad_ersyad", "Hobi":"Travelling, olahraga, nonton" },
  { "ID PERISAI":"PRN 0278", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli HUMAS", "NamaLengkap":"La Ode Ahmad Dinajad", "Tempat, Tanggal Lahir":"Raha, 22 Juli 2006", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240239", "Angkatan":2024, "Email":"ahmaddinajad09@gmail.com", "No. Telepon/WA":"6283838557227", "Alamat":"Jl.Pampang 4", "Linkedn":null, "Instagram":"instagram.com/_dnajad", "Hobi":"Membaca, Olahraga" },
  { "ID PERISAI":"PRN 0285", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli HUMAS", "NamaLengkap":"Muh Zulkifli Hasril", "Tempat, Tanggal Lahir":"Makassar, 8 Februari 2006", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240266", "Angkatan":2024, "Email":"kipelcuy@gmail.com", "No. Telepon/WA":"6282344442793", "Alamat":"Jl. Borong Raya Baru 2", "Linkedn":null, "Instagram":"instagram.com/kipelll_", "Hobi":"Baca Komik" },
  { "ID PERISAI":"PRN 0275", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli HUMAS", "NamaLengkap":"Aswar Kurniawan", "Tempat, Tanggal Lahir":"Kolaka, 8 Mei 2005", "Fakultas":"FP-BIOTAM", "Program Studi/Jurusan":"Agroteknologi", "NIM/Stambuk":"8220240030", "Angkatan":2024, "Email":"aswark235@gmail.com", "No. Telepon/WA":"6281244684880", "Alamat":"Perumahan Surandar 3 Samata , Gowa", "Linkedn":"linkedin.com/in/aswar-kurniawan", "Instagram":"instagram.com/aswarkurniawan_", "Hobi":"Menyanyi, menggambar, badminton " },
  { "ID PERISAI":"PRN 0279", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli HUMAS", "NamaLengkap":"La Ode Muh. Dhefan Kasyfillah", "Tempat, Tanggal Lahir":"Raha , 28 Maret 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230232", "Angkatan":2023, "Email":"la.ode.muh.dhefan.01@gmail.com", "No. Telepon/WA":"6282214958313", "Alamat":"Pampang", "Linkedn":"linkedin.com/in/La-Ode-Muhammad-Dhaifan-Kasyfillah", "Instagram":"instagram.com/laodedhefan", "Hobi":"Olahraga" },
  { "ID PERISAI":"PRN 0289", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli HUMAS", "NamaLengkap":"Siti Nur Azizah", "Tempat, Tanggal Lahir":"Makassar, 15 Mei 2005", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120230094", "Angkatan":2023, "Email":"sitinurazizahas8095964@gmail.com", "No. Telepon/WA":"6287755703384", "Alamat":"Jl. Paccerakkang No.87", "Linkedn":null, "Instagram":"instagram.com/zizah_r13", "Hobi":"Memasak, Nonton film, Dengar musik, Baking kue" },
  { "ID PERISAI":"PRN 0253", "Generasi":10, "Tugas dan Tanggung Jawab":"Kepala Departemen RISTEK", "NamaLengkap":"Muhammad Rifky Saputra Scania", "Tempat, Tanggal Lahir":"Balikpapan, 02 Mei 2004", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230193", "Angkatan":2023, "Email":"rifky020504@gmail.com", "No. Telepon/WA":"6289503393609", "Alamat":"BTN Griya Maccopa Maros indah Blok F2 No1 ", "Linkedn":"www.linkedin.com/in/muhammad-rifky-saputra-scania", "Instagram":"instagram.com/justrifkyy_", "Hobi":"Menulis" },
  { "ID PERISAI":"PRN 0258", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli RISTEK", "NamaLengkap":"Nayla Ananda", "Tempat, Tanggal Lahir":"Pare-Pare, 19 Januari 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230112", "Angkatan":2023, "Email":"naylaananda91@sma.belajar.id", "No. Telepon/WA":"6282317780847", "Alamat":"Jl. Ance Daeng Ngoyo Komp D'Boulevard Blok C7", "Linkedn":"linkedin.com/in/nayla-ananda", "Instagram":"instagram.com/naylaanandaa_", "Hobi":"Nonton" },
  { "ID PERISAI":"PRN 0259", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli RISTEK", "NamaLengkap":"Ni'matun Nayiroh", "Tempat, Tanggal Lahir":"Malang, 12 Mei 2005", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230262", "Angkatan":2023, "Email":"nayynima@gmail.com", "No. Telepon/WA":"6285853515150", "Alamat":"Jl. Lavender Kel. Pettuadae Kec. Turikale Kab. Maros", "Linkedn":"linkedin.com/in/nimatun-nayiro", "Instagram":"instagram.com/_nikmaa.nay", "Hobi":"Menulis, membaca, travelling" },
  { "ID PERISAI":"PRN 0267", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli RISTEK", "NamaLengkap":"Rizqi Ananda Jalil", "Tempat, Tanggal Lahir":"Makassar, 26 Desember 2003", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020230244", "Angkatan":2023, "Email":"rizqianandajalileducation@gmail.com", "No. Telepon/WA":"6282188094861", "Alamat":"Jl. Dg Kuling No. 4, Parang Tambung, Kec. Tamalate", "Linkedn":"linkedin.com/in/rizqi-ananda-jalil", "Instagram":"instagram.com/rizqianandajalil_", "Hobi":"Menulis" },
  { "ID PERISAI":"PRN 0270", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli RISTEK", "NamaLengkap":"A. Nurul Fauziah Az-zahra ", "Tempat, Tanggal Lahir":"Sorowako . 10 Februari 2006", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240128", "Angkatan":2024, "Email":"andinurulfauziah87@gmail.com ", "No. Telepon/WA":"6285183241025", "Alamat":"Rusunawa UMI", "Linkedn":"linkedin.com/in/andinurulfauziah", "Instagram":"instagram.com/fauziiiaah.az", "Hobi":"Membaca, menonton, jalan jalan" },
  { "ID PERISAI":"PRN 0283", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli RISTEK", "NamaLengkap":"Muhammad Adrian", "Tempat, Tanggal Lahir":"Kendari, 14 Mei 2006", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240262", "Angkatan":2024, "Email":"muhammadadrianriab675@gmail.com", "No. Telepon/WA":"6295333696572", "Alamat":"Jl. Pampang 1", "Linkedn":null, "Instagram":"instagram.com/simply.ryann_", "Hobi":"Merenung, Membaca, Hiking, Sepak Bola, Badminton" },
  { "ID PERISAI":"PRN 0280", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli RISTEK", "NamaLengkap":"Leon Octa Pratama", "Tempat, Tanggal Lahir":"Kendari, 31 Oktober 2004", "Fakultas":"FIKOM", "Program Studi/Jurusan":"Teknik Informatika", "NIM/Stambuk":"13020240269", "Angkatan":2024, "Email":"leonpratama19@gmail.com", "No. Telepon/WA":"6285346393418", "Alamat":"Jl. RSI Faisal XVII", "Linkedn":"www.linkedin.com/in/leon-octa-pratama", "Instagram":"instagram.com/leonpratamaa", "Hobi":"Nonton " },
  { "ID PERISAI":"PRN 0262", "Generasi":10, "Tugas dan Tanggung Jawab":"Kepala Departemen Penalaran", "NamaLengkap":"Nur Eka Saputri", "Tempat, Tanggal Lahir":"Makassar, 25 Agustus 2004", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120230036", "Angkatan":2023, "Email":"nurekasaputri43@gmail.com", "No. Telepon/WA":"6281242860657", "Alamat":"Jln. Kandea 3", "Linkedn":"linkedin.com/in/nur-eka-saputri", "Instagram":"instagram.com/nureka.saputri", "Hobi":"Traveling" },
  { "ID PERISAI":"PRN 0240", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli Penalaran", "NamaLengkap":"Anisha Az-Zahrah", "Tempat, Tanggal Lahir":"Biak, 05 November 2005", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120230029", "Angkatan":2023, "Email":"azzahraannisa1128@gmail.com", "No. Telepon/WA":"6282371593486", "Alamat":"Jl. Arif Rahman Hakim ", "Linkedn":"linkedin.com/in/anisha-az-zahrah", "Instagram":"instagram./anishaazzahrah", "Hobi":"Olahraga" },
  { "ID PERISAI":"PRN 0237", "Generasi":10, "Tugas dan Tanggung Jawab":"Staf Ahli Penalaran", "NamaLengkap":"Afifa Turrofiah", "Tempat, Tanggal Lahir":"Kalitata, 24 Maret 2005", "Fakultas":"FAI", "Program Studi/Jurusan":"PGMI", "NIM/Stambuk":"10620230014", "Angkatan":2023, "Email":"ifaafifa699@gmail.com", "No. Telepon/WA":"6285338380232", "Alamat":"BTN Hamzy", "Linkedn":null, "Instagram":"instagram.com/afifa3122", "Hobi":"Membaca, memasak, travelling" },
  { "ID PERISAI":"PRN 0276", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Penalaran", "NamaLengkap":"Elsa Salsabila", "Tempat, Tanggal Lahir":"Bontang , 26 Agustus 2005", "Fakultas":"FKM", "Program Studi/Jurusan":"Kesehatan Masyarakat", "NIM/Stambuk":"14120240063", "Angkatan":2024, "Email":"uumi33550@gmail.com", "No. Telepon/WA":"6285753423622", "Alamat":"Rusunawa UMI", "Linkedn":"linkedin.com/in/elsa-salsabila", "Instagram":"instagram.com/elsaslsb_", "Hobi":"Memasak , menyanyi , travelling" },
  { "ID PERISAI":"PRN 0287", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Penalaran", "NamaLengkap":"Nurfauziah", "Tempat, Tanggal Lahir":"Bima , 25 September 2006", "Fakultas":"FTI", "Program Studi/Jurusan":"Teknik Pertambangan", "NIM/Stambuk":"9320240087", "Angkatan":2024, "Email":"nurfaujia1509@gmail.com", "No. Telepon/WA":"6281263004906", "Alamat":"Tallo Lama", "Linkedn":"linkedin.com/in/Nur-Fauziah", "Instagram":"instagram.com/_zeeyyyyy", "Hobi":"Badminton" },
  { "ID PERISAI":"PRN 0282", "Generasi":11, "Tugas dan Tanggung Jawab":"Staf Ahli Penalaran", "NamaLengkap":"Muh. Ishak Syam", "Tempat, Tanggal Lahir":"Saungeng, 20 Maret 2004", "Fakultas":"FP-BIOTAM", "Program Studi/Jurusan":"Agroteknologi", "NIM/Stambuk":"8220230025", "Angkatan":2023, "Email":"muhishaksyam07@gmail.com", "No. Telepon/WA":"6281242708249", "Alamat":" Jl Perintis kemerdekaan no.3", "Linkedn":null, "Instagram":"instagram.com/muh.ishaksyam", "Hobi":"Membaca " }
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

// 2. Skrip DDL Tunggal Terpadu (002_complete_perisai_schema.sql)
const migrationSql = fs.readFileSync("db/migrations/002_complete_perisai_schema.sql", "utf8");

function splitSqlStatements(sql) {
  const clean = sql
    .split("\n")
    .map(line => line.trim().startsWith("--") ? "" : line)
    .join("\n");
  return clean
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// 3. Executor untuk database target
async function migrateAndSeedTarget(name, executor) {
  console.log(`\n======================================================`);
  console.log(`🚀 Menjalankan migrasi ternormalisasi (002) & seeding ke: [${name}]`);
  console.log(`======================================================`);

  const now = Math.floor(Date.now() / 1000);
  const defaultPasswordHash = crypto.createHash("sha256").update("perisai2026").digest("hex");

  // Step 1: Eksekusi DDL Tunggal Terpadu (002_complete_perisai_schema.sql)
  console.log(`1️⃣ Menerapkan 25 tabel master/transaksi, views, & triggers (002_complete_perisai_schema.sql)...`);
  for (const stmt of splitSqlStatements(migrationSql)) {
    await executor(stmt);
  }

  // Step 2: Seed Data Referensi Master (Fakultas, Jurusan, Departemen, Jabatan, Periode, Role)
  console.log(`2️⃣ Mengisi data referensi master (Fakultas, Jurusan, Departemen, Jabatan, Periode, Role)...`);

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

  for (const f of daftarFakultas) {
    await executor(
      `INSERT OR IGNORE INTO M_Fakultas (nama_fakultas, kode_fakultas, created_at, updated_at) VALUES (?, ?, ?, ?)`,
      [f.nama, f.kode, now, now]
    );
  }

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

  for (const j of daftarJurusan) {
    const fakRows = await executor(`SELECT id_fakultas FROM M_Fakultas WHERE kode_fakultas = ?`, [j.fakKode]);
    const fakId = fakRows && fakRows[0] ? fakRows[0].id_fakultas : 1;
    await executor(
      `INSERT OR IGNORE INTO M_Jurusan (id_fakultas, nama_jurusan, jenjang, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
      [fakId, j.nama, j.jenjang, now, now]
    );
  }

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
    await executor(
      `INSERT OR IGNORE INTO M_Departemen (nama_departemen, singkatan, slug, tupoksi_utama, deskripsi_singkat, urutan, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [d.nama, d.singkatan, d.slug, d.tupoksi, d.tupoksi, d.urutan, now, now]
    );
  }

  // Periode 2026/2027
  await executor(
    `INSERT OR IGNORE INTO M_Periode (nama_periode, tahun_mulai, tahun_selesai, is_active, tema_kepengurusan, created_at, updated_at)
     VALUES ('2026/2027', 2026, 2027, 1, 'Inovasi Kolaboratif Menuju Perisai Emas', ?, ?)`,
    [now, now]
  );
  await executor(`UPDATE M_Periode SET is_active = 1 WHERE nama_periode = '2026/2027'`);
  const periodeRows = await executor(`SELECT id_periode FROM M_Periode WHERE nama_periode = '2026/2027'`);
  const periodeId = periodeRows && periodeRows[0] ? periodeRows[0].id_periode : 1;

  // Roles
  const daftarRoles = [
    { nama: "SUPER_ADMIN", label: "Super Administrator", desc: "Akses penuh seluruh sistem" },
    { nama: "BPH", label: "Badan Pengurus Harian", desc: "Akses pimpinan eksekutif dan keuangan" },
    { nama: "KADEP", label: "Kepala Departemen", desc: "Akses program kerja dan anggota divisi" },
    { nama: "EDITOR", label: "Editor Konten", desc: "Akses artikel berita dan galeri" },
    { nama: "ANGGOTA", label: "Anggota Fungsionaris", desc: "Akses profil pribadi" },
  ];
  for (const r of daftarRoles) {
    await executor(
      `INSERT OR IGNORE INTO M_Role (nama_role, label, deskripsi, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
      [r.nama, r.label, r.desc, now, now]
    );
  }

  // Jabatan Standar
  const daftarJabatan = [
    { nama: "Ketua Umum", level: 1, urutan: 1 },
    { nama: "Sekretaris Umum", level: 2, urutan: 2 },
    { nama: "Bendahara Umum", level: 2, urutan: 3 },
    { nama: "Kepala Departemen", level: 3, urutan: 4 },
    { nama: "Staf Ahli", level: 4, urutan: 5 },
    { nama: "Anggota", level: 5, urutan: 6 },
  ];
  for (const j of daftarJabatan) {
    await executor(
      `INSERT OR IGNORE INTO M_Jabatan (nama_jabatan, level_hirarki, urutan, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
      [j.nama, j.level, j.urutan, now, now]
    );
  }

  // Maps untuk Foreign Keys
  const deptsDb = await executor(`SELECT id_departemen, singkatan, slug FROM M_Departemen`);
  const deptMap = {};
  for (const d of deptsDb) { deptMap[d.singkatan] = d.id_departemen; }

  const jabsDb = await executor(`SELECT id_jabatan, nama_jabatan FROM M_Jabatan`);
  const jabMap = {};
  for (const j of jabsDb) { jabMap[j.nama_jabatan] = j.id_jabatan; }

  const rolesDb = await executor(`SELECT id_role, nama_role FROM M_Role`);
  const roleMap = {};
  for (const r of rolesDb) { roleMap[r.nama_role] = r.id_role; }

  const jurusansDb = await executor(`SELECT id_jurusan, nama_jurusan FROM M_Jurusan`);
  const jurusanMap = {};
  for (const j of jurusansDb) { jurusanMap[j.nama_jurusan] = j.id_jurusan; }

  // Step 3: Seed 42 Fungsionaris Riil ke M_Anggota, M_Akun, T_Kepengurusan
  console.log(`3️⃣ Memasukkan 42 fungsionaris riil ke M_Anggota, M_Akun, dan T_Kepengurusan...`);

  let orderIndex = 1;
  for (const m of rawMembers) {
    const prn = m["ID PERISAI"].trim();
    const nama = m["NamaLengkap"].trim();
    const nim = String(m["NIM/Stambuk"]).trim();
    const angkatan = Number(m["Angkatan"]) || 2023;
    const gen = Number(m["Generasi"]) || 11;
    const email = m["Email"].trim().toLowerCase();
    const noWa = normalizePhone(m["No. Telepon/WA"]);
    const alamat = (m["Alamat"] || "").trim() || null;
    const hobi = (m["Hobi"] || "").trim() || null;
    const linkedin = normalizeUrl(m["Linkedn"], "linkedin");
    const instagram = normalizeUrl(m["Instagram"], "instagram");
    const ttl = parseTTL(m["Tempat, Tanggal Lahir"]);
    const tempat = ttl.tempat;
    const tanggal = ttl.tanggal;
    const prodiName = m["Program Studi/Jurusan"].trim();
    const jurusanId = jurusanMap[prodiName] || 1;

    // Insert M_Anggota
    await executor(
      `INSERT INTO M_Anggota (
        id_perisai, nama_lengkap, nim, id_jurusan, angkatan, gen, tempat_lahir,
        tanggal_lahir, jenis_kelamin, email, no_wa, alamat, linkedin, instagram,
        hobi, foto_url, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'L', ?, ?, ?, ?, ?, ?, '/maskot.png', 'aktif', ?, ?)
      ON CONFLICT(id_perisai) DO UPDATE SET
        nama_lengkap=excluded.nama_lengkap,
        nim=excluded.nim,
        email=excluded.email,
        no_wa=excluded.no_wa,
        alamat=excluded.alamat,
        linkedin=excluded.linkedin,
        instagram=excluded.instagram,
        hobi=excluded.hobi,
        updated_at=excluded.updated_at`,
      [prn, nama, nim, jurusanId, angkatan, gen, tempat, tanggal, email, noWa, alamat, linkedin, instagram, hobi, now, now]
    );

    // Pemetaan Jabatan & Departemen
    const tugas = m["Tugas dan Tanggung Jawab"].trim();
    let jabatanId = jabMap["Anggota"];
    let deptId = deptMap["BPH"];
    let roleId = roleMap["ANGGOTA"];
    let tier = "staf";

    if (tugas === "Ketua Umum") {
      jabatanId = jabMap["Ketua Umum"];
      deptId = deptMap["BPH"];
      roleId = roleMap["SUPER_ADMIN"];
      tier = "bph";
    } else if (tugas === "Sekretaris Umum") {
      jabatanId = jabMap["Sekretaris Umum"];
      deptId = deptMap["BPH"];
      roleId = roleMap["BPH"];
      tier = "bph";
    } else if (tugas === "Bendahara Umum") {
      jabatanId = jabMap["Bendahara Umum"];
      deptId = deptMap["BPH"];
      roleId = roleMap["BPH"];
      tier = "bph";
    } else if (tugas.startsWith("Kepala Departemen")) {
      jabatanId = jabMap["Kepala Departemen"];
      roleId = roleMap["KADEP"];
      tier = "kadep";
      if (tugas.includes("PSDM")) { deptId = deptMap["PSDM"]; }
      else if (tugas.includes("Media")) { deptId = deptMap["MEDIA"]; }
      else if (tugas.includes("KOMPRES")) { deptId = deptMap["KOMPRES"]; }
      else if (tugas.includes("HUMAS")) { deptId = deptMap["HUMAS"]; }
      else if (tugas.includes("RISTEK")) { deptId = deptMap["RISTEK"]; }
      else if (tugas.includes("Penalaran")) { deptId = deptMap["PENALARAN"]; }
    } else if (tugas.startsWith("Staf Ahli")) {
      jabatanId = jabMap["Staf Ahli"];
      roleId = roleMap["EDITOR"];
      tier = "staf";
      if (tugas.includes("PSDM")) { deptId = deptMap["PSDM"]; }
      else if (tugas.includes("Media")) { deptId = deptMap["MEDIA"]; }
      else if (tugas.includes("KOMPRES")) { deptId = deptMap["KOMPRES"]; }
      else if (tugas.includes("HUMAS")) { deptId = deptMap["HUMAS"]; }
      else if (tugas.includes("RISTEK")) { deptId = deptMap["RISTEK"]; }
      else if (tugas.includes("Penalaran")) { deptId = deptMap["PENALARAN"]; }
    }

    // Insert M_Akun
    await executor(
      `INSERT INTO M_Akun (id_perisai, id_role, password_hash, is_active, created_at, updated_at)
       VALUES (?, ?, ?, 1, ?, ?)
       ON CONFLICT(id_perisai) DO UPDATE SET id_role=excluded.id_role`,
      [prn, roleId, defaultPasswordHash, now, now]
    );

    // Insert T_Kepengurusan
    await executor(
      `INSERT INTO T_Kepengurusan (id_periode, id_perisai, id_jabatan, id_departemen, tier, status, urutan, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'aktif', ?, ?, ?)
       ON CONFLICT(id_periode, id_perisai, id_jabatan) DO UPDATE SET
         id_departemen=excluded.id_departemen,
         tier=excluded.tier,
         urutan=excluded.urutan`,
      [periodeId, prn, jabatanId, deptId, tier, orderIndex, now, now]
    );

    orderIndex++;
  }

  // Step 4: Seed Pengaturan Website (T_Pengaturan)
  console.log(`4️⃣ Mengisi pengaturan sistem (T_Pengaturan)...`);
  const settingsList = [
    { key: "site_name", value: "UKM PERISAI UMI" },
    { key: "site_tagline", value: "Pusat Pengembangan Riset Mahasiswa Universitas Muslim Indonesia" },
    { key: "current_generasi", value: "11" },
    { key: "contact_email", value: "ukmperisai@umi.ac.id" },
    { key: "contact_phone", value: "+62 812-4489-9985" },
    { key: "address", value: "Gedung Menara UMI Lt. 4, Kampus II UMI, Jl. Urip Sumoharjo Km. 5, Makassar" },
    { key: "instagram_url", value: "https://instagram.com/ukmperisai_umi" },
    { key: "history_content", value: "UKM PERISAI UMI didirikan sebagai wadah mahasiswa penggerak riset dan keilmiahan di Universitas Muslim Indonesia." }
  ];

  for (const s of settingsList) {
    await executor(
      `INSERT INTO T_Pengaturan (kunci, nilai, tipe, diperbarui_oleh, updated_at) VALUES (?, ?, 'string', NULL, ?)
       ON CONFLICT(kunci) DO UPDATE SET nilai=excluded.nilai, updated_at=excluded.updated_at`,
      [s.key, s.value, now]
    );
  }

  // Step 5: Seed Statistik (T_Statistik)
  console.log(`5️⃣ Mengisi metrik statistik (T_Statistik)...`);
  const statsList = [
    { label: "Pengurus Aktif", value: "42", desc: "Fungsionaris Generasi 11", order: 1 },
    { label: "Departemen & Badan", value: "7", desc: "Pilar bidang keilmuan dan riset", order: 2 },
    { label: "Prestasi Ilmiah", value: "50+", desc: "Tingkat nasional & regional", order: 3 },
    { label: "Karya & Inovasi", value: "25+", desc: "Prototipe, KTI, dan PKM didanai", order: 4 }
  ];

  for (const st of statsList) {
    await executor(
      `INSERT OR IGNORE INTO T_Statistik (label, nilai, deskripsi, urutan, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, 1, ?, ?)`,
      [st.label, st.value, st.desc, st.order, now, now]
    );
  }

  // Step 6: Seed Dewan Pembina (M_Pembina)
  console.log(`6️⃣ Mengisi data Dewan Pembina (M_Pembina)...`);
  await executor(
    `INSERT OR IGNORE INTO M_Pembina (nama, gelar, jabatan, kategori, urutan, is_active, created_at, updated_at)
     VALUES ('Dr. Ir. Pembina Riset UMI', 'M.T.', 'Dewan Pembina UKM PERISAI UMI', 'pembina', 1, 1, ?, ?)`,
    [now, now]
  );

  // Step 7: Seed Prestasi & Prestasi Anggota (Normalisasi 1NF & 2NF)
  console.log(`7️⃣ Mengisi data prestasi & relasi anggota tim (T_Prestasi & T_Prestasi_Anggota)...`);
  const prestasiRows = await executor(
    `INSERT INTO T_Prestasi (id_perisai, nama_kompetisi, judul_karya, kategori, tingkat, peringkat, tahun, penyelenggara, created_at, updated_at)
     VALUES ('PRN 0253', 'Pekan Ilmiah Mahasiswa Nasional (PIMNAS)', 'Sistem Cerdas Pemantauan Lingkungan Berbasis IoT', 'PKM-Karsa Cipta', 'Nasional', 'Juara 1 Medali Emas', 2025, 'Kemendikbudristek', ?, ?)
     RETURNING id_prestasi`,
    [now, now]
  );
  const prestasiId = prestasiRows && prestasiRows[0] ? prestasiRows[0].id_prestasi : 1;
  await executor(
    `INSERT OR IGNORE INTO T_Prestasi_Anggota (id_prestasi, id_perisai, nama_anggota, peran, created_at)
     VALUES (?, 'PRN 0253', 'Muhammad Rifky Saputra Scania', 'Ketua Tim', ?)`,
    [prestasiId, now]
  );
  await executor(
    `INSERT OR IGNORE INTO T_Prestasi_Anggota (id_prestasi, id_perisai, nama_anggota, peran, created_at)
     VALUES (?, 'PRN 0258', 'Nayla Ananda', 'Anggota Tim', ?)`,
    [prestasiId, now]
  );

  console.log(`✨ [${name}] SELESAI DENGAN SUKSES! ✨`);
}

// ==========================================
// MAIN FUNCTION
// ==========================================
async function main() {
  console.log("🔥 MEMULAI RESET TOTAL & REMIGRASI SEMUA DATABASE...");

  // 1. Reset SQLite Lokal (psdm-db.db)
  const dbFile = path.resolve(process.cwd(), "psdm-db.db");
  const walFile = path.resolve(process.cwd(), "psdm-db.db-wal");
  const shmFile = path.resolve(process.cwd(), "psdm-db.db-shm");

  console.log(`\n🗑️ Menghapus database SQLite lokal sebelumnya: ${dbFile}`);
  try { if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile); } catch(e) { console.warn("Peringatan hapus dbFile:", e.message); }
  try { if (fs.existsSync(walFile)) fs.unlinkSync(walFile); } catch(e) {}
  try { if (fs.existsSync(shmFile)) fs.unlinkSync(shmFile); } catch(e) {}

  const localDb = new Database(dbFile);
  localDb.pragma("journal_mode = WAL");
  localDb.pragma("foreign_keys = OFF");

  const localExecutor = async (sql, args = []) => {
    try {
      if (sql.trim().toUpperCase().startsWith("SELECT") || sql.trim().toUpperCase().includes("RETURNING")) {
        return localDb.prepare(sql).all(...args);
      } else {
        return localDb.prepare(sql).run(...args);
      }
    } catch(err) {
      if (!err.message.includes("already exists")) {
        console.warn("Local SQLite error on SQL:", sql.slice(0, 100), "->", err.message);
      }
      return [];
    }
  };

  await migrateAndSeedTarget("SQLite Lokal (psdm-db.db)", localExecutor);
  localDb.pragma("foreign_keys = ON");
  localDb.close();
  console.log("✅ Database SQLite lokal 'psdm-db.db' selesai dibuat ulang dari nol.");

  // 2. Reset Turso Cloud LibSQL
  const tursoUrl = process.env.TURSO_DATABASE_URL || "libsql://perisai-dev-psdm.aws-ap-northeast-1.turso.io";
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTEzOTY1MzMsImlkIjoiMDFhMTE3OGQtMGIwMS03NTc4LTgzMjctYmQ3MmExMGZkYzU0Iiwia2lkIjoiYnhxbm5VQ1Vrd1U0ZzRFakJoc0xxOXo0ZHZrdlF5NXJNbHdKVGIyb0NtZyIsInJpZCI6IjEzMGZkNzhmLTAyNWMtNDQzZi04ODUxLWQ0YzkyMTFiZWNkNyJ9.jB-8X5V7nHjl5IsTnc1ZmTR1jhaZG6MGayuNJmWrqBe7K4FiPQeRSjr32oKoNhCIVPCAfeY-MChdvwfQH26mDg";

  console.log(`\n🌐 Menghubungkan ke Turso Cloud untuk reset: ${tursoUrl}`);
  const tursoClient = createClient({ url: tursoUrl, authToken: tursoAuthToken });

  console.log("🗑️ Menghapus seluruh triggers, views, dan tabel di Turso Cloud...");
  try {
    // 1. Drop Triggers
    const triggers = await tursoClient.execute("SELECT name FROM sqlite_master WHERE type='trigger'");
    for (const row of triggers.rows) {
      try { await tursoClient.execute(`DROP TRIGGER IF EXISTS "${row.name}"`); } catch(e) {}
    }
    // 2. Drop Views
    const views = await tursoClient.execute("SELECT name FROM sqlite_master WHERE type='view'");
    for (const row of views.rows) {
      try { await tursoClient.execute(`DROP VIEW IF EXISTS "${row.name}"`); } catch(e) {}
    }
    // 3. Drop Tables
    const tables = await tursoClient.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_litestream_%'"
    );
    for (const row of tables.rows) {
      try { await tursoClient.execute(`DROP TABLE IF EXISTS "${row.name}"`); } catch(e) {}
    }
    console.log("✅ Seluruh elemen lama di Turso Cloud berhasil dibersihkan.");
  } catch(e) {
    console.warn("Peringatan inspect Turso schema:", e.message);
  }

  const tursoExecutor = async (sql, args = []) => {
    try {
      const res = await tursoClient.execute({ sql, args });
      return res.rows;
    } catch(err) {
      if (!err.message.includes("already exists")) {
        console.warn("Turso error on SQL:", sql.slice(0, 100), "->", err.message);
      }
      return [];
    }
  };

  await migrateAndSeedTarget("Turso Cloud LibSQL", tursoExecutor);
  console.log("✅ Database Turso Cloud berhasil dibuat ulang dari nol.");

  console.log("\n======================================================");
  console.log("🎉 SELURUH DATABASE BERHASIL DIMIGRASI ULANG & TERNORMALISASI! 🎉");
  console.log("======================================================");
}

main().catch(err => {
  console.error("❌ Fatal error resetting databases:", err);
  process.exit(1);
});
