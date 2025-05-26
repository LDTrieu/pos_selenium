# Test Cases - Tạo người dùng mới

## 1. Validate các trường bắt buộc
### 1.1 Tên người dùng trống
- Bỏ trống → Lưu → Báo lỗi: "Tên người dùng là bắt buộc"

### 1.2 Email trống
- Bỏ trống → Lưu → Báo lỗi: "Email là bắt buộc"

### 1.3 Email sai định dạng
- Nhập sai định dạng (vd: user@) → Lưu → Báo lỗi: "Email không hợp lệ"

### 1.4 Mật khẩu trống
- Bỏ trống → Lưu → Báo lỗi: "Mật khẩu là bắt buộc"

### 1.5 Mật khẩu xác nhận không khớp
- Nhập không khớp → Lưu → Báo lỗi: "Mật khẩu không khớp"

### 1.6 Vai trò trống
- Không chọn → Lưu → Báo lỗi: "Vai trò là bắt buộc"

### 1.7 Cửa hàng trống
- Không chọn → Lưu → Báo lỗi: "Cửa hàng là bắt buộc"
---

---

## 2. Tạo người dùng thành công

- Nhập tất cả các trường hợp lệ (Tên, Email, Mật khẩu, Vai trò, Cửa hàng...).
- Chọn tất cả quyền.
- Nhấn "Lưu".
- Kỳ vọng:
  - Thông báo "Tạo người dùng thành công".
  - Điều hướng về danh sách người dùng.
  - Người dùng mới xuất hiện trong danh sách.

---

## 3. Xử lý khi email đã tồn tại

- Nhập email đã tồn tại trong hệ thống.
- Nhấn "Lưu".
- Kỳ vọng: Hiển thị lỗi "Email đã tồn tại" (từ API backend trả về).

---


## 4. Login lại với user đã tạo