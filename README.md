Sinh Viên Thực Hiện:Bùi Việt Hoàng-23810310241;Nguyễn Vũ Anh-23810310237;Nguyễn Bá Duy Anh-23810310238

-Hoàng 
Thiết kế kiến trúc hệ thống
Thiết kế database
Xây dựng API core 
Review code BE của team
Xử lý các logic phức tạp (đặt vé, realtime ghế, thanh toán)
-Vũ Anh
Xây dựng API phụ
Hỗ trợ tích hợp thanh toán
Làm UI các trang chính
-Duy Anh 
Xây dựng API phụ
Xử lý email, thông báo
Làm UI + tương tác frontend
2. Giai đoạn 1: Thiết kế hệ thống
-Hoàng 
Thiết kế Database
Users
Movies
Theaters
Showtimes
Seats
Bookings
Payments
Promotions
Vẽ ERD
Chọn công nghệ:
Backend: NodeJS (Express/NestJS)
DB: MySQL / PostgreSQL
Realtime: Socket.io
Auth: JWT
-Vũ Anh + Duy Anh
Setup project 
Tạo base structure:
Folder structure
Config môi trường
Setup Git (branch, workflow)
3. Giai đoạn 2: Backend Core
-Hoàng (Core APIs)
Auth:
Register / Login / JWT
Movie:
CRUD phim
Showtime:
Tạo lịch chiếu
Booking:
Logic đặt vé
Lock ghế (tránh trùng)
-Vũ Anh (BE phụ)
Theater + Room:
CRUD rạp, phòng chiếu
Seat:
Sơ đồ ghế
Promotion:
Mã giảm giá
-Duy Anh 
User:
CRUD user (admin)
Booking:
Lịch sử đặt vé
Email:
Gửi mail xác nhận
Notification:
Thông báo đặt vé
4. Giai đoạn 3: Frontend
Hoàng
Trang:
Admin Dashboard
Quản lý phim
Thống kê
-Vũ Anh
Trang:
Trang chủ
Danh sách phim
Chi tiết phim
-Duy Anh
Trang:
Chọn ghế
Thanh toán
Lịch sử đặt vé
5. Giai đoạn 4: Chức năng nâng cao
-Hoàng
Realtime ghế (Socket.io)
Gợi ý phim (recommendation logic)
-Vũ Anh
Tích hợp thanh toán:
VNPay
MoMo
Combo (bắp nước)
-Duy Anh
Đánh giá & bình luận
Chat support (basic)
Tích điểm / VIP
6. Giai đoạn 5: Testing & Optimize
-Hoàng
Test API
Optimize query DB
Security:
Hash password (bcrypt)
Validate input
-Vũ Anh + Duy Anh
Test UI/UX
Responsive
Fix bug frontend
7. Giai đoạn 6: Deploy
-Hoàng
Deploy Backend:
VPS / Render / Railway
Setup DB production
-Vũ Anh + Duy Anh
Deploy Frontend:
Vercel / Netlify
Test production
-8. Chia nhỏ task cụ thể (rất quan trọng)
Backend
Auth API
Movie API
Theater API
Showtime API
Seat API
Booking API
Payment API
Frontend
UI Home
UI Movie Detail
UI Booking
UI Seat Map
UI Payment
UI Admin
-9. Timeline gợi ý (3–5 tuần)
Tuần 1:
Thiết kế + setup project
Tuần 2:
Backend core
Tuần 3:
Frontend cơ bản
Tuần 4:
Thanh toán + realtime + nâng cao
Tuần 5:
Test + deploy

