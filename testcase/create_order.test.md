# Test cases cho chức năng Đặt hàng

## 1. Thêm sản phẩm vào giỏ hàng
- Click vào sản phẩm
- Kỳ vọng: 
  + Sản phẩm được thêm vào giỏ hàng
  + Hiển thị đúng tên sản phẩm
  + Số lượng mặc định là 1

## 2. Thay đổi số lượng sản phẩm
- Click nút + để tăng số lượng
- Kỳ vọng: Số lượng tăng lên 2
- Click nút - để giảm số lượng  
- Kỳ vọng: Số lượng giảm về 1

## 3. Xóa sản phẩm khỏi giỏ
- Click nút xóa (icon thùng rác)
- Kỳ vọng:
  + Sản phẩm bị xóa khỏi giỏ
  + Hiển thị "Giỏ hàng (0)"
  + Hiển thị "Giỏ hàng trống"

## 4. Đặt hàng thành công
- Click "Thanh toán"
- Điền ghi chú đơn hàng
- Click "Xác nhận"
- Kỳ vọng:
  + Hiển thị "Đặt hàng thành công"
  + Hiển thị hóa đơn PDF
  + Click được nút "In hóa đơn"
  + Click được nút "Đóng"
  + Giỏ hàng trở về trạng thái trống

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