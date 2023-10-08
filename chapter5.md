
- Sử dụng redux-persist: Để lưu dữ liệu khi Refresh lại trang, bản chất là lưu tại localStorage (khi Refresh thì lấy data từ localStorage và nạp vào Redux) -> k lưu các thông tin nhạy cảm
    -> Các thông tin nhạy cảm (tài khoản ng dùng,...): Dựa vào Server (gọi API) để an toàn và chính xác hơn
    -> Persist ở đây hiểu là write

- Thông thường popover, modal, ...các thư viện xử lý animation thì sẽ hiển thị 1 div khác ở ngoài div root
    -> Giúp css dễ hơn (override)
    -> Và vì div root chứa tất cả resource code nên tạo 1 div khác sẽ giúp css thoải mái hơn
    -> Phải css global mới đc    