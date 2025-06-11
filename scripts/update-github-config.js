#!/usr/bin/env node

/**
 * Script để cập nhật tên người dùng GitHub và tên repo trong tất cả các file cấu hình
 * 
 * Sử dụng: node scripts/update-github-config.js <github-username> [repo-name]
 * Nếu repo-name không được cung cấp, mặc định là "dst-api-webdocs"
 */

const fs = require('fs');
const path = require('path');

// Lấy tham số từ dòng lệnh
const githubUsername = process.argv[2];
const repoName = process.argv[3] || 'dst-api-webdocs';

if (!githubUsername) {
  console.error('Vui lòng cung cấp tên người dùng GitHub của bạn!');
  console.error('Sử dụng: node scripts/update-github-config.js <github-username> [repo-name]');
  process.exit(1);
}

console.log(`Cập nhật cấu hình với tên người dùng GitHub: ${githubUsername} và tên repo: ${repoName}`);

// Đường dẫn đến các file cần cập nhật
const configFilePath = path.join(__dirname, '..', 'docusaurus.config.ts');
const readmeFilePath = path.join(__dirname, '..', 'README.md');

try {
  // Cập nhật docusaurus.config.ts
  let configContent = fs.readFileSync(configFilePath, 'utf8');
  
  configContent = configContent.replace(/url: 'https:\/\/.*?\.github\.io'/g, `url: 'https://${githubUsername}.github.io'`);
  configContent = configContent.replace(/baseUrl: '\/.*?\/'/g, `baseUrl: '/${repoName}/'`);
  configContent = configContent.replace(/organizationName: '.*?'/g, `organizationName: '${githubUsername}'`);
  configContent = configContent.replace(/projectName: '.*?'/g, `projectName: '${repoName}'`);
  configContent = configContent.replace(/href: 'https:\/\/github\.com\/.*?\/.*?'/g, `href: 'https://github.com/${githubUsername}/${repoName}'`);
  
  fs.writeFileSync(configFilePath, configContent);
  console.log('✅ Đã cập nhật docusaurus.config.ts');
  
  // Cập nhật README.md
  let readmeContent = fs.readFileSync(readmeFilePath, 'utf8');
  
  readmeContent = readmeContent.replace(/https:\/\/USERNAME\.github\.io\/.*?/g, `https://${githubUsername}.github.io/${repoName}`);
  
  fs.writeFileSync(readmeFilePath, readmeContent);
  console.log('✅ Đã cập nhật README.md');
  
  console.log('✅ Hoàn tất! Tất cả các cấu hình đã được cập nhật.');
  console.log(`Bây giờ bạn có thể đẩy các thay đổi của mình lên GitHub và trang web của bạn sẽ được triển khai tại: https://${githubUsername}.github.io/${repoName}`);
} catch (error) {
  console.error('❌ Đã xảy ra lỗi khi cập nhật cấu hình:', error);
  process.exit(1);
}
