# PROJECT LOG - Comic Management System

## Thông tin dự án

Tên dự án: Comic Management System  
Kiến trúc: Microservices + Event-driven Architecture  
Stack dự kiến: NestJS, MongoDB, Redis, RabbitMQ, Docker Compose  

## Tiến trình thực hiện

### Bước 1: Khởi tạo cấu trúc dự án

Trạng thái: Hoàn thành

Đã thực hiện:
- Tạo thư mục gốc `comic-management-system`
- Khởi tạo Git repository
- Tạo các thư mục service:
  - api-gateway
  - auth-service
  - user-service
  - comic-service
  - chapter-service
  - search-service
  - notification-service
- Tạo thư mục `docs`
- Tạo các file tài liệu ban đầu:
  - README.md
  - docker-compose.yml
  - PROJECT_LOG.md
  - docs/architecture.md
  - docs/api-design.md
  - docs/database-design.md

Ghi chú:
- Dự án sẽ được triển khai từng bước.
- Trước mỗi lần làm tiếp, cần đọc lại file PROJECT_LOG.md để nắm tiến trình.

### Bước 2: Setup Docker Compose cho hạ tầng hệ thống

Trạng thái: Hoàn thành

Đã thực hiện:
- Cấu hình Docker Compose
- Chạy thành công MongoDB container
- Chạy thành công Redis container
- Chạy thành công RabbitMQ container
- Kiểm tra bằng lệnh `docker ps`
- Các container đang chạy:
  - comic_mongodb
  - comic_redis
  - comic_rabbitmq

Ghi chú:
- MongoDB: localhost:27017
- Redis: localhost:6379
- RabbitMQ: localhost:5672
- RabbitMQ Dashboard: http://localhost:15672

### Bước 3: Khởi tạo Auth Service

Trạng thái: Hoàn thành

Đã thực hiện:
- Cài NestJS CLI
- Tạo project NestJS cho `auth-service`
- Chạy thử Auth Service bằng `npm run start:dev`
- Kiểm tra API mặc định tại `http://localhost:3000`

Ghi chú:
- Auth Service hiện đang chạy mặc định ở port 3000
- Các chức năng đăng ký, đăng nhập và JWT sẽ được triển khai ở bước sau

### Bước 4: Kết nối Auth Service với MongoDB

Trạng thái: Hoàn thành

Đã thực hiện:
- Cài đặt `@nestjs/mongoose` và `mongoose`
- Cấu hình kết nối MongoDB cho Auth Service
- Kết nối database `comic_auth_db`
- Chạy thử Auth Service thành công

Ghi chú:
- MongoDB đang chạy bằng Docker ở `localhost:27017`
- Auth Service dùng database riêng: `comic_auth_db`

### Bước 5: Tạo User Schema cho Auth Service

Trạng thái: Hoàn thành

Đã thực hiện:
- Tạo thư mục `src/schemas`
- Tạo file `user.schema.ts`
- Khai báo schema User gồm:
  - username
  - email
  - password
  - role
- Đăng ký UserSchema vào AppModule
- Chạy thử Auth Service thành công

Ghi chú:
- User sẽ được lưu trong database `comic_auth_db`
- Trường email được đặt unique để tránh đăng ký trùng tài khoản
- Password sẽ dùng để lưu mật khẩu đã mã hóa ở bước sau

### Bước 6: Xây dựng chức năng đăng ký tài khoản

Trạng thái: Hoàn thành

Đã thực hiện:
- Cài đặt `bcrypt` để mã hóa mật khẩu
- Tạo Auth Module
- Tạo Auth Service
- Tạo Auth Controller
- Tạo Register DTO
- Xây dựng API `POST /auth/register`
- Sửa lỗi `UserModel` chưa được import trong `AuthModule`
- Test đăng ký tài khoản thành công bằng Postman
- API trả về `201 Created`

Ghi chú:
- Password đã được mã hóa trước khi lưu MongoDB
- Response không trả về password
- Khi test API bằng Postman cần chọn `Body -> raw -> JSON`

### Bước 7: Xây dựng chức năng đăng nhập bằng JWT

Trạng thái: Hoàn thành

Đã thực hiện:
- Cài đặt `@nestjs/jwt`
- Tạo `LoginDto`
- Thêm `JwtModule` vào AuthModule
- Xây dựng API `POST /auth/login`
- Kiểm tra email tồn tại
- So sánh password bằng `bcrypt.compare`
- Tạo JWT access token sau khi đăng nhập thành công
- Test login bằng Postman thành công

Ghi chú:
- JWT hiện dùng secret tạm thời `comic_secret_key`
- Token có thời hạn 1 ngày
- Nếu sai email hoặc password, API trả lỗi `401 Unauthorized`
- `/auth/register` dùng để đăng ký
- `/auth/login` dùng để đăng nhập

### Bước 8: Cấu hình port riêng cho Auth Service

Trạng thái: Hoàn thành

Đã thực hiện:
- Sửa `main.ts`
- Chuyển Auth Service từ port `3000` sang port `3001`
- Test lại API `POST /auth/login` thành công trên port `3001`

Ghi chú:
- Port `3000` sẽ dành cho API Gateway
- Auth Service chạy tại `http://localhost:3001`

### Bước 9: Xây dựng JWT Authentication Guard

Trạng thái: Hoàn thành

Đã thực hiện:
- Cài đặt Passport và JWT Strategy
- Tạo `JwtStrategy`
- Tạo `JwtAuthGuard`
- Tạo API `GET /auth/profile`
- Bảo vệ API bằng JWT
- Test Bearer Token bằng Postman thành công

Ghi chú:
- JWT được gửi qua Authorization Header
- Format:
  Authorization: Bearer TOKEN
- Nếu token không hợp lệ hoặc hết hạn:
  API trả `401 Unauthorized`

  ### Bước 10: Dockerize Auth Service

Trạng thái: Hoàn thành

Đã thực hiện:
- Tạo `Dockerfile` cho Auth Service
- Tạo `.dockerignore`
- Build Auth Service bằng Docker
- Thêm Auth Service vào `docker-compose.yml`
- Chạy Auth Service container thành công
- Kết nối Auth Service với MongoDB container bằng hostname `mongodb`
- Test API login thành công qua Docker

Ghi chú:
- Auth Service container tên `comic_auth_service`
- Auth Service chạy ở port `3001`
- Khi chạy trong Docker, không dùng `localhost` để kết nối MongoDB mà dùng tên service `mongodb`