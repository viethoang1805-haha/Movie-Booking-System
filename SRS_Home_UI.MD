# TÀI LIỆU SRS – TRANG CHỦ (HOMEPAGE)
## Hệ thống: Web Đặt Vé Xem Phim

## 1. Giới thiệu

### 1.1 Mục đích
Tài liệu này mô tả các yêu cầu chức năng và phi chức năng của trang chủ trong hệ thống web đặt vé xem phim. Trang chủ là giao diện đầu tiên người dùng nhìn thấy khi truy cập hệ thống, có nhiệm vụ giới thiệu phim nổi bật, hỗ trợ tìm kiếm và điều hướng đến các chức năng chính.

### 1.2 Phạm vi
Trang chủ cung cấp cho người dùng các chức năng sau:
- Xem phim nổi bật
- Lọc phim theo tiêu chí
- Xem danh sách phim đang chiếu
- Xem danh sách phim sắp chiếu
- Truy cập nhanh đến chức năng đặt vé và xem trailer

### 1.3 Đối tượng sử dụng
- Khách truy cập
- Người dùng đã đăng nhập

---

## 2. Tổng quan hệ thống

### 2.1 Mô tả tổng thể
Trang chủ được thiết kế theo phong cách hiện đại, tông màu tối, nhấn mạnh vào hình ảnh phim và các nút hành động nhanh. Giao diện tập trung vào trải nghiệm trực quan, giúp người dùng dễ dàng chọn phim, lọc phim và đặt vé.

### 2.2 Mục tiêu giao diện
- Tạo ấn tượng mạnh ngay từ trang đầu
- Hỗ trợ người dùng tìm phim nhanh
- Hiển thị nội dung rõ ràng, trực quan
- Tối ưu trải nghiệm trên nhiều kích thước màn hình

---

## 3. Yêu cầu chức năng

### 3.1 Thanh điều hướng (Header)
Hệ thống phải hiển thị thanh điều hướng ở phía trên cùng của trang, bao gồm:
- Logo hệ thống “NHÓM9 - CINEMA”
- Các menu điều hướng:
  - Trang chủ
  - Phim đang chiếu
  - Lịch chiếu
  - Giới thiệu
- Ô tìm kiếm phim
- Nút Đăng nhập
- Nút Đăng ký

### 3.2 Khu vực phim nổi bật (Hero Section)
Hệ thống phải hiển thị một banner lớn cho phim nổi bật, bao gồm:
- Hình nền kích thước lớn
- Tên phim
- Đánh giá
- Mô tả ngắn
- Hai nút hành động:
  - Đặt vé ngay
  - Xem trailer

### 3.3 Bộ lọc phim
Hệ thống phải cung cấp thanh lọc phim theo các tiêu chí sau:
- Thể loại
- Ngày chiếu
- Rạp phim
- Đánh giá

Người dùng có thể chọn điều kiện lọc và nhấn nút “Lọc phim” để xem kết quả phù hợp.

### 3.4 Danh sách phim đang chiếu
Hệ thống phải hiển thị danh sách phim đang chiếu theo dạng thẻ (card), mỗi thẻ phim bao gồm:
- Poster phim
- Tên phim
- Thể loại
- Thời lượng
- Điểm đánh giá

Người dùng có thể xem thông tin phim và truy cập nhanh đến trang chi tiết hoặc đặt vé.

### 3.5 Khu vực giới thiệu dịch vụ
Hệ thống phải hiển thị các khối nội dung quảng bá dịch vụ, bao gồm:
- Giới thiệu phòng chiếu Gold Class
- Giới thiệu thành viên Gold
- Combo ưu đãi bắp nước

Mỗi khối có nội dung mô tả ngắn và nút điều hướng phù hợp.

### 3.6 Danh sách phim sắp chiếu
Hệ thống phải hiển thị danh sách phim sắp chiếu theo dạng thẻ, mỗi thẻ gồm:
- Poster
- Tên phim
- Ngày khởi chiếu

### 3.7 Footer
Phần cuối trang phải hiển thị:
- Tên hệ thống
- Thông tin bản quyền
- Chính sách bảo mật
- Điều khoản sử dụng
- Liên hệ quảng cáo
- Tuyển dụng
- Biểu tượng mạng xã hội

---

## 4. Yêu cầu phi chức năng

### 4.1 Hiệu năng
- Trang chủ phải tải trong thời gian hợp lý.
- Hình ảnh cần được tối ưu để giảm thời gian tải trang.
- Giao diện phải phản hồi nhanh khi người dùng thao tác.

### 4.2 Tính dễ sử dụng
- Giao diện rõ ràng, dễ quan sát.
- Nút bấm và menu phải dễ thao tác.
- Người dùng có thể tìm phim và đặt vé nhanh chóng.

### 4.3 Tính tương thích
- Trang chủ phải hiển thị tốt trên máy tính, máy tính bảng và điện thoại.
- Giao diện phải tương thích với các trình duyệt phổ biến như Chrome, Edge và Firefox.

### 4.4 Tính bảo mật
- Thông tin đăng nhập phải được bảo vệ.
- Dữ liệu hệ thống phải được xử lý an toàn.
- Không hiển thị thông tin nhạy cảm trên giao diện công khai.

---

## 5. Yêu cầu giao diện người dùng

### 5.1 Bố cục trang
Trang chủ được bố trí theo thứ tự:
1. Header
2. Hero Section
3. Bộ lọc phim
4. Phim đang chiếu
5. Khu vực giới thiệu dịch vụ
6. Phim sắp chiếu
7. Footer

### 5.2 Phong cách thiết kế
- Giao diện sử dụng tông màu đen, vàng và đỏ.
- Thiết kế theo phong cách rạp chiếu phim hiện đại.
- Hình ảnh poster phim phải rõ nét và nổi bật.

### 5.3 Trải nghiệm người dùng
- Các nút hành động phải nổi bật và dễ nhìn.
- Khi rê chuột vào thẻ phim cần có hiệu ứng trực quan.
- Người dùng có thể chuyển nhanh từ trang chủ sang các chức năng khác.

---

## 6. Use Case

### UC-01: Xem phim nổi bật
- **Tác nhân:** Người dùng
- **Mô tả:** Người dùng truy cập trang chủ và xem phim nổi bật tại banner chính.

### UC-02: Lọc phim
- **Tác nhân:** Người dùng
- **Mô tả:** Người dùng chọn điều kiện lọc và xem danh sách phim phù hợp.

### UC-03: Đặt vé nhanh
- **Tác nhân:** Người dùng
- **Mô tả:** Người dùng nhấn nút “Đặt vé ngay” để chuyển sang màn hình đặt vé.

### UC-04: Xem trailer
- **Tác nhân:** Người dùng
- **Mô tả:** Người dùng nhấn nút “Xem trailer” để xem video giới thiệu phim.

---

## 7. Giao diện thiết kế