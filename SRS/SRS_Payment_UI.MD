<!-- updatess -->
# TÀI LIỆU SRS – GIAO DIỆN THANH TOÁN (PAYMENT UI)
## Hệ thống: Web Đặt Vé Xem Phim

## 1. Giới thiệu

### 1.1 Mục đích
Tài liệu này mô tả các yêu cầu chức năng và phi chức năng của giao diện thanh toán trong hệ thống web đặt vé xem phim. Trang này cho phép người dùng lựa chọn phương thức thanh toán, áp dụng ưu đãi và hoàn tất giao dịch mua vé.

### 1.2 Phạm vi
Giao diện thanh toán hỗ trợ:
- Chọn phương thức thanh toán
- Nhập và áp dụng mã giảm giá
- Xem chi tiết đơn hàng
- Xác nhận và thực hiện thanh toán

### 1.3 Đối tượng sử dụng
- Người dùng đã đăng nhập
- Khách (nếu hệ thống cho phép đặt vé không cần đăng nhập)

---

## 2. Tổng quan hệ thống

### 2.1 Mô tả tổng thể
Trang thanh toán là bước cuối cùng trong quy trình đặt vé. Giao diện được chia làm hai phần:
- Bên trái: lựa chọn phương thức thanh toán và nhập mã ưu đãi
- Bên phải: hiển thị thông tin đơn hàng và tổng tiền

### 2.2 Mục tiêu giao diện
- Đơn giản hóa quá trình thanh toán
- Hiển thị rõ ràng thông tin đơn hàng
- Tăng độ tin cậy và bảo mật cho người dùng
- Giảm tỷ lệ bỏ thanh toán

---

## 3. Yêu cầu chức năng

### 3.1 Header
Hệ thống phải hiển thị:
- Logo “Nhóm 9 - Cinema”
- Menu điều hướng:
  - Trang chủ
  - Phim đang chiếu
  - Lịch chiếu
  - Giới thiệu
- Nút đăng nhập

---

### 3.2 Tiêu đề trang
Hiển thị:
- Tiêu đề: “Thanh Toán”
- Thông điệp: “Giao dịch an toàn & bảo mật 100%”

---

### 3.3 Phương thức thanh toán
Hệ thống phải cung cấp các phương thức:
- VNPay
- MoMo
- ZaloPay

Yêu cầu:
- Người dùng chỉ được chọn 1 phương thức
- Hiển thị mô tả ngắn cho từng phương thức
- Hiển thị icon tương ứng

---

### 3.4 Chọn phương thức thanh toán
- Khi người dùng chọn một phương thức → trạng thái được highlight
- Các phương thức khác bị bỏ chọn
- Mặc định có thể chọn sẵn 1 phương thức

---

### 3.5 Mã giảm giá
Hệ thống phải cho phép:
- Nhập mã ưu đãi
- Nhấn nút “Áp dụng”

Xử lý:
- Nếu mã hợp lệ → cập nhật giảm giá
- Nếu không hợp lệ → hiển thị lỗi

---

### 3.6 Thông tin đơn hàng
Hiển thị ở panel bên phải:

#### Thông tin phim
- Poster phim
- Tên phim
- Thời lượng
- Định dạng (2D/3D…)

#### Thông tin suất chiếu
- Rạp và phòng chiếu
- Ngày và giờ chiếu
- Ghế đã chọn

#### Chi tiết giá
- Giá vé
- Giá combo (nếu có)
- Phí dịch vụ (VAT)
- Giảm giá

---

### 3.7 Tổng thanh toán
- Hiển thị tổng số tiền cuối cùng
- Định dạng tiền: VND
- Cập nhật realtime khi thay đổi dữ liệu

---

### 3.8 Nút thanh toán
- Nút “Thanh toán ngay”
- Khi nhấn:
  - Kiểm tra dữ liệu hợp lệ
  - Gửi yêu cầu thanh toán
  - Chuyển đến cổng thanh toán tương ứng

---

### 3.9 Thông báo và lưu ý
Hiển thị:
- Lưu ý trước khi thanh toán:
  - Không hoàn vé
  - Kiểm tra thông tin
  - Kết nối internet ổn định
- Thông tin bảo mật:
  - PCI DSS
  - SSL

---

## 4. Yêu cầu phi chức năng

### 4.1 Hiệu năng
- Trang tải nhanh (< 3s)
- Xử lý thanh toán nhanh và ổn định

### 4.2 Tính dễ sử dụng
- Giao diện rõ ràng, dễ hiểu
- Quy trình thanh toán đơn giản
- Ít bước thao tác

### 4.3 Tính bảo mật
- Sử dụng HTTPS
- Mã hóa dữ liệu thanh toán
- Không lưu thông tin nhạy cảm phía client

### 4.4 Tính tin cậy
- Không mất dữ liệu khi reload
- Tránh thanh toán trùng lặp
- Xử lý lỗi rõ ràng

### 4.5 Tính tương thích
- Responsive trên mọi thiết bị
- Hỗ trợ Chrome, Edge, Firefox

---

## 5. Yêu cầu giao diện người dùng

### 5.1 Bố cục
1. Header  
2. Tiêu đề trang  
3. Phương thức thanh toán (trái)  
4. Mã giảm giá (trái)  
5. Lưu ý (trái)  
6. Thông tin đơn hàng (phải)  
7. Tổng tiền  
8. Nút thanh toán  
9. Footer  

---

### 5.2 Phong cách thiết kế
- Tông màu: đen, vàng, trắng
- Nút CTA nổi bật (vàng)
- Thiết kế hiện đại, tối giản

---

### 5.3 Trải nghiệm người dùng
- Người dùng dễ chọn phương thức thanh toán
- Thông tin đơn hàng luôn hiển thị rõ ràng
- Tổng tiền cập nhật ngay lập tức
- Nút thanh toán dễ nhìn, dễ click

---

## 6. Use Case

### UC-01: Chọn phương thức thanh toán
- Actor: Người dùng
- Mô tả: Chọn 1 phương thức thanh toán

### UC-02: Nhập mã giảm giá
- Actor: Người dùng
- Mô tả: Nhập mã và áp dụng

### UC-03: Xem thông tin đơn hàng
- Actor: Người dùng
- Mô tả: Kiểm tra lại vé và chi phí

### UC-04: Thanh toán
- Actor: Người dùng
- Mô tả: Nhấn “Thanh toán ngay”

---

## 7. Giao diện thiết kế
