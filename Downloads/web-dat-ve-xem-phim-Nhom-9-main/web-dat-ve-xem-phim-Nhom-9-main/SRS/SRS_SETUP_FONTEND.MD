# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)
## 🎬 Hệ thống đặt vé xem phim – Frontend (ReactJS)

---

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu này mô tả các yêu cầu chức năng và phi chức năng cho việc xây dựng frontend của hệ thống đặt vé xem phim sử dụng ReactJS.

### 1.2 Phạm vi

* Xây dựng giao diện web cho người dùng đặt vé xem phim
* Giao tiếp với hệ thống backend thông qua API
* Triển khai trên môi trường trình duyệt

### 1.3 Định nghĩa và thuật ngữ

* Frontend: Phần giao diện người dùng
* Backend: Phần xử lý dữ liệu phía server
* API: Giao diện lập trình ứng dụng
* SPA: Ứng dụng một trang (Single Page Application)

---

## 2. Mô tả tổng quan

### 2.1 Góc nhìn sản phẩm

Hệ thống frontend là một ứng dụng SPA, đóng vai trò client, gửi yêu cầu đến backend và nhận dữ liệu dạng JSON để hiển thị.

### 2.2 Đối tượng người dùng

* Khách hàng: tìm kiếm phim, đặt vé
* Quản trị viên: quản lý nội dung (tùy chọn)

### 2.3 Môi trường hoạt động

* Trình duyệt web (Chrome, Edge, Firefox)
* Hệ điều hành: Windows, macOS

---

## 3. Yêu cầu hệ thống

### 3.1 Môi trường phát triển

* Node.js >= 18
* npm >= 9

---

### 3.2 Khởi tạo dự án

```bash id="3t0y7k"
npm create vite@latest movie-booking-frontend
cd movie-booking-frontend
npm install
```

Cài đặt thư viện:

```bash id="qsv9qg"
npm install axios react-router-dom
```

---

### 3.3 Cấu trúc thư mục

```id="lp99n4"
src/
 ├── components/     # Thành phần giao diện
 ├── pages/          # Trang chính
 ├── services/       # Xử lý API
 ├── context/        # Quản lý trạng thái
 ├── assets/         # Tài nguyên (ảnh, icon)
 ├── App.jsx
 └── main.jsx
```

---

### 3.4 Điều hướng (Routing)

| Đường dẫn      | Mô tả          |
| -------------- | -------------- |
| `/`            | Trang chủ      |
| `/movies`      | Danh sách phim |
| `/movie/:id`   | Chi tiết phim  |
| `/booking/:id` | Đặt vé         |
| `/cart`        | Giỏ vé         |

---

### 3.5 Quản lý trạng thái

* Sử dụng useState cho state cục bộ
* Sử dụng Context API cho state toàn cục:

  * AuthContext: quản lý đăng nhập
  * BookingContext: quản lý vé

---

### 3.6 Tích hợp API

```js id="t5efra"
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api"
});

export const getMovies = () => api.get("/movies");
```

---

### 3.7 Giao diện người dùng

* Sử dụng Tailwind CSS hoặc Bootstrap
* Thiết kế responsive cho mobile và desktop

---

## 4. Yêu cầu chức năng

| Mã  | Mô tả                   |
| --- | ----------------------- |
| FR1 | Hiển thị danh sách phim |
| FR2 | Xem chi tiết phim       |
| FR3 | Chọn suất chiếu         |
| FR4 | Chọn ghế                |
| FR5 | Đặt vé                  |
| FR6 | Xem giỏ vé              |

---

## 5. Yêu cầu phi chức năng

* Thời gian tải trang < 3 giây
* Giao diện thân thiện người dùng
* Hệ thống dễ bảo trì và mở rộng
* Hoạt động ổn định trên nhiều trình duyệt

---

## 6. Hướng dẫn cài đặt và chạy hệ thống

```bash id="2m5hvv"
git clone <repository-url>
cd movie-booking-frontend
npm install
npm run dev
```

---

## 7. Triển khai sản phẩm

```bash id="6j8q9u"
npm run build
```

---

## 8. Ghi chú

* Sử dụng file `.env` để cấu hình API
* Cần xử lý lỗi khi gọi API
* Thêm loading khi tải dữ liệu
* Có thể tối ưu bằng lazy loading

---
