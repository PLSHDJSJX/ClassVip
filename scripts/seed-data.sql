-- Sample students for demonstration
INSERT INTO students (name, seat_number, photo_url, hobbies) VALUES
('Ahmad Rizki', 1, 'https://i.pravatar.cc/150?img=1', 'Gaming, Programming, Fotografi'),
('Siti Nurhaliza', 2, 'https://i.pravatar.cc/150?img=2', 'Menyanyi, Menggambar, Membaca'),
('Budi Santoso', 3, 'https://i.pravatar.cc/150?img=3', 'Sepak Bola, Musik, Coding'),
('Dewi Lestari', 4, 'https://i.pravatar.cc/150?img=4', 'Menulis, Traveling, Memasak'),
('Andi Setiawan', 5, 'https://i.pravatar.cc/150?img=5', 'Basketball, Game Development'),
('Maya Putri', 6, 'https://i.pravatar.cc/150?img=6', 'Dance, Fashion Design, Art'),
('Reza Pratama', 7, 'https://i.pravatar.cc/150?img=7', 'Robotics, AI, Mathematics'),
('Linda Sari', 8, 'https://i.pravatar.cc/150?img=8', 'Web Design, UI/UX, Photography'),
('Tommy Gunawan', 9, 'https://i.pravatar.cc/150?img=9', 'Cyber Security, Hacking, Chess'),
('Ani Widyaningsih', 10, 'https://i.pravatar.cc/150?img=10', 'Digital Marketing, Social Media'),
('Dimas Prasetyo', 11, 'https://i.pravatar.cc/150?img=11', 'Mobile App Development, IoT'),
('Fitri Handayani', 12, 'https://i.pravatar.cc/150?img=12', 'Graphic Design, Animation'),
('Bayu Saputra', 13, 'https://i.pravatar.cc/150?img=13', 'Network Administration, Gaming'),
('Citra Dewi', 14, 'https://i.pravatar.cc/150?img=14', 'Data Science, Machine Learning'),
('Eko Wibowo', 15, 'https://i.pravatar.cc/150?img=15', 'Hardware, Elektronik, Arduino');

-- Sample gallery items
INSERT INTO gallery_items (title, media_url, media_type, description) VALUES
('Foto Kelas Bersama', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500', 'image', 'Foto bersama seluruh siswa XI-TKJ-2 di depan lab komputer'),
('Praktikum Jaringan', 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500', 'image', 'Kegiatan praktikum konfigurasi jaringan komputer'),
('Lomba Programming', 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500', 'image', 'Tim XI-TKJ-2 saat mengikuti lomba programming tingkat sekolah'),
('Workshop Web Development', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500', 'image', 'Workshop pembuatan website dengan teknologi modern'),
('Study Tour Industri', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', 'image', 'Kunjungan ke perusahaan teknologi untuk melihat dunia kerja');

-- Sample slides configuration
INSERT INTO slides (title, type, content, "order", is_active) VALUES
('Denah Kelas XI-TKJ-2', 'classroom', '{"description": "Tata letak kursi interaktif kelas XI-TKJ-2 dengan 33 tempat duduk"}', 1, 'true'),
('Galeri Kenangan Kelas', 'gallery', '{"description": "Koleksi foto dan video kegiatan kelas XI-TKJ-2 sepanjang tahun ajaran"}', 2, 'true');