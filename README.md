# Movie API - Backend Application

API Backend cho ứng dụng xem phim, được xây dựng với Node.js, Express.js và MongoDB.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Biến môi trường](#biến-môi-trường)
- [Scripts](#scripts)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [API Documentation](#api-documentation)
- [Refactor History](#refactor-history)
- [Tác giả](#tác-giả)

## 🎬 Tổng quan

Movie API là một backend application toàn diện cung cấp các API để quản lý phim, chương trình truyền hình, người dùng, bình luận và nhiều tính năng khác. Dự án tích hợp với TMDB API để lấy thông tin phim và sử dụng Cloudflare R2 để lưu trữ phụ đề.

## ✨ Tính năng

- 🔐 **Xác thực người dùng**: JWT Authentication, Google OAuth 2.0
- 🎥 **Quản lý Media**: Quản lý phim và chương trình truyền hình
- 📺 **Video Streaming**: Hỗ trợ streaming video cho phim và tập phim
- 📝 **Quản lý Phụ đề**: Upload và quản lý phụ đề trên Cloudflare R2
- 💬 **Bình luận**: Hệ thống bình luận cho phim và chương trình
- ❤️ **Yêu thích**: Quản lý danh sách yêu thích của người dùng
- 👨‍💼 **Admin Dashboard**: Quản lý nội dung cho admin
- 🔍 **Tìm kiếm**: Tìm kiếm phim, chương trình TV và từ khóa
- 🎭 **TMDB Integration**: Tích hợp với The Movie Database API
- ⚡ **Real-time**: Sử dụng Socket.io cho các tính năng real-time

## 🛠 Công nghệ sử dụng

### Backend Core

- **Node.js** v20.x
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

### Authentication & Security

- **JWT** (jsonwebtoken) - Token-based authentication
- **bcrypt** - Password hashing
- **Google OAuth 2.0** - Social login

### Storage & Media

- **Cloudflare R2** (AWS S3-compatible) - Subtitle storage
- **Multer** - File upload middleware
- **Sharp** - Image processing

### External APIs

- **TMDB API** - Movie and TV show data

### Other Technologies

- **Socket.io** - Real-time communication
- **Nodemailer** - Email sending
- **Joi** - Validation
- **Axios** - HTTP client
- **Babel** - JavaScript transpiler
- **ESLint & Prettier** - Code formatting

## 📦 Yêu cầu hệ thống

- Node.js v20.x hoặc cao hơn
- MongoDB
- npm hoặc yarn
- Tài khoản TMDB API
- Tài khoản Cloudflare R2 (cho subtitle storage)
- Google OAuth credentials (nếu sử dụng Google login)

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd movie-api
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` trong thư mục gốc và cấu hình các biến môi trường theo mẫu dưới đây:

```env
# Application
BASE_URL=http://localhost:5000
LOCAL_DEV_APP_HOST=localhost
LOCAL_DEV_APP_PORT=5000
PRODUCT_APP_HOST=your-production-url.com
BUILD_MODE=dev
AUTHOR=Hoang Vinh 2504

# Database
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=movie_app

# JWT Secrets
ACCESS_TOKEN_SECRET=your-access-token-secret-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key

# TMDB API
TMDB_KEY=your-tmdb-api-key
TMDB_BASE_URL=https://api.themoviedb.org/3

# Email Configuration
EMAIL_NAME=your-email@gmail.com
EMAIL_PASS=your-email-app-password

# Google OAuth
CLIENT_URL_REDIRECT=http://localhost:3000
CLIENT_ID_GOOGLE=your-google-client-id
CLIENT_SECRET=your-google-client-secret
REDIRECT_URI=http://localhost:5000/api/v1/auth/google-login

# Cloudflare R2
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_SUBTITLE_BUCKET=subtitles
R2_PUBLIC_URL=https://your-public-url.com
```

### 4. Chạy ứng dụng

#### Development mode

```bash
npm run dev
```

#### Production mode

```bash
npm run build
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:5000` (hoặc port được cấu hình trong `.env`)

## 🔐 Biến môi trường

| Biến                   | Mô tả                                  | Bắt buộc |
| ---------------------- | -------------------------------------- | -------- |
| `BASE_URL`             | URL cơ sở của API                      | ✅       |
| `LOCAL_DEV_APP_HOST`   | Host cho môi trường development        | ✅       |
| `LOCAL_DEV_APP_PORT`   | Port cho môi trường development        | ✅       |
| `PRODUCT_APP_HOST`     | Host cho môi trường production         | ✅       |
| `BUILD_MODE`           | Chế độ build (`dev` hoặc `production`) | ✅       |
| `MONGODB_URI`          | URI kết nối MongoDB                    | ✅       |
| `DATABASE_NAME`        | Tên database MongoDB                   | ✅       |
| `ACCESS_TOKEN_SECRET`  | Secret key cho access token            | ✅       |
| `REFRESH_TOKEN_SECRET` | Secret key cho refresh token           | ✅       |
| `TMDB_KEY`             | API key từ TMDB                        | ✅       |
| `TMDB_BASE_URL`        | Base URL của TMDB API                  | ✅       |
| `EMAIL_NAME`           | Email để gửi mail                      | ✅       |
| `EMAIL_PASS`           | Mật khẩu ứng dụng của email            | ✅       |
| `CLIENT_URL_REDIRECT`  | URL redirect về frontend               | ✅       |
| `CLIENT_ID_GOOGLE`     | Google OAuth Client ID                 | ⚠️       |
| `CLIENT_SECRET`        | Google OAuth Client Secret             | ⚠️       |
| `REDIRECT_URI`         | Redirect URI cho Google OAuth          | ⚠️       |
| `R2_ENDPOINT`          | Endpoint của Cloudflare R2             | ✅       |
| `R2_ACCESS_KEY_ID`     | Access Key ID của R2                   | ✅       |
| `R2_SECRET_ACCESS_KEY` | Secret Access Key của R2               | ✅       |
| `R2_SUBTITLE_BUCKET`   | Tên bucket lưu subtitle                | ✅       |
| `R2_PUBLIC_URL`        | URL công khai để truy cập file         | ⚠️       |

✅ Bắt buộc | ⚠️ Tùy chọn (cần thiết cho tính năng cụ thể)

## 📜 Scripts

| Script                 | Mô tả                                                        |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`          | Chạy ứng dụng ở chế độ development với nodemon và babel-node |
| `npm start`            | Build và chạy ứng dụng ở chế độ production                   |
| `npm run build`        | Build ứng dụng cho production                                |
| `npm run production`   | Build và chạy ứng dụng production                            |
| `npm run lint`         | Kiểm tra lỗi code với ESLint                                 |
| `npm run lint:fix`     | Tự động fix lỗi ESLint                                       |
| `npm run prettier:fix` | Format code với Prettier                                     |
| `npm run clean`        | Xóa thư mục build                                            |

## 📁 Cấu trúc dự án

```
movie-api/
├── src/
│   ├── axios/              # Axios client configuration
│   ├── config/             # Cấu hình ứng dụng
│   │   ├── cloudflare-r2.js
│   │   ├── cors.js
│   │   ├── environment.js
│   │   ├── firebase.js
│   │   └── mongodb.js
│   ├── controllers/        # Controllers xử lý request
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── commentController.js
│   │   ├── favoriteController.js
│   │   ├── linkController.js
│   │   ├── media.controller.js
│   │   ├── mediaUpload.controller.js
│   │   ├── subtitle.controller.js
│   │   ├── userController.js
│   │   └── videoController.js
│   ├── helpers/            # Helper functions
│   │   ├── jwt.helper.js
│   │   └── resolveLangCode.js
│   ├── middlewares/        # Custom middlewares
│   │   ├── errorHandlingMiddleware.js
│   │   ├── isAdmin.js
│   │   ├── subtitleMulter.middleware.js
│   │   ├── token.middleware.js
│   │   └── videoMulter.middleware.js
│   ├── models/             # MongoDB models
│   │   ├── authModel.js
│   │   ├── commentModel.js
│   │   ├── episodeModel.js
│   │   ├── favoriteModel.js
│   │   ├── mediaModel.js
│   │   ├── movieVideoModel.js
│   │   ├── otpModel.js
│   │   ├── tvVideoModel.js
│   │   ├── userModel.js
│   │   └── videoMeidaModel.js
│   ├── routes/             # API routes
│   │   └── v1/
│   │       ├── adminRoutes.js
│   │       ├── authRoutes.js
│   │       ├── commentRoute.js
│   │       ├── favoriteRoutes.js
│   │       ├── index.js
│   │       ├── media.route.js
│   │       ├── mediasUploadRoutes.js
│   │       ├── static.routes.js
│   │       ├── subtitle.route.js
│   │       ├── userRoutes.js
│   │       └── video.route.js
│   ├── services/           # Business logic
│   │   ├── adminServices.js
│   │   ├── authService.js
│   │   ├── commentService.js
│   │   ├── favoriteService.js
│   │   ├── linkService.js
│   │   ├── media.services.js
│   │   ├── mediaUpload.service.js
│   │   ├── otpService.js
│   │   ├── subtitle.service.js
│   │   ├── userService.js
│   │   └── videoService.js
│   ├── sockets/            # Socket.io configuration
│   │   └── Socket.js
│   ├── tmdb/               # TMDB API integration
│   │   ├── tmdb.api.js
│   │   ├── tmdb.config.js
│   │   └── tmdb.endpoints.js
│   ├── utils/              # Utility functions
│   │   ├── algorithms.js
│   │   ├── ApiError.js
│   │   ├── constants.js
│   │   ├── file.js
│   │   ├── formatters.js
│   │   ├── generateKey.js
│   │   ├── generateR2Key.js
│   │   ├── hashPassword.js
│   │   ├── multerFile.js
│   │   ├── sanitizeFileName.js
│   │   ├── validators.js
│   │   └── wrapRequestHandler.js
│   ├── validations/        # Request validation schemas
│   │   ├── adminValidation.js
│   │   ├── authValidation.js
│   │   ├── commentValidation.js
│   │   ├── favoriteValidation.js
│   │   ├── linkValidation.js
│   │   ├── subtitleValidation.js
│   │   └── userValidation.js
│   └── index.js            # Entry point
├── .env                    # Environment variables
├── .babelrc               # Babel configuration
├── .eslintrc.cjs          # ESLint configuration
├── package.json
└── README.md
```

## 📚 API Documentation

Base URL: `http://localhost:5000/api/v1`

### 🔐 Authentication Routes (`/auth`)

| Method | Endpoint         | Mô tả                       | Auth Required      |
| ------ | ---------------- | --------------------------- | ------------------ |
| POST   | `/signup`        | Đăng ký tài khoản mới       | ❌                 |
| POST   | `/login`         | Đăng nhập                   | ❌                 |
| GET    | `/google-login`  | Đăng nhập bằng Google OAuth | ❌                 |
| POST   | `/refresh-token` | Làm mới access token        | ✅ (Refresh Token) |
| POST   | `/logout`        | Đăng xuất                   | ✅                 |

#### Ví dụ: Đăng ký

```json
POST /api/v1/auth/signup
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "SecurePass123",
  "displayName": "User Name"
}
```

#### Ví dụ: Đăng nhập

```json
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### 👤 User Routes (`/user`)

| Method | Endpoint           | Mô tả                    | Auth Required |
| ------ | ------------------ | ------------------------ | ------------- |
| GET    | `/info`            | Lấy thông tin người dùng | ✅            |
| POST   | `/update-profile`  | Cập nhật profile         | ✅            |
| PATCH  | `/update-password` | Đổi mật khẩu             | ✅            |
| PATCH  | `/delete`          | Xóa tài khoản            | ✅            |
| POST   | `/check-email`     | Kiểm tra email tồn tại   | ❌            |
| POST   | `/send-email`      | Gửi email xác thực       | ❌            |
| POST   | `/forgot-password` | Quên mật khẩu            | ❌            |

#### Ví dụ: Cập nhật profile

```json
POST /api/v1/user/update-profile
Content-Type: multipart/form-data
Authorization: Bearer <access_token>

{
  "displayName": "New Name",
  "imageAvatar": <file>
}
```

### 🎬 Media Routes (`/media`)

| Method | Endpoint                                       | Mô tả                       | Auth Required |
| ------ | ---------------------------------------------- | --------------------------- | ------------- |
| GET    | `/:mediaType/trending/:timeWindow`             | Lấy phim/show đang trending | ❌            |
| GET    | `/:mediaType/discover`                         | Khám phá theo thể loại      | ❌            |
| GET    | `/:mediaType/detail/:mediaId`                  | Chi tiết phim/show          | ❌            |
| GET    | `/:mediaType/search`                           | Tìm kiếm phim/show          | ❌            |
| GET    | `/:mediaType/:mediaCategory`                   | Lấy danh sách theo category | ❌            |
| GET    | `/:mediaType/:series_id/season/:season_number` | Chi tiết season             | ❌            |
| GET    | `/keywords/search`                             | Tìm kiếm từ khóa            | ❌            |

**Parameters:**

- `mediaType`: `movie` hoặc `tv`
- `timeWindow`: `day` hoặc `week`
- `mediaCategory`: `popular`, `top_rated`, `now_playing`, v.v.

#### Ví dụ: Lấy phim trending

```
GET /api/v1/media/movie/trending/week
```

#### Ví dụ: Tìm kiếm phim

```
GET /api/v1/media/movie/search?query=avengers&page=1
```

### ❤️ Favorite Routes (`/favorite`)

| Method | Endpoint | Mô tả                   | Auth Required |
| ------ | -------- | ----------------------- | ------------- |
| POST   | `/`      | Thêm vào yêu thích      | ✅            |
| GET    | `/`      | Lấy danh sách yêu thích | ✅            |
| DELETE | `/:id`   | Xóa khỏi yêu thích      | ✅            |

#### Ví dụ: Thêm vào yêu thích

```json
POST /api/v1/favorite
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "mediaId": "12345",
  "mediaType": "movie",
  "title": "Avengers",
  "poster": "poster-url"
}
```

### 💬 Comment Routes (`/comment`)

| Method | Endpoint                           | Mô tả          | Auth Required |
| ------ | ---------------------------------- | -------------- | ------------- |
| POST   | `/add-comment`                     | Thêm bình luận | ✅            |
| GET    | `/get-comment/:movieType/:movieId` | Lấy bình luận  | ❌            |

#### Ví dụ: Thêm bình luận

```json
POST /api/v1/comment/add-comment
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "movieType": "movie",
  "movieId": "12345",
  "content": "Great movie!",
  "rating": 5
}
```

### 📺 Playback Routes (`/playback`)

**Mục đích:** Lấy thông tin playback (video sources + subtitles) đã được admin thêm vào database để frontend có thể phát video.

| Method | Endpoint         | Mô tả                                      | Query Parameters                  | Auth Required |
| ------ | ---------------- | ------------------------------------------ | --------------------------------- | ------------- |
| GET    | `/movie/:tmdbId` | Lấy video sources và subtitles cho phim    | -                                 | ❌            |
| GET    | `/tv/:tmdbId`    | Lấy video sources và subtitles cho episode | `episode_id`, `season`, `episode` | ❌            |

**Query Parameters cho TV endpoint:**

- `episode_id` (required): ID của episode tmdb
- `season` (required): Số season (vd: 1, 2, 3...)
- `episode` (required): Số tập trong season (vd: 1, 2, 3...)

**Response trả về:**

- Danh sách video sources (streaming links với quality, server)
- Danh sách subtitles (VTT files từ R2 với language, label)
- Metadata của movie/episode

#### Ví dụ: Lấy playback info cho phim

```
GET /api/v1/playback/movie/12345
```

**Response mẫu:**

```json
{
  "success": true,
  "data": {
    "videoLinks": [
      {
        "quality": "1080p",
        "url": "https://streaming-server.com/movie-12345",
        "server": "Server 1"
      },
      {
        "quality": "720p",
        "url": "https://streaming-server.com/movie-12345-hd",
        "server": "Server 2"
      }
    ],
    "subtitles": [
      {
        "language": "vi",
        "label": "Tiếng Việt",
        "url": "https://r2.cloudflare.com/subtitles/movie-12345-vi.vtt"
      },
      {
        "language": "en",
        "label": "English",
        "url": "https://r2.cloudflare.com/subtitles/movie-12345-en.vtt"
      }
    ],
    "movieInfo": {
      "tmdbId": 12345,
      "title": "Avengers: Endgame",
      "duration": 181,
      "releaseDate": "2019-04-26"
    }
  }
}
```

#### Ví dụ: Lấy playback info cho episode

```
GET /api/v1/playback/tv/1399?episode_id=123&season=1&episode=1
```

**Parameters:**

- `tmdbId`: 1399 (ID của TV show trên TMDB)
- `episode_id`: 123 (ID episode trên TMDB)
- `season`: 1 (Season 1)
- `episode`: 1 (Episode 1)

**Validation:**

- Tất cả parameters đều bắt buộc
- Tất cả parameters phải là số nguyên
- `season` và `episode` phải >= 1
- Nếu thiếu hoặc sai format sẽ trả về lỗi 422 Unprocessable Entity

**Error Response (Validation Failed):**

```json
{
  "success": false,
  "statusCode": 422,
  "message": "Episode ID is required, Season number is required"
}
```

### 📝 Subtitle Routes (`/subtitle`)

| Method | Endpoint | Mô tả                 | Auth Required |
| ------ | -------- | --------------------- | ------------- |
| GET    | `/`      | Lấy nội dung subtitle | ❌            |

**Query Parameters:**

- `r2_key`: R2 key của subtitle file

#### Ví dụ: Lấy subtitle

```
GET /api/v1/subtitle?r2_key=subtitles/movie-12345-vi.vtt
```

### 👨‍💼 Admin Routes (`/admin`)

**Lưu ý:** Tất cả admin routes yêu cầu authentication và quyền admin.

#### Movies Management

| Method | Endpoint           | Mô tả                |
| ------ | ------------------ | -------------------- |
| POST   | `/movies`          | Tạo movie mới        |
| GET    | `/movies`          | Lấy danh sách movies |
| GET    | `/movies/:mediaId` | Lấy chi tiết movie   |
| PUT    | `/movies/:mediaId` | Cập nhật movie       |
| DELETE | `/movies/:mediaId` | Xóa movie            |

#### Movie Video Links

| Method | Endpoint                               | Mô tả               |
| ------ | -------------------------------------- | ------------------- |
| POST   | `/movies/:movieId/video-links`         | Thêm video link     |
| PATCH  | `/movies/:movieId/video-links/:linkId` | Cập nhật video link |
| DELETE | `/movies/:movieId/video-links/:linkId` | Xóa video link      |

#### Movie Subtitle Links

| Method | Endpoint                                  | Mô tả                  |
| ------ | ----------------------------------------- | ---------------------- |
| POST   | `/movies/:movieId/subtitle-links`         | Thêm subtitle link     |
| PATCH  | `/movies/:movieId/subtitle-links/:linkId` | Cập nhật subtitle link |
| DELETE | `/movies/:movieId/subtitle-links/:linkId` | Xóa subtitle link      |

#### TV Shows Management

| Method | Endpoint             | Mô tả                  |
| ------ | -------------------- | ---------------------- |
| POST   | `/tv-shows`          | Tạo TV show mới        |
| GET    | `/tv-shows`          | Lấy danh sách TV shows |
| GET    | `/tv-shows/:mediaId` | Lấy chi tiết TV show   |
| PUT    | `/tv-shows/:mediaId` | Cập nhật TV show       |
| DELETE | `/tv-shows/:mediaId` | Xóa TV show            |

#### Episodes Management

| Method | Endpoint                                  | Mô tả                    |
| ------ | ----------------------------------------- | ------------------------ |
| POST   | `/tv-shows/:tvShowId/episodes`            | Thêm episode             |
| GET    | `/tv-shows/:tvShowId/episodes`            | Lấy danh sách episodes   |
| GET    | `/tv-shows/:tvShowId/episodes/lookup`     | Tìm episode theo TMDB ID |
| GET    | `/tv-shows/:tvShowId/episodes/:episodeId` | Lấy chi tiết episode     |
| PUT    | `/tv-shows/:tvShowId/episodes/:episodeId` | Cập nhật episode         |
| DELETE | `/tv-shows/:tvShowId/episodes/:episodeId` | Xóa episode              |

#### Episode Video Links

| Method | Endpoint                                                      | Mô tả               |
| ------ | ------------------------------------------------------------- | ------------------- |
| POST   | `/tv-shows/:tvShowId/episodes/:episodeId/video-links`         | Thêm video link     |
| PATCH  | `/tv-shows/:tvShowId/episodes/:episodeId/video-links/:linkId` | Cập nhật video link |
| DELETE | `/tv-shows/:tvShowId/episodes/:episodeId/video-links/:linkId` | Xóa video link      |

#### Episode Subtitle Links

| Method | Endpoint                                                         | Mô tả                  |
| ------ | ---------------------------------------------------------------- | ---------------------- |
| POST   | `/tv-shows/:tvShowId/episodes/:episodeId/subtitle-links`         | Thêm subtitle link     |
| PATCH  | `/tv-shows/:tvShowId/episodes/:episodeId/subtitle-links/:linkId` | Cập nhật subtitle link |
| DELETE | `/tv-shows/:tvShowId/episodes/:episodeId/subtitle-links/:linkId` | Xóa subtitle link      |

#### Subtitle Management

| Method | Endpoint                   | Mô tả                                  |
| ------ | -------------------------- | -------------------------------------- |
| POST   | `/subtitle/presigned-url`  | Tạo pre-signed URL cho upload subtitle |
| POST   | `/subtitle/presigned-urls` | Tạo nhiều pre-signed URLs              |

#### Ví dụ: Tạo movie mới (Admin)

```json
POST /api/v1/admin/movies
Content-Type: application/json
Authorization: Bearer <admin_access_token>

{
  "tmdbId": "12345",
  "title": "Avengers: Endgame",
  "overview": "Movie description...",
  "releaseDate": "2019-04-26",
  "poster": "poster-url",
  "backdrop": "backdrop-url",
  "genres": ["Action", "Adventure"],
  "runtime": 181
}
```

### Response Format

#### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Success message"
}
```

#### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 👨‍💻 Tác giả

**ZinDev**

---

© 2024 Movie API. All rights reserved.
