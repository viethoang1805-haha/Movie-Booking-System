<!-- updates -->
# TÀI LIỆU SRS – GIAO DIỆN CHỌN GHẾ (SEAT UI)
## Hệ thống: Web Đặt Vé Xem Phim

## 1. Giới thiệu

### 1.1 Mục đích
Tài liệu này mô tả các yêu cầu chức năng và phi chức năng của giao diện chọn ghế trong hệ thống web đặt vé xem phim. Trang này cho phép người dùng chọn ghế cho suất chiếu đã chọn và chuyển sang bước thanh toán.

### 1.2 Phạm vi
Giao diện chọn ghế hỗ trợ người dùng:
- Xem sơ đồ ghế của phòng chiếu
- Chọn và bỏ chọn ghế
- Phân biệt các loại ghế và trạng thái ghế
- Xem thông tin suất chiếu
- Xem tổng tiền cần thanh toán
- Chuyển sang bước thanh toán

### 1.3 Đối tượng sử dụng
- Khách truy cập
- Người dùng đã đăng nhập

---

## 2. Tổng quan hệ thống

### 2.1 Mô tả tổng thể
Trang chọn ghế là bước trung gian giữa việc chọn phim/suất chiếu và thanh toán. Giao diện hiển thị sơ đồ ghế theo đúng bố cục phòng chiếu, đồng thời cung cấp bảng thông tin tóm tắt ở bên phải để người dùng kiểm tra lại lựa chọn của mình.

### 2.2 Mục tiêu giao diện
- Giúp người dùng chọn ghế nhanh và chính xác
- Hiển thị rõ trạng thái ghế và loại ghế
- Cung cấp thông tin suất chiếu và chi phí tổng hợp
- Tối ưu trải nghiệm đặt vé trong một màn hình

---

## 3. Yêu cầu chức năng

### 3.1 Thanh điều hướng (Header)
Hệ thống phải hiển thị thanh điều hướng ở phía trên cùng của trang, bao gồm:
- Logo hệ thống “Nhóm 9 - Cinema”
- Các menu:
  - Trang chủ
  - Phim đang chiếu
  - Lịch chiếu
  - Giới thiệu
- Nút Đăng nhập
- Nút Đăng ký

### 3.2 Khu vực sơ đồ ghế
Hệ thống phải hiển thị sơ đồ ghế theo dạng lưới, mô phỏng bố trí thực tế của phòng chiếu, bao gồm:
- Màn hình chiếu ở phía trên
- Các hàng ghế được sắp xếp theo ký hiệu
- Lối đi giữa các cụm ghế
- Các loại ghế khác nhau theo màu sắc hoặc kiểu hiển thị

### 3.3 Trạng thái ghế
Hệ thống phải phân biệt các trạng thái ghế sau:
- Ghế trống
- Ghế đang chọn
- Ghế đã đặt
- Ghế VIP
- Ghế đôi / Sweetbox

Mỗi trạng thái phải có kiểu hiển thị riêng để người dùng dễ nhận biết.

### 3.4 Chọn và bỏ chọn ghế
- Người dùng có thể click vào ghế còn trống để chọn
- Người dùng có thể click lại vào ghế đã chọn để bỏ chọn
- Ghế đã đặt không cho phép chọn
- Ghế VIP và ghế Sweetbox có thể có giá riêng

### 3.5 Thông tin suất chiếu
Hệ thống phải hiển thị đầy đủ thông tin suất chiếu trong bảng bên phải, bao gồm:
- Tên phim
- Loại định dạng phim
- Ngày chiếu
- Giờ chiếu
- Rạp chiếu / phòng chiếu

### 3.6 Danh sách ghế đã chọn
Hệ thống phải hiển thị danh sách các ghế đã chọn, bao gồm:
- Mã ghế
- Loại ghế
- Giá từng ghế

Người dùng có thể xóa từng ghế hoặc xóa toàn bộ danh sách ghế đã chọn.

### 3.7 Tổng thanh toán
Hệ thống phải tự động tính tổng tiền dựa trên các ghế đã chọn và hiển thị:
- Tổng số tiền cần thanh toán
- Đơn vị tiền tệ VND

### 3.8 Chuyển sang thanh toán
Khi người dùng nhấn nút “Tiếp tục thanh toán”, hệ thống phải chuyển sang màn hình thanh toán tương ứng.

### 3.9 Thông báo thời gian giữ ghế
Hệ thống phải hiển thị thông báo cho biết ghế đã chọn chỉ được giữ trong một khoảng thời gian nhất định, ví dụ 10 phút, trước khi tự động giải phóng.

---

## 4. Yêu cầu phi chức năng

### 4.1 Hiệu năng
- Trang chọn ghế phải phản hồi nhanh khi người dùng thao tác
- Việc chọn ghế và cập nhật tổng tiền phải diễn ra gần như tức thời
- Sơ đồ ghế phải tải nhanh và không bị giật lag

### 4.2 Tính dễ sử dụng
- Giao diện phải trực quan, dễ hiểu
- Người dùng cần phân biệt nhanh giữa ghế trống, ghế chọn và ghế đã đặt
- Nút hành động phải rõ ràng và dễ thao tác

### 4.3 Tính tương thích
- Trang phải hiển thị tốt trên máy tính, máy tính bảng và điện thoại
- Hỗ trợ các trình duyệt phổ biến như Chrome, Edge và Firefox

### 4.4 Tính tin cậy
- Trạng thái ghế phải được cập nhật chính xác
- Ghế đã chọn phải được giữ tạm thời đúng theo thời gian quy định
- Hệ thống không cho phép đặt trùng ghế đã có người khác chọn

### 4.5 Tính bảo mật
- Thông tin đặt vé và thanh toán phải được bảo vệ
- Dữ liệu suất chiếu và ghế phải được xử lý an toàn
- Không hiển thị dữ liệu nhạy cảm ra giao diện công khai

---

## 5. Yêu cầu giao diện người dùng

### 5.1 Bố cục trang
Trang chọn ghế được bố trí theo thứ tự:
1. Header
2. Khu vực sơ đồ ghế
3. Bảng thông tin phim và suất chiếu
4. Danh sách ghế đã chọn
5. Tổng thanh toán
6. Nút tiếp tục thanh toán
7. Footer

### 5.2 Phong cách thiết kế
- Tông màu chủ đạo: đen, vàng, đỏ
- Phong cách hiện đại, sang trọng
- Nhấn mạnh vào khu vực ghế và bảng thông tin
- Các trạng thái ghế phải thể hiện rõ bằng màu sắc hoặc biểu tượng

### 5.3 Trải nghiệm người dùng
- Người dùng có thể nhận biết vị trí ghế dễ dàng
- Khu vực thông tin bên phải phải luôn rõ ràng
- Khi chọn ghế, tổng tiền phải thay đổi ngay
- Nút thanh toán phải nổi bật để thúc đẩy hành động

---

## 6. Use Case

### UC-01: Xem sơ đồ ghế
- **Tác nhân:** Người dùng
- **Mô tả:** Người dùng mở trang chọn ghế để xem bố cục phòng chiếu.

### UC-02: Chọn ghế
- **Tác nhân:** Người dùng
- **Mô tả:** Người dùng click vào các ghế còn trống để thêm vào danh sách ghế đã chọn.

### UC-03: Bỏ chọn ghế
- **Tác nhân:** Người dùng
- **Mô tả:** Người dùng click lại vào ghế đã chọn để bỏ chọn.

### UC-04: Xem thông tin suất chiếu
- **Tác nhân:** Người dùng
- **Mô tả:** Người dùng xem tên phim, ngày chiếu, giờ chiếu và rạp chiếu ở bảng thông tin.

### UC-05: Tiếp tục thanh toán
- **Tác nhân:** Người dùng
- **Mô tả:** Người dùng nhấn “Tiếp tục thanh toán” để sang bước thanh toán.

---

## 7. Giao diện thiết kế

