-- =====================================================================
-- Data awal menu Dapur Harum Rindu (opsional)
-- Jalankan SETELAH schema.sql. Aman dijalankan sekali.
-- Kolom image dibiarkan kosong; owner bisa upload gambar lewat Panel Admin,
-- atau situs akan memakai gambar bawaan jika nama menu cocok.
-- =====================================================================

insert into public.menu_items (name, description, price, category, tags, signature, sort_order) values
('Rendang Daging Sapi', 'Daging sapi empuk dimasak perlahan delapan jam dalam santan dan rempah Minang hingga legit dan kaya rasa.', 68000, 'Hidangan Utama', array['Pedas','Khas Padang'], true, 1),
('Sate Ayam Madura', 'Sepuluh tusuk ayam panggang arang disiram bumbu kacang gurih, lontong, dan acar segar.', 45000, 'Hidangan Utama', array['Panggang Arang'], true, 2),
('Ayam Bakar Taliwang', 'Ayam kampung dibakar dengan bumbu merah khas, disajikan bersama sambal dan lalapan segar.', 52000, 'Hidangan Utama', array['Pedas','Panggang Arang'], true, 3),
('Gurame Goreng Sambal', 'Ikan gurame utuh digoreng renyah, disiram sambal terasi pedas dan ditaburi kemangi.', 95000, 'Hidangan Utama', array['Untuk Berbagi','Seafood'], false, 4),
('Nasi Goreng Kampung', 'Nasi goreng resep nenek dengan terasi, telur ceplok, kerupuk udang, dan irisan timun segar.', 38000, 'Hidangan Utama', array['Favorit'], false, 5),
('Sop Buntut Bakar', 'Buntut sapi empuk dalam kuah kaldu bening rempah, disajikan dengan nasi hangat dan emping.', 78000, 'Sup & Salad', array['Berkuah','Spesial'], true, 6),
('Soto Ayam Kuning', 'Kuah kunyit hangat berisi suwiran ayam, soun, telur rebus, dan taburan bawang goreng.', 35000, 'Sup & Salad', array['Berkuah'], false, 7),
('Gado-Gado Siram', 'Sayuran rebus, tahu, tempe, dan telur disiram saus kacang ulekan tangan yang creamy.', 32000, 'Sup & Salad', array['Vegetarian'], false, 8),
('Es Cendol Dawet', 'Cendol pandan, santan kental, dan gula aren cair disajikan dengan serutan es yang menyegarkan.', 22000, 'Pencuci Mulut & Minuman', array['Manis','Dingin'], false, 9),
('Es Teler Spesial', 'Perpaduan alpukat, nangka, kelapa muda, dan susu kental manis dengan serutan es yang segar.', 28000, 'Pencuci Mulut & Minuman', array['Manis','Dingin','Favorit'], false, 10)
on conflict do nothing;
