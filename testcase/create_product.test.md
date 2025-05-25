# Test Cases - Tạo sản phẩm mới (Create Product)

## 1. Validate trường bắt buộc và giá trị hợp lệ
- Tên sản phẩm:
  - Không được để trống → hiển thị lỗi bắt buộc.
  - Được phép nhập ký tự đặc biệt, số, chữ.
- Mã SKU:
  - Không được để trống → hiển thị lỗi bắt buộc.
- Giá:
  - Không được để trống → hiển thị lỗi bắt buộc.
  - Phải là số > 0 → nhập 0 hoặc số âm hiển thị lỗi.
  - Nhập chữ hoặc ký tự đặc biệt → hiển thị lỗi.
- Danh mục:
  - Không được để trống → hiển thị lỗi bắt buộc.

## 2. SKU trùng lặp
- Nhập SKU đã tồn tại trong hệ thống → hiển thị thông báo lỗi “SKU đã tồn tại” hoặc tương tự.
- Không cho phép tạo sản phẩm với SKU trùng.

## 3. Tạo sản phẩm thành công, kiểm tra lại tại trang Quản lý sản phâm
- Nhập đầy đủ và hợp lệ các trường → nhấn nút “TẠO SẢN PHẨM”.
- Hiển thị thông báo tạo thành công.
- Sản phẩm mới xuất hiện trong danh sách quản lý sản phẩm.
- Kiểm tra SKU, Tên sản phẩm, giá, trạng thái
- Trạng thái “Đang bán” mặc định theo checkbox.

