# TÀI LIỆU SRS – TRANG CHI TIẾT PHIM
## Hệ thống: Web Đặt Vé Xem Phim

## 1. Giới thiệu

### 1.1 Mục đích
Tài liệu này mô tả các yêu cầu chức năng và phi chức năng của trang chi tiết phim. Trang này giúp người dùng xem thông tin đầy đủ về một bộ phim và thực hiện các hành động như xem trailer và đặt vé.

### 1.2 Phạm vi
Trang chi tiết phim cho phép người dùng:
- Xem thông tin phim
- Xem trailer
- Xem diễn viên
- Đọc đánh giá
- Đặt vé

### 1.3 Đối tượng sử dụng
- Khách truy cập
- Người dùng đã đăng nhập

---

## 2. Tổng quan hệ thống

### 2.1 Mô tả tổng thể
Trang chi tiết phim hiển thị đầy đủ thông tin của một bộ phim cụ thể. Giao diện được thiết kế theo phong cách tối (dark theme), tập trung vào hình ảnh lớn và nội dung rõ ràng.

---

## 3. Yêu cầu chức năng

### 3.1 Header
- Logo hệ thống
- Menu điều hướng
- Nút đăng nhập / đăng ký

### 3.2 Thông tin phim (Hero Section)
Hệ thống hiển thị:
- Ảnh nền lớn
- Poster phim
- Tên phim
- Nhãn “HOT”
- Điểm đánh giá
- Thời lượng, thể loại, năm phát hành

Nút chức năng:
- Đặt vé ngay
- Xem trailer

---

### 3.3 Nội dung phim
- Tiêu đề “Nội dung phim”
- Đoạn mô tả chi tiết về nội dung phim

---

### 3.4 Diễn viên và đoàn phim
Hiển thị danh sách:
- Ảnh đại diện
- Tên
- Vai trò (diễn viên, đạo diễn…)

---

### 3.5 Trailer
- Hình thumbnail video
- Nút play
- Cho phép xem trailer phim

---

### 3.6 Đánh giá khán giả
Hiển thị:
- Danh sách đánh giá
- Số sao
- Nội dung bình luận
- Tên người đánh giá
- Nút “Viết đánh giá”

---

### 3.7 Đặt vé
- Khi nhấn “Đặt vé ngay” → chuyển sang trang đặt vé

---

## 4. Yêu cầu phi chức năng

### 4.1 Hiệu năng
- Trang tải nhanh
- Video không làm chậm hệ thống

### 4.2 Tính dễ sử dụng
- Giao diện rõ ràng
- Nội dung dễ đọc
- Nút bấm dễ thao tác

### 4.3 Tính tương thích
- Hoạt động tốt trên mobile, tablet, desktop
- Hỗ trợ Chrome, Edge, Firefox

### 4.4 Bảo mật
- Bảo vệ thông tin người dùng
- Không lộ dữ liệu nhạy cảm

---

## 5. Yêu cầu giao diện

### 5.1 Bố cục
1. Header  
2. Thông tin phim  
3. Nội dung phim  
4. Diễn viên  
5. Trailer  
6. Đánh giá  
7. Footer  

### 5.2 Thiết kế
- Tông màu: đen, vàng, đỏ
- Phong cách điện ảnh hiện đại

### 5.3 Trải nghiệm người dùng
- Nút “Đặt vé” nổi bật
- Dễ xem thông tin trong 1 trang
- Có hiệu ứng trực quan

---

## 6. Use Case

### UC-01: Xem chi tiết phim
- Actor: Người dùng
- Mô tả: Xem thông tin đầy đủ của phim

### UC-02: Xem trailer
- Actor: Người dùng
- Mô tả: Nhấn play để xem video

### UC-03: Xem diễn viên
- Actor: Người dùng
- Mô tả: Xem danh sách diễn viên

### UC-04: Đọc đánh giá
- Actor: Người dùng
- Mô tả: Xem nhận xét từ người khác

### UC-05: Đặt vé
- Actor: Người dùng
- Mô tả: Nhấn “Đặt vé ngay”

---

## 7. Giao diện thiết kế


