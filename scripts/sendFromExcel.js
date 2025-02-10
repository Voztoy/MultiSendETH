require("dotenv").config();
const { ethers } = require("ethers");
const xlsx = require("xlsx");
const path = require("path");

const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Thay thế bằng địa chỉ hợp đồng của bạn
const BATCH_SIZE = 500; // Số lượng ví trong mỗi batch

async function sendETHFromExcel() {
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ Lỗi: PRIVATE_KEY không tồn tại trong .env");
    return;
  }

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    contractAddress,
    ["function multiSend(address[] calldata recipients, uint256[] calldata amounts) external payable"],
    wallet
  );

  const filePath = path.join(__dirname, "data.xlsx");
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const recipients = [];
  const amounts = [];
  for (let i = 1; i < data.length; i++) {
    const address = data[i][0];
    const amount = data[i][1];

    if (!ethers.isAddress(address)) {
      console.error(`❌ Địa chỉ không hợp lệ: ${address}`);
      continue;
    }
    if (isNaN(amount) || amount <= 0) {
      console.error(`❌ Số lượng không hợp lệ cho ${address}: ${amount}`);
      continue;
    }

    recipients.push(address);
    amounts.push(ethers.parseEther(amount.toString()));
  }

  if (recipients.length === 0) {
    console.log("❌ Không có địa chỉ hợp lệ trong file Excel.");
    return;
  }

  console.log(`🔄 Tổng cộng ${recipients.length} địa chỉ sẽ nhận ETH.`);
  
  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batchRecipients = recipients.slice(i, i + BATCH_SIZE);
    const batchAmounts = amounts.slice(i, i + BATCH_SIZE);
    const totalAmount = batchAmounts.reduce((acc, val) => acc + val, 0n);

    console.log(`🔄 Đang gửi batch ${i / BATCH_SIZE + 1}: ${batchRecipients.length} địa chỉ...`);
    
    try {
      const tx = await contract.multiSend(batchRecipients, batchAmounts, { value: totalAmount });
      console.log("✅ Transaction Hash:", tx.hash);
      await tx.wait();
      console.log("✅ Batch hoàn tất!");
    } catch (error) {
      console.error("❌ Lỗi khi gửi batch:", error);
    }
  }
}

sendETHFromExcel().catch(console.error);
