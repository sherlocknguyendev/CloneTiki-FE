
- Access token lưu ở Local Storage vì:
    + Tiện cho việc truy cập và sử dụng. Chỉ cần dùng javascript là truy cập được,
thông qua method localStorage.getItem()
    + Thời gian sống của access token là ngắn (config ở BE), vì vậy, nếu có bị lộ token, nó cũng
không nguy hiểm (do data lưu ở local storage tồn tại mãi mãi, nên có xác suất bị
lộ token. Tuy nhiên xác suất này khá nhỏ)

- Refresh token lưu ở cookies vì:
    + Cookies sau 1 thời gian nhất định sẽ tự động hết hạn (tự động xóa dữ liệu lưu ở
cookies)
    +  Cookies cho phép cấu hình để chặn truy cập cookies bằng javascript (thuộc tính
httpOnly) -> Chỉ server mới tác động được 
    + Thời gian sống của Refresh token lâu hơn access token. Lưu ở cookies sẽ giảm
thiểu rủi ro.
        -> access token và refresh token chỉ là tên mình tự đặt và tự điều chỉnh; 2 cái có 2 token khác nhau (API khác nhau)

- antd: thư viện UI viết sẵn React Component -> Giúp design nhanh giao diện responsive thông qua component, tương tự như react-bootstrap
    + antd chia thành 24 columns, khác với bootstrap - 12 columns
- ant-design/icons : thư viện icons

- Controlled Component: Lưu dữ liệu của Component thông qua React (dữ liệu của Component đc lưu vào state của React)
- Uncontrolled Component: Lưu dữ liệu trực tiếp vào DOM (HTML)

- axios: thư viện giúp gọi đc API của BE để lấy dữ liệu
- interceptors
    + Nghĩa tiếng Anh là:  máy bay đánh chặn, vật cản trở, vật ở giữa 2 điểm
    + Trong lập trình nghĩa là: can thiệp vào khi gửi request (API) và khi nhận response (ý là trước khi gửi request đi thì mình muốn làm cái gì, và sau khi nhận về response thì muốn làm cái gì)

- Redux thuần thì có reducer, còn redux toolkit thì gọi là slice (slice là nơi gộp chung file action và reducer)

- Token: Mã nhận dạng, mã thông báo (mỗi cái có 1 token khác nhau)

- Cơ chế dùng token (access_token) để xác thực người dùng là ai (kiểm tra và dữ liệu từ Back-End) -> gọi là stateless

- Cơ chế 're-try': gọi lại API khi bị fail 
    -> ở bài này thì là: gọi API refresh khi API account bị fail (do config access_token thời gian ngắn) xog lấy token ở refresh gán vào account 

- Thư viện 'ms' giúp convert để cho BE hiểu (covert từ string số sang minisecond - vì BE chỉ hiểu đc minisecond) 

- Thư viện 'reqx': Giúp filter dễ dàng hơn 
    + Ví dụ:
      http://localhost:8080/api/v1/user?current=1&pageSize=2&fullName=/abc/i
      => filter theo fullName có chứa từ 'abc'. tương tự như điều kiện %like% của SQL