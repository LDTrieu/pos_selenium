# Test cases cho chức năng Đặt hàng

## 1. Thêm sản phẩm vào giỏ hàng
- Mở trang đặt hàng (http://localhost:3000/orders/create)
- Click vào sản phẩm → sản phẩm được thêm vào giỏ hàng
- Kiểm tra giỏ hàng hiển thị sản phẩm với đúng:
  + Tên sản phẩm
  + Giá
  + Số lượng mặc định là 1

## 2. Thay đổi số lượng sản phẩm trong giỏ
- Nhấn nút + để tăng số lượng → số lượng tăng lên 2
- Nhấn nút - để giảm số lượng → số lượng giảm về 1
- Kiểm tra số lượng được cập nhật đúng sau mỗi thao tác

## 3. Xóa sản phẩm khỏi giỏ hàng
- Thêm sản phẩm vào giỏ hàng
- Nhấn nút xóa (thùng rác) để bỏ sản phẩm khỏi giỏ hàng
- Kiểm tra giỏ hàng trống với:
  + Header hiển thị "Giỏ hàng (0)"
  + Message "Giỏ hàng trống"
  + Message "Vui lòng chọn sản phẩm để thêm vào giỏ hàng"

## 4. Đặt hàng thành công
- Thêm sản phẩm vào giỏ hàng
- Nhấn nút "THANH TOÁN"
- Hiển thị popup xác nhận đơn hàng
- Điền ghi chú đơn hàng
- Nhấn "XÁC NHẬN"
- Kiểm tra:
  + Hiển thị thông báo "Đặt hàng thành công!"
  + Giỏ hàng trở về trạng thái trống
  + Hiển thị popup hóa đơn PDF
  + Có thể click nút "In hóa đơn"
  + Có thể đóng popup hóa đơn

## 5. Kiểm tra phương thức thanh toán
- Thay đổi phương thức → cập nhật giá trị đơn hàng nếu có thay đổi.

## 6. Kiểm tra ghi chú đơn hàng
- Có thể nhập ghi chú dài, nhiều dòng.
- Ghi chú hiển thị đúng trong đơn hàng.

## 7. Xử lý lỗi
- Thanh toán khi giỏ hàng trống → nút "THANH TOÁN" disabled hoặc hiển thị lỗi.

## 8. In hóa đơn
- Nhấn nút "IN HÓA ĐƠN" trên popup.
- Mở chức năng in trang in (browser) với file hóa đơn PDF(sẽ tải về một PDF, bắt sự kiện này)