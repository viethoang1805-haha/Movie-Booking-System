<<<<<<< HEAD
 
=======
# 🎬 Website Đặt Vé Xem Phim

## 📌 Tên đề tài
**Đề tài:** Xây dựng website đặt vé xem phim

---

## 📝 Mô tả sơ qua dự án
Đây là dự án xây dựng website đặt vé xem phim trực tuyến, hỗ trợ người dùng tìm kiếm phim, xem lịch chiếu, chọn ghế và thanh toán online.

Hệ thống cho phép quản lý rạp phim, phòng chiếu, suất chiếu, người dùng và giao dịch đặt vé. Ngoài ra, hệ thống còn tích hợp các chức năng nâng cao như chọn ghế realtime, đăng nhập Google (OAuth2), và tích hợp thanh toán online nhằm nâng cao trải nghiệm người dùng.

Dự án được thiết kế theo hướng thực tế, có khả năng mở rộng và tối ưu hiệu năng khi số lượng người dùng lớn.

---

## ⭐ Các chức năng nổi bật trong dự án

| Nhóm chức năng | Mô tả ngắn |
|---------------|----------|
| Xác thực và bảo mật tài khoản | Đăng ký, đăng nhập, đăng xuất, JWT, Google OAuth2, phân quyền (user/admin), mã hóa mật khẩu |
| Admin | Quản lý phim, rạp, phòng chiếu, lịch chiếu, người dùng, thống kê |
| Người dùng | Xem danh sách phim, chi tiết phim, tìm kiếm phim |
| Đặt vé | Chọn ghế, giữ ghế realtime, tránh trùng ghế |
| Thanh toán | Tích hợp VNPay, MoMo |
| Thông báo & Email | Gửi email xác nhận đặt vé |
| Realtime | Cập nhật trạng thái ghế theo thời gian thực (Socket.io) |
| Mở rộng | Đánh giá phim, chat support, gợi ý phim |

---

## 📅 Bảng công việc theo ngày

### 📆 Ngày 2026-03-25
| Ngày | Thành viên | Công việc | Link SRS | Minh chứng |
|------|------------|----------|----------|------------|
| 2026-03-25 | Bùi Việt Hoàng | Thiết kế database (Users, Movies, Showtimes) | SRS Database | ERD |
| 2026-03-25 | Nguyễn Vũ Anh | Setup project backend (NodeJS) | SRS Setup BE | Ảnh setup |
| 2026-03-25 | [Nguyễn Bá Duy Anh](https://github.com/DuyAnh231o) | Setup frontend ReactJS | [SRS Setup FE](./SRS/SRS_SETUP_FONTEND.MD) | Ảnh setup |

---

### 📆 Ngày 2026-03-27
| Ngày | Thành viên | Công việc | Link SRS | Minh chứng |
|------|------------|----------|----------|------------|
| 2026-03-27 | Bùi Việt Hoàng | Xây dựng API đăng ký / đăng nhập | SRS Auth | Ảnh API |
| 2026-03-27 | Nguyễn Vũ Anh | CRUD Movie | SRS Movie API | Ảnh movie |
| 2026-03-27 | [Nguyễn Bá Duy Anh](https://github.com/DuyAnh231o) | UI trang chủ | [SRS Home UI](./SRS/SRS_Home_UI.MD) | Ảnh UI |

---

### 📆 Ngày 2026-03-28
| Ngày | Thành viên | Công việc | Link SRS | Minh chứng |
|------|------------|----------|----------|------------|
| 2026-03-28 | Bùi Việt Hoàng | Tạo API lịch chiếu (Showtime) | SRS Showtime | Ảnh API |
| 2026-03-28 | Nguyễn Vũ Anh | CRUD Theater + Room | SRS Theater | Ảnh theater |
| 2026-03-28 | [Nguyễn Bá Duy Anh](https://github.com/DuyAnh231o) | UI chi tiết phim | [SRS Movie Detail](.SRS/SRS_Movie_Detail_UI.MD) | Ảnh UI |

---

### 📆 Ngày 2026-03-29
| Ngày | Thành viên | Công việc | Link SRS | Minh chứng |
|------|------------|----------|----------|------------|
| 2026-03-29 | Bùi Việt Hoàng | Logic đặt vé + lock ghế | SRS Booking | Ảnh booking |
| 2026-03-29 | Nguyễn Vũ Anh | API Seat (sơ đồ ghế) | SRS Seat | Ảnh seat |
| 2026-03-29 | [Nguyễn Bá Duy Anh](https://github.com/DuyAnh231o) | UI chọn ghế | [SRS Seat UI](.SRS/SRS_Seat_UI.MD)| Ảnh UI |

---

### 📆 Ngày 2026-03-30
| Ngày | Thành viên | Công việc | Link SRS | Minh chứng |
|------|------------|----------|----------|------------|
| 2026-03-30 | Bùi Việt Hoàng | Tích hợp realtime (Socket.io) | SRS Realtime | Ảnh realtime |
| 2026-03-30 | Nguyễn Vũ Anh | Tích hợp thanh toán VNPay | SRS Payment | Ảnh payment |
| 2026-03-30 | [Nguyễn Bá Duy Anh](https://github.com/DuyAnh231o) | UI thanh toán | [SRS Payment UI](.SRS/SRS_Payment_UI.MD) | Ảnh UI |

---

### 📆 Ngày 2026-03-31
| Ngày | Thành viên | Công việc | Link SRS | Minh chứng |
|------|------------|----------|----------|------------|
| 2026-03-31 | Bùi Việt Hoàng | Đăng nhập Google OAuth2 | SRS Google Login | Ảnh login |
| 2026-03-31 | Nguyễn Vũ Anh | API Promotion (mã giảm giá) | SRS Promotion | Ảnh promo |
| 2026-03-31 | [Nguyễn Bá Duy Anh](https://github.com/DuyAnh231o) | UI lịch sử đặt vé | [SRS History](.SRS/SRS_History_UI.MD) | Ảnh UI |

---

## ⚙️ Công nghệ sử dụng

- **Backend:** NodeJS (Express)  
- **Frontend:** ReactJS  
- **Database:** MySQL  
- **Realtime:** Socket.io  
- **Authentication:** JWT, Google OAuth2  
- **Security:** bcrypt  
- **Payment:** VNPay, MoMo  
- **Deployment:** Docker  
- **Testing:** Postman  
- **API Docs:** Swagger  
>>>>>>> f976804a04c557a51bfd0911179d0f19d3c345fb
