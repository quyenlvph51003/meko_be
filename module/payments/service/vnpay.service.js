
import { VNPay } from 'vnpay/vnpay';
import { ignoreLogger } from 'vnpay/utils';
import UserRepo from '../../users/user.repository.js';
import WalletLogsRepo from '../repository/wallet_logs.repository.js';
class VNPayService {
    constructor() {
        this.vnpay = new VNPay({
            // ⚡ Cấu hình bắt buộc
            tmnCode: process.env.VNP_TMN_CODE,
            secureSecret: process.env.VNP_HASH_SECRET,
            vnpayHost: 'https://sandbox.vnpayment.vn',
            // 🔧 Cấu hình tùy chọn
            testMode: true, // Chế độ test
            hashAlgorithm: 'SHA512', // Thuật toán mã hóa
            enableLog: true, // Bật/tắt log
            loggerFn: ignoreLogger, // Custom logger

            // 🔧 Custom endpoints
            endpoints: {
                paymentEndpoint: 'paymentv2/vpcpay.html',
                queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
                getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
            },
        });
    }

    async createPayment(amount,userId,ipAddr) {
        const user = await UserRepo.findById(userId);
        const date = new Date();
        const orderId = date.getTime().toString();
        if(!user){
            throw new Error("User not found");
        }
       
        const paymentUrl = this.vnpay.buildPaymentUrl({
            vnp_Amount: amount, // 100,000 VND
            vnp_IpAddr: ipAddr,
            vnp_ReturnUrl: process.env.VNP_RETURN_URL,
            vnp_TxnRef: orderId,
            vnp_OrderInfo: `Nap tien vao vi user ${userId}`,
            vnp_Locale: 'vn',
        });
        return paymentUrl;
    }

    async vnp_ReturnUrl(query){
        const result=this.vnpay.verifyReturnUrl(query);
        if (!result.isVerified) {
            throw new Error('Chữ ký không hợp lệ');
        }
        const responseCode = query.vnp_ResponseCode; // '00' là thành công
        const orderId = query.vnp_TxnRef;
        const amount = Number(query.vnp_Amount)/100;
        
        if (responseCode === '00') {
            const userId=await vnpReturnGetUserId(query);
            const user = await UserRepo.findById(userId);
            if(!user){
                throw new Error("User not found");
            }
            const wallet_balance = Number(user.wallet_balance) + Number(amount);
            
            await UserRepo.update(userId,{wallet_balance:wallet_balance});
            await WalletLogsRepo.create({
                user_id:userId,
                amount:amount,
                current_wallet_balance:wallet_balance,
            });
            return 'Thanh toán thành công';
        } else {
            console.log('Thanh toán thất bại');
            
        }
    }
    
       
}

export default new VNPayService();


//lấy ra userId ở query
const vnpReturnGetUserId = async (params) => {
  const orderInfo = decodeURIComponent(params.vnp_OrderInfo || '');
  // Tách userId
  const match = orderInfo.match(/user\s+(\d+)/);
  const userId = match ? match[1] : null;
  console.log(userId);
  
  return userId
};