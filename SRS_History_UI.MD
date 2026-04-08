# 📄 TÀI LIỆU SRS – GIAO DIỆN LỊCH SỬ ĐẶT VÉ (BOOKING HISTORY UI)
## Hệ thống: Web Đặt Vé Xem Phim – Nhóm 9 Cinema

---

# 1. Giới thiệu

## 1.1 Mục đích
Tài liệu này mô tả các yêu cầu chức năng và phi chức năng của giao diện **lịch sử đặt vé**, cho phép người dùng xem, quản lý và theo dõi các giao dịch đặt vé đã thực hiện.

## 1.2 Phạm vi
Giao diện lịch sử đặt vé hỗ trợ:
- Xem danh sách vé đã đặt
- Xem chi tiết vé
- Theo dõi trạng thái vé
- Thực hiện hành động (xem vé, đặt lại, hủy nếu có)

## 1.3 Đối tượng sử dụng
- Người dùng đã đăng nhập
- Thành viên (Standard / Gold / VIP)

---

# 2. Tổng quan hệ thống

## 2.1 Mô tả tổng thể
Trang lịch sử đặt vé là một phần trong **dashboard người dùng**, hiển thị:
- Vé sắp tới (Upcoming tickets)
- Lịch sử xem phim (Past bookings)
- Thông tin tài khoản

## 2.2 Mục tiêu giao diện
- Giúp người dùng dễ dàng theo dõi vé
- Truy cập nhanh thông tin suất chiếu
- Quản lý lịch sử giao dịch
- Tăng trải nghiệm cá nhân hóa

---

# 3. Yêu cầu chức năng

## 3.1 Header
Hệ thống phải hiển thị:
- Logo “Nhóm 9 - Cinema”
- Menu điều hướng:
  - Trang chủ
  - Phim đang chiếu
  - Lịch chiếu
  - Giới thiệu
- Thanh tìm kiếm phim
- Nút tài khoản (Thành viên Gold)

---

## 3.2 Sidebar (Menu bên trái)
Hiển thị:
- Avatar người dùng
- Trạng thái tài khoản (Gold)

Menu:
- Bảng điều khiển
- **Vé của tôi (active)**
- Ưu đãi VIP
- Cài đặt
- Hỗ trợ
- Nút “Đặt vé ngay”
- Đăng xuất

---

## 3.3 Thông tin chào mừng
Hiển thị:
- “Chào mừng trở lại, [Tên người dùng]”
- Mô tả ngắn

---

## 3.4 Vé sắp tới (Upcoming Ticket)

### Thông tin phim
- Poster
- Tên phim
- Định dạng (IMAX, 2D, 3D...)

### Thông tin suất chiếu
- Ngày chiếu
- Giờ chiếu
- Phòng chiếu
- Ghế

### Trạng thái
- Đã xác nhận

### Hành động
- Nút “Chi tiết vé”

### Mã vé
- Mã booking
- QR code (nếu có)

---

## 3.5 Danh sách lịch sử đặt vé

Hiển thị dạng bảng:

### Cột dữ liệu:
- Phim
- Ngày mua
- Số tiền
- Trạng thái
- Thao tác

---

## 3.6 Trạng thái vé
Hệ thống phải hỗ trợ:
- Đã xem
- Đã hủy
- Đã xác nhận

Hiển thị bằng:
- Badge màu:
  - Xám (Đã xem)
  - Đỏ (Đã hủy)
  - Xanh (Đã xác nhận)

---

## 3.7 Hành động trên vé
Người dùng có thể:
- Xem chi tiết vé
- Đặt lại vé (Re-book)
- Làm mới trạng thái (Refresh)

---

## 3.8 Thông tin tài khoản (Panel bên phải)

### Thành viên
- Tổng chi tiêu
- Điểm tích lũy

### Thông tin cá nhân
- Email
- Số điện thoại

### Thanh toán mặc định
- Thẻ (Visa ****)

---

## 3.9 Footer
Hiển thị:
- Thông tin bản quyền
- Chính sách bảo mật
- Điều khoản sử dụng
- Tuyển dụng
- Support online

---

# 4. Yêu cầu phi chức năng

## 4.1 Hiệu năng
- Trang tải < 3 giây
- Load danh sách vé nhanh

## 4.2 Tính dễ sử dụng
- Giao diện rõ ràng
- Dễ đọc, dễ thao tác
- Thông tin phân cấp tốt

## 4.3 Tính bảo mật
- Chỉ user đăng nhập mới truy cập
- Dữ liệu cá nhân được bảo vệ
- Sử dụng HTTPS

## 4.4 Tính tin cậy
- Không mất dữ liệu khi reload
- Đồng bộ trạng thái vé chính xác
- Tránh hiển thị sai trạng thái

## 4.5 Tính tương thích
- Responsive (desktop, tablet, mobile)
- Hỗ trợ Chrome, Edge, Firefox

---

# 5. Yêu cầu giao diện người dùng

## 5.1 Bố cục
1. Header
2. Sidebar
3. Nội dung chính:
   - Welcome section
   - Vé sắp tới
   - Lịch sử đặt vé
4. Panel thông tin (bên phải)
5. Footer

---

## 5.2 Phong cách thiết kế
- Tông màu: đen – vàng – trắng
- Dark mode chủ đạo
- Card UI hiện đại

## 5.3 Trải nghiệm người dùng
- Dễ xem vé sắp tới
- Lịch sử rõ ràng dạng bảng
- Hành động nhanh (1 click)
- Highlight thông tin quan trọng

---

# 6. Use Case

## UC-01: Xem vé sắp tới
- Actor: Người dùng
- Mô tả: Xem thông tin vé đã đặt

## UC-02: Xem lịch sử đặt vé
- Actor: Người dùng
- Mô tả: Xem danh sách vé trước đó

## UC-03: Xem chi tiết vé
- Actor: Người dùng
- Mô tả: Click vào vé để xem chi tiết

## UC-04: Đặt lại vé
- Actor: Người dùng
- Mô tả: Đặt lại vé từ lịch sử

## UC-05: Quản lý tài khoản
- Actor: Người dùng
- Mô tả: Xem thông tin cá nhân

---

# 7. Giao diện thiết kế
