# pos_selenium


# Test chức năng Login

## 1. Đăng nhập thành công (đúng tài khoản + mật khẩu)
- **Input:** username hợp lệ (ví dụ user1@pos.vn), mật khẩu đúng.
- **Kỳ vọng:** đăng nhập thành công, chuyển đến trang chính (dashboard hoặc home).

## 2. Đăng nhập sai mật khẩu
- **Input:** username hợp lệ, mật khẩu sai.
- **Kỳ vọng:** hiển thị thông báo lỗi “Mật khẩu không đúng” hoặc tương tự, không chuyển trang.

## 3. Đăng nhập sai username
- **Input:** username không tồn tại, mật khẩu bất kỳ.
- **Kỳ vọng:** thông báo lỗi “Tài khoản không tồn tại” hoặc tương tự, không chuyển trang.

## 4. Đăng nhập với username để trống
- **Input:** trường username bỏ trống, mật khẩu hợp lệ hoặc không.
- **Kỳ vọng:** thông báo lỗi “Tên đăng nhập không được để trống”.

## 5. Đăng nhập với mật khẩu để trống
- **Input:** username hợp lệ, mật khẩu bỏ trống.
- **Kỳ vọng:** thông báo lỗi “Mật khẩu không được để trống”.

## 6. Đăng nhập với username và mật khẩu để trống
- **Input:** cả hai trường bỏ trống.
- **Kỳ vọng:** thông báo lỗi tương ứng cho các trường bắt buộc.

## 7. Đăng nhập với định dạng username sai (vd không đúng email)
- **Input:** username không phải email (vd: "user1"), mật khẩu hợp lệ.
- **Kỳ vọng:** thông báo lỗi định dạng username không hợp lệ (nếu có validation).

---

case 1: thành công
request: {"email":"user1@pos.vn","password":"123456"}
response có thể như này:  {
    "user": {
        "user_id": 26,
        "first_name": "Nguyen",
        "last_name": "Van A",
        "email": "user1@pos.vn",
        "about": "About user1",
        "avatar": "https://i.pinimg.com/originals/0e/8a/9a/0e8a9a5a5e2b6b6b5b6b5b6b5b6b5b6b.jpg",
        "phone_number": "0123456789",
        "address": "Address user1",
        "city": "HCM",
        "status_id": 1,
        "status_name": "ACTIVE",
        "user_name": "user_1",
        "position_id": 1,
        "position": "ADMIN",
        "config": 131071,
        "major": "Quản lý cửa hàng",
        "shop_config": 3,
        "shop_location": "shop_1, shop_2",
        "created_by": 1,
        "created_at": "2025-03-22T13:35:36+07:00",
        "updated_at": "0001-01-01T00:00:00Z",
        "last_login_date": "0001-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyNiwiZW1haWwiOiJ1c2VyMUBwb3Mudm4iLCJleHAiOjE3NDgyNTI3NTF9.ozmvdnna_zlRWNE8y9k3fvJSym1KxGJhzyee_dVVEP4",
    "permissions": [
        "user-view",
        "product-update",
        "order-create",
        "product-delete",
        "order-approve",
        "user-delete",
        "product-view",
        "product-create",
        "order-delete",
        "report-monthly-view",
        "report-export",
        "permission-manage",
        "user-create",
        "order-view",
        "order-update",
        "user-update",
        "report-daily-view"
    ]
}
trên giao diện: sẽ chuyển về trang http://localhost:3000/dashboard
Hãy Đăng xuất để test case tiếp
Nút đăng xuất <span>Sign Out</span>

case 2: Đăng nhập sai mật khẩu
request: {"email":"user1@pos.vn","password":"1"}
response: {"status":401,"error":"UNAUTHORIZED","cause":"INVALID_EMAIL_OR_PASSWORD"}

case 3: Đăng nhập sai UserName
request: {"email":"user1000@pos.vn","password":"123456"}
response: {"status":400,"error":"BAD_REQUEST","cause":"USER_NOT_FOUND"}
trên giao diện: <div class="login-error">Đã xảy ra lỗi khi đăng nhập</div>

case 4: Đăng nhập với username để trống
không call API
trên giao diện: <div class="login-error">Đã xảy ra lỗi khi đăng nhập</div>

case 5: Đăng nhập với mật khẩu để trống
không call API
trên giao diện: <div class="login-error">Đã xảy ra lỗi khi đăng nhập</div>

case 6: Đăng nhập với username và mật khẩu để trống
không call API
trên giao diện: <div class="login-error">Đã xảy ra lỗi khi đăng nhập</div>

case 7: Đăng nhập với định dạng username sai (vd không đúng email)

request: {"email":"user1","password":"123456"}
response: {"status":401,"error":"UNAUTHORIZED","cause":"INVALID_EMAIL_OR_PASSWORD"}
trên giao diện: <div class="login-error">Đã xảy ra lỗi khi đăng nhập</div>


Sau mỗi case Hãy Đăng xuất để test case tiếp,
sau khi click đăng xuất. sẽ tự động về  http://localhost:3000/login
reqest: http://localhost:8080/api/users/logout
response: {"message":"Logout successfully"}

Nút đăng xuất <span>Sign Out</span>

