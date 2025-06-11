# DST API Web Documentation

Trang tài liệu này được xây dựng bằng [Docusaurus](https://docusaurus.io/), một trình tạo trang web tĩnh hiện đại.

## Cài đặt

```bash
npm install
```

## Phát triển cục bộ

```bash
npm start
```

Lệnh này khởi động máy chủ phát triển cục bộ và mở cửa sổ trình duyệt. Hầu hết các thay đổi đều được phản ánh trực tiếp mà không cần khởi động lại máy chủ.

## Build

```bash
npm run build
```

Lệnh này tạo nội dung tĩnh vào thư mục `build` và có thể được phục vụ bằng bất kỳ dịch vụ lưu trữ nội dung tĩnh nào.

## Triển khai

### Triển khai tự động với GitHub Actions

Dự án này đã được cấu hình để tự động triển khai lên GitHub Pages mỗi khi có push vào branch `main`. Quy trình làm việc GitHub Actions sẽ xây dựng trang web và triển khai nó lên GitHub Pages.

Để triển khai lên GitHub Pages:

1. Đẩy thay đổi của bạn lên branch `main` của repository GitHub:
   ```bash
   git add .
   git commit -m "Cập nhật tài liệu"
   git push origin main
   ```

2. GitHub Actions sẽ tự động xây dựng và triển khai trang web của bạn. Bạn có thể theo dõi tiến trình trong tab "Actions" của repository GitHub.

3. Trang web của bạn sẽ có sẵn tại `https://vietnd69.github.io/dst-api-webdocsdst-api-webdocs` (thay thế USERNAME bằng tên người dùng GitHub của bạn).

### Thiết lập GitHub Pages

Trước khi triển khai lần đầu tiên, bạn cần thiết lập GitHub Pages trong repository của mình:

1. Đi tới repository GitHub của bạn và nhấp vào tab "Settings".
2. Cuộn xuống đến phần "GitHub Pages".
3. Trong "Source", chọn "GitHub Actions".
4. Lưu thiết lập.

### Triển khai thủ công

Để triển khai thủ công mà không sử dụng GitHub Actions:

```bash
# Sử dụng SSH
USE_SSH=true npm run deploy

# Không sử dụng SSH
GIT_USER=<Tên người dùng GitHub của bạn> npm run deploy
```

Nếu bạn đang sử dụng GitHub Pages để lưu trữ, lệnh này là một cách thuận tiện để xây dựng trang web và đẩy lên branch `gh-pages`.

## Cấu hình Docusaurus

Trước khi triển khai, đảm bảo cập nhật các cấu hình trong `docusaurus.config.ts`:

```typescript
url: 'https://USERNAME.github.io', // Thay thế USERNAME bằng tên người dùng GitHub của bạn
baseUrl: '/dst-api-webdocs/', // Thay thế bằng tên repository của bạn nếu khác
organizationName: 'USERNAME', // Thường là tên người dùng GitHub của bạn
projectName: 'dst-api-webdocs', // Tên repository GitHub của bạn
```

Để biết thêm thông tin, vui lòng tham khảo [tài liệu chính thức của Docusaurus về triển khai](https://docusaurus.io/docs/deployment).
