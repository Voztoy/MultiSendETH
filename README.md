# EVM Auto Batch Transfer

Trước đó cần cài những app sau:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Cài đặt môi trường

Tạo thư mục MultiSendETH mở CMD lên

Trước tiên, bạn cần cài đặt Node.js và thư viện ethers:

npm init -y
npm install hardhat ethers dotenv @nomicfoundation/hardhat-toolbox
npm install xlsx

Sau đó, khởi tạo Hardhat:

npx hardhat

Chọn "Create an empty hardhat.config.js".

2. Viết hợp đồng thông minh
Tạo thư mục contracts/ và tạo file MultiSendETH.sol (copy về)

3. Cấu hình Hardhat
Mở hardhat.config.js và sửa như sau: (copy về)

Tạo file .env để lưu khóa riêng tư:

PRIVATE_KEY=your_private_key_here

Lưu ý key không có 0x ở đầu

4. Triển khai hợp đồng lên Base Chain

Tạo thư mục scripts/ và file deploy.js: (copy về)

Copy fle .env ở bước 3 vào thư mụcscripts/

Chạy lệnh sau để triển khai hợp đồng:

npx hardhat run scripts/deploy.js --network base

Sau khi triển khai, bạn sẽ nhận được địa chỉ hợp đồng! Lưu lại

5. Tương tác với hợp đồng (Gửi ETH)

Tạo hoặc chỉnh sửa file scripts/sendFromExcel.js với nội dung sau: (copy về)

const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Thay thế bằng địa chỉ hợp đồng của bạn
const BATCH_SIZE = 500; // Số lượng ví trong mỗi batch

Tạo file data.xlsx chưa ví ở cột A, số lượng ở cột B

Chạy script để send batch
node scripts/sendFromExcel.js

### MỞ RỘNG

Nếu muốn triển khai trên Optimism (OP Mainnet) hoặc Arbitrum (Arb Mainnet)....., chỉ cần thay đổi

1. Đổi RPC_URL trong file .env
2. Đổi RPC_URL trong sendFromExcel.js
3. Đổi RPC_URL trong hardhat.config.js
4. Chạy lại lệnh triển khai hợp đồng
npx hardhat run scripts/deploy.js --network base
