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