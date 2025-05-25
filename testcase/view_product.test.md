# pos_selenium


# Test Cases - Quản lý sản phẩm (View)

## 1. Hiển thị danh sách sản phẩm
- Kiểm tra bảng hiển thị đầy đủ các cột: `#`, `Hình ảnh`, `SKU`, `Tên sản phẩm`, `Loại`, `Giá`, `Trạng thái`, `Thao tác`.
- Kiểm tra số lượng dòng sản phẩm hiện ra khớp với dữ liệu backend.
- Kiểm tra từng dòng sản phẩm có đầy đủ thông tin:
  - Hình ảnh hoặc placeholder "No Image".
  - SKU, Tên sản phẩm, Loại, Giá.
  - Trạng thái (đang bán/ngừng bán) hiển thị đúng màu sắc và text.
- Các icon thao tác (xem, sửa, xóa) hiện đúng và có tooltip tương ứng.

## 2. Tìm kiếm sản phẩm theo SKU
- Nhập SKU hợp lệ vào ô tìm kiếm → click nút Tìm kiếm.
- Kiểm tra kết quả trả về chỉ có sản phẩm có SKU đúng như tìm kiếm.
- Nhập SKU không tồn tại → kết quả trả về danh sách trống hoặc thông báo không có sản phẩm.
- Để trống ô tìm kiếm → click tìm kiếm → danh sách sản phẩm hiển thị đầy đủ như ban đầu.

## 3. Nút “Thêm sản phẩm”
- Nút “+ Thêm sản phẩm” luôn hiện.
- Click vào nút → điều hướng đến trang hoặc popup thêm sản phẩm (tuỳ ứng dụng).

## 4. Nút “Xóa” (Delete) chuyển trạng thái sang “Ngừng bán”
- Click nút icon thùng rác (Delete) trên 1 dòng sản phẩm có trạng thái “Đang bán”.
- Popup confirm hiện với nội dung:  
  “Bạn có chắc chắn muốn ngừng bán sản phẩm "Tên sản phẩm"?”
- Nhấn “OK” → trạng thái sản phẩm đổi sang “Ngừng bán” (màu đỏ).
- Nhấn “Cancel” → không có thay đổi.
- Kiểm tra backend gọi API update trạng thái đúng.

## 5. Các icon Xem và Sửa
- Icon "mắt" (view) click được, chuyển đến trang xem chi tiết sản phẩm.
- Icon "bút" (edit) click được, chuyển đến trang sửa sản phẩm.

## 6. Hiển thị trạng thái sản phẩm
- “Đang bán” hiển thị màu xanh, “Ngừng bán” hiển thị màu đỏ.
- Kiểm tra trạng thái khớp dữ liệu backend.

## 7. Kiểm tra phân trang (nếu có)
- Nếu danh sách có phân trang, kiểm tra chuyển trang hoạt động đúng.
