# read-vietnamese-number-js

[![](https://data.jsdelivr.com/v1/package/npm/read-vietnamese-number/badge?style=rounded)](https://www.jsdelivr.com/package/npm/read-vietnamese-number)
[![Check Code](https://github.com/tonghoangvu/read-vietnamese-number-js/actions/workflows/check-code.yml/badge.svg)](https://github.com/tonghoangvu/read-vietnamese-number-js/actions/workflows/check-code.yml)
[![Publish Package](https://github.com/tonghoangvu/read-vietnamese-number-js/actions/workflows/publish-package.yml/badge.svg)](https://github.com/tonghoangvu/read-vietnamese-number-js/actions/workflows/publish-package.yml)
[![Deploy Site](https://github.com/tonghoangvu/read-vietnamese-number-js/actions/workflows/deploy-site.yml/badge.svg)](https://github.com/tonghoangvu/read-vietnamese-number-js/actions/workflows/deploy-site.yml)

Thư viện đọc số thành chữ trong Tiếng Việt, với các tính năng:

- Hỗ trợ số âm, số thập phân, số lớn tùy ý
- Có nhiều tùy chọn: đơn vị tính, dấu phân tách,...
- Hoạt động tốt trong trình duyệt và Node.js

Hỗ trợ TypeScript, tương thích với JavaScript từ ES6 trở lên.
Hoạt động với các module system như ESM và CommonJS.

Live demo tại https://tonghoangvu.github.io/read-vietnamese-number-js/.

Bạn cũng có thể test nhanh thư viện với `npx` command mà không cần cài đặt.

```bash
npx read-vietnamese-number 3.14
# ba chấm mười bốn đơn vị
```

## Installation

Cài đặt thư viện với NPM, Yarn hoặc các package manager khác.

```bash
# NPM
npm install read-vietnamese-number

# Yarn
yarn add read-vietnamese-number
```

Hoặc sử dụng trực tiếp trong browser thông qua CDN (hoặc tự host).
Chú ý nên kèm theo version cố định trong CDN URL, ví dụ như https://cdn.jsdelivr.net/npm/read-vietnamese-number@2.0.0/+esm (đây không phải version mới nhất).

```html
<script type="module">
  import {} from 'https://cdn.jsdelivr.net/npm/read-vietnamese-number/+esm'
  // ...
</script>
```

## Usage

Cách sử dụng gồm 3 bước:

- Tạo cấu hình đọc số và điều chỉnh phù hợp
- Đọc chuỗi số với cấu hình đã tạo
- Xử lý lỗi phát sinh

### Code example

```js
import {
  InvalidFormatError,
  InvalidNumberError,
  ReadingConfig,
  doReadNumber,
} from 'read-vietnamese-number' // or CDN URL

// Config reading options
const config = new ReadingConfig()
config.unit = ['đồng']

try {
  // Start reading
  const number = '-12345.6789'
  const result = doReadNumber(config, number)
  console.log(result)
} catch (err) {
  // Handle errors
  if (err instanceof InvalidFormatError) {
    console.error('Định dạng input không hợp lệ')
  } else if (err instanceof InvalidNumberError) {
    console.error('Số không hợp lệ')
  }
}
```

### Error handling

Thư viện ném ra 2 loại `RvnError` sau nếu có lỗi trong quá trình đọc số:

- `InvalidFormatError` khi input không hợp lệ
- `InvalidNumberError` khi số chứa ký tự không hợp lệ

Hàm `doReadNumber()` chấp nhận input là `string` và `bigint`, ném `InvalidFormatError` với các trường hợp khác.
Hành vi này liên quan đến các vấn đề định dạng số của JavaScript (tràn số, mất độ chính xác,...).

Từ version 2.2.0, thư viện hỗ trợ đọc số với độ lớn không giới hạn.
Nên nâng cấp lên version này để tránh các vấn đề khi đọc số lớn (issue [#38](https://github.com/tonghoangvu/read-vietnamese-number-js/issues/38)).

Với các version cũ hơn, thư viện sẽ ném `NotEnoughUnitError` nếu cấu hình đọc số không có đủ số lượng đơn vị phù hợp.
Nên giới hạn độ lớn số nhập vào cho phù hợp với các đơn vị hiện có (mặc định hỗ trợ đến `tỉ tỉ`).
Ngoài ra có thể xử lý bằng cách thêm các đơn vị lớn hơn vào cấu hình (không khuyến khích).
