
Giải pháp về upload file:
- Cách 1.
    User dùng browser(client) upload file lên website (file raw)
    Client gửi file (raw) lên server
    Server đọc file (raw) này, convert dữ liệu ra định dạng mong muốn (json),
    Server xử lý và lưu dữ liệu vào database
    Server trả về kết quả cho client
- Cách 2.
    User dùng browser(client) upload file lên website (file raw)
    Client đọc file upload, convert dữ liệu ra định dạng mong muốn (json),
    Client gửi dữ liệu json này lên server (không gửi file raw)
    Server đọc dữ liệu json gửi lên, xử lý, lưu dữ liệu vào database
    Server trả về kết quả cho Client


- Export dùng kiểu định dạng CSV (Comman-Seperated Values) vì: Máy móc chỉ hỗ trợ kiểu đó (text) (khi muốn import vào các database, platforms khác)
    + Dùng định dạng XLS, XLSX khi làm việc với complex data (phù hợp với mắt người)
    + Dùng định dạng CSV khi muốn dùng data ở nhiều nơi (phù hợp với máy móc)
    + Vì Microsoft Excel hỗ trợ hiển thị file CSV nên khi mở nó sẽ mở bằng Excel
    