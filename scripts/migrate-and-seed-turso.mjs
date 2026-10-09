import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const url = process.env.TURSO_DATABASE_URL || "libsql://perisai-dev-psdm.aws-ap-northeast-1.turso.io";
const authToken = process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTEzOTY1MzMsImlkIjoiMDFhMTE3OGQtMGIwMS03NTc4LTgzMjctYmQ3MmExMGZkYzU0Iiwia2lkIjoiYnhxbm5VQ1Vrd1U0ZzRFakJoc0xxOXo0ZHZrdlF5NXJNbHdKVGIyb0NtZyIsInJpZCI6IjEzMGZkNzhmLTAyNWMtNDQzZi04ODUxLWQ0YzkyMTFiZWNkNyJ9.jB-8X5V7nHjl5IsTnc1ZmTR1jhaZG6MGayuNJmWrqBe7K4FiPQeRSjr32oKoNhCIVPCAfeY-MChdvwfQH26mDg";

const client = createClient({ url, authToken });

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

async function main() {
  console.log(`🌐 Connecting to Turso Cloud: ${url}`);

  // 1. DDL Migration 002
  console.log("🚀 Applying 002_complete_perisai_schema.sql to Turso...");
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
      // Ignore if table/index already exists
    }
  }
  console.log(`✅ Applied ${statements.length} migration statements to Turso.`);

  const now = Math.floor(Date.now() / 1000);

  // 2. Master Data
  // Fakultas
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
  ];

  const fakultasMap = {};
  for (const f of daftarFakultas) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO M_Fakultas (nama_fakultas, kode_fakultas, created_at, updated_at) VALUES (?, ?, ?, ?)`,
      args: [f.nama, f.kode, now, now]
    });
    const r = await client.execute({ sql: "SELECT id_fakultas FROM M_Fakultas WHERE kode_fakultas = ?", args: [f.kode] });
    if (r.rows[0]) fakultasMap[f.kode] = r.rows[0].id_fakultas;
  }

  // Jurusan
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

  const jurusanMap = {};
  for (const j of daftarJurusan) {
    const fakId = fakultasMap[j.fakKode];
    if (fakId) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO M_Jurusan (id_fakultas, nama_jurusan, jenjang, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
        args: [fakId, j.nama, j.jenjang, now, now]
      });
      const r = await client.execute({ sql: "SELECT id_jurusan FROM M_Jurusan WHERE nama_jurusan = ?", args: [j.nama] });
      if (r.rows[0]) jurusanMap[j.nama] = r.rows[0].id_jurusan;
    }
  }

  // Departemen
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

  const deptMap = {};
  for (const d of daftarDept) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO M_Departemen (nama_departemen, singkatan, slug, tupoksi_utama, deskripsi_singkat, urutan, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      args: [d.nama, d.singkatan, d.slug, d.tupoksi, d.tupoksi, d.urutan, now, now]
    });
    const r = await client.execute({ sql: "SELECT id_departemen FROM M_Departemen WHERE slug = ?", args: [d.slug] });
    if (r.rows[0]) deptMap[d.singkatan] = r.rows[0].id_departemen;
  }

  // Periode 2026/2027
  await client.execute({
    sql: `INSERT OR IGNORE INTO M_Periode (nama_periode, tahun_mulai, tahun_selesai, is_active, tema_kepengurusan, created_at, updated_at)
          VALUES ('2026/2027', 2026, 2027, 1, 'Inovasi Kolaboratif Menuju Perisai Emas', ?, ?)`,
    args: [now, now]
  });
  await client.execute("UPDATE M_Periode SET is_active = 1 WHERE nama_periode = '2026/2027'");
  const pRow = await client.execute("SELECT id_periode FROM M_Periode WHERE nama_periode = '2026/2027'");
  const periodeId = pRow.rows[0].id_periode;

  // Roles
  const daftarRoles = [
    { nama: "SUPER_ADMIN", label: "Super Administrator", desc: "Akses penuh seluruh sistem" },
    { nama: "BPH", label: "Badan Pengurus Harian", desc: "Akses pimpinan eksekutif dan keuangan" },
    { nama: "KADEP", label: "Kepala Departemen", desc: "Akses program kerja dan anggota divisi" },
    { nama: "EDITOR", label: "Editor Konten", desc: "Akses artikel berita dan galeri" },
    { nama: "ANGGOTA", label: "Anggota Fungsionaris", desc: "Akses profil pribadi" },
  ];
  const roleMap = {};
  for (const r of daftarRoles) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO M_Role (nama_role, label, deskripsi, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
      args: [r.nama, r.label, r.desc, now, now]
    });
    const res = await client.execute({ sql: "SELECT id_role FROM M_Role WHERE nama_role = ?", args: [r.nama] });
    if (res.rows[0]) roleMap[r.nama] = res.rows[0].id_role;
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
  const jabatanMap = {};
  for (const j of daftarJabatan) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO M_Jabatan (nama_jabatan, level_hirarki, urutan, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
      args: [j.nama, j.level, j.urutan, now, now]
    });
    const res = await client.execute({ sql: "SELECT id_jabatan FROM M_Jabatan WHERE nama_jabatan = ?", args: [j.nama] });
    if (res.rows[0]) jabatanMap[j.nama] = res.rows[0].id_jabatan;
  }

  // 3. Insert Anggota, Akun & Kepengurusan
  console.log(`📥 Inserting ${rawMembers.length} Fungsionaris 2026-2027 into Turso...`);
  const defaultPasswordHash = crypto.createHash("sha256").update("perisai2026").digest("hex");

  let orderIndex = 1;
  for (const m of rawMembers) {
    const prn = m["ID PERISAI"].trim().replace(/\s+/g, "");
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
    await client.execute({
      sql: `INSERT INTO M_Anggota (
        id_perisai, nama_lengkap, nim, id_jurusan, angkatan, gen,
        tempat_lahir, tanggal_lahir, email, no_wa, alamat,
        linkedin, instagram, hobi, quotes, foto_url, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'aktif', ?, ?)
      ON CONFLICT(id_perisai) DO UPDATE SET
        nama_lengkap=excluded.nama_lengkap,
        nim=excluded.nim,
        email=excluded.email,
        no_wa=excluded.no_wa,
        linkedin=excluded.linkedin,
        instagram=excluded.instagram,
        hobi=excluded.hobi`,
      args: [
        prn, nama, nim, jurusanId, angkatan, gen,
        tempat, tanggal, email, noWa, alamat,
        linkedin, instagram, hobi, quotes, "/maskot.png",
        now, now
      ]
    });

    // Jabatan & Departemen
    const tugas = m["Tugas dan Tanggung Jawab"].trim();
    let jabatanId = jabatanMap["Anggota"];
    let deptId = null;
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
    await client.execute({
      sql: `INSERT INTO M_Akun (id_perisai, id_role, password_hash, is_active, created_at, updated_at)
            VALUES (?, ?, ?, 1, ?, ?)
            ON CONFLICT(id_perisai) DO UPDATE SET id_role=excluded.id_role`,
      args: [prn, roleId, defaultPasswordHash, now, now]
    });

    // Insert T_Kepengurusan
    await client.execute({
      sql: `INSERT INTO T_Kepengurusan (id_periode, id_perisai, id_jabatan, id_departemen, status, urutan, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'aktif', ?, ?, ?)
            ON CONFLICT(id_periode, id_perisai, id_jabatan) DO UPDATE SET
              id_departemen=excluded.id_departemen,
              urutan=excluded.urutan`,
      args: [periodeId, prn, jabatanId, deptId, orderIndex++, now, now]
    });
  }

  // 4. Update tabel web_periods dan web_members di Turso
  console.log("🔄 Updating web_periods & web_members in Turso...");
  await client.execute(`
    CREATE TABLE IF NOT EXISTS web_periods (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      start_date INTEGER NOT NULL,
      end_date INTEGER,
      is_current INTEGER NOT NULL DEFAULT 0
    )
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS web_members (
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
    )
  `);

  await client.execute(`
    INSERT INTO web_periods (id, name, start_date, end_date, is_current)
    VALUES ('period-2026-2027', '2026/2027', 1767225600, 1798761600, 1)
    ON CONFLICT(id) DO UPDATE SET is_current=1
  `);

  await client.execute("DELETE FROM web_members WHERE period_id = 'period-2026-2027'");

  const kepengurusanRes = await client.execute({
    sql: `SELECT k.urutan, a.id_perisai, a.nama_lengkap, a.linkedin, j.nama_jabatan, d.singkatan, d.slug as dept_slug
          FROM T_Kepengurusan k
          JOIN M_Anggota a ON k.id_perisai = a.id_perisai
          JOIN M_Jabatan j ON k.id_jabatan = j.id_jabatan
          LEFT JOIN M_Departemen d ON k.id_departemen = d.id_departemen
          WHERE k.id_periode = ?
          ORDER BY k.urutan ASC`,
    args: [periodeId]
  });

  for (const row of kepengurusanRes.rows) {
    let tier = "staf";
    if (row.nama_jabatan === "Ketua Umum" || row.nama_jabatan === "Sekretaris Umum" || row.nama_jabatan === "Bendahara Umum") {
      tier = "bph";
    } else if (row.nama_jabatan === "Kepala Departemen") {
      tier = "kadep";
    }

    const posTitle = row.nama_jabatan + (row.singkatan && row.singkatan !== "BPH" ? ` ${row.singkatan}` : "");

    await client.execute({
      sql: `INSERT INTO web_members (id, period_id, department_id, name, position, tier, linkedin_url, sort_order, is_active)
            VALUES (?, 'period-2026-2027', ?, ?, ?, ?, ?, ?, 1)`,
      args: [
        `mem-${String(row.id_perisai).replace(/\s+/g, "_")}`,
        row.dept_slug || null,
        row.nama_lengkap,
        posTitle,
        tier,
        row.linkedin,
        row.urutan
      ]
    });
  }

  console.log("🎉 Successfully migrated and seeded Turso Cloud database!");
}

main().catch(err => {
  console.error("❌ Turso migration error:", err);
  process.exit(1);
});
