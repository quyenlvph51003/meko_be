import PaymentRepository from "../repository/payment.repository.js";
import UserRepo from "../../users/user.repository.js";
import PaymentPackagesRepository from "../../payment_packages/payment.packages.repository.js";
import bcrypt from 'bcrypt';
import database from '../../../config/db.js';
import userRepository from "../../users/user.repository.js";

//user mua gói
const createPayment = async (payment) => {
    const {userId,packageId,amount,pinWallet}=payment;
    const user=await UserRepo.findById(userId);
    if(!user){
        throw new Error("User not found");
    }
    if(!user.pin_wallet){
        throw new Error('You have not wallet');
    }
    const comparePinWallet=await bcrypt.compare(pinWallet,user.pin_wallet);
    if(!comparePinWallet){
        throw new Error("Pin wallet not valid");
    }

    const paymentPackageExists=await PaymentPackagesRepository.findById(packageId);
    if(!paymentPackageExists){
        throw new Error("Package not found");
    }

    //check giá amout phải khớp
    if(Number(amount) !== Number(paymentPackageExists.price)){
        throw new Error("Amount not match");
    }

    // thêm thời gian hết hạn của gói vào
    // chuyển expired_at thành số ngày
    // const days = Number(paymentPackageExists.expired_at);
    const expiredAt = new Date(Date.now() + paymentPackageExists.expired_at * 24 * 60 * 60 * 1000);
    console.log(expiredAt);
    console.log( paymentPackageExists.expired_at);
    
    
    const useageLimit=paymentPackageExists.usage_limit;
    // trừ tiền trong ví
    const wallet_balance=Number(user.wallet_balance)-Number(amount);
    if(wallet_balance<0){
        throw new Error("Not enough balance");
    }
    await UserRepo.update(userId,{wallet_balance:wallet_balance});


    const paymentSave={
        user_id:userId,
        package_id:packageId,
        amount:amount,
        expired_at:expiredAt,
        usage_remaining:useageLimit,
        transaction_code:generateTransactionCode(),
        duration_used:paymentPackageExists.duration_days
    }

    return await PaymentRepository.create(paymentSave);
}

const getPayment = async (paymentId) => {
    return await PaymentRepository.findById(paymentId);
}

const getPayments = async () => {
    return await PaymentRepository.getAll();
}

const updatePayment = async (paymentId, payment) => {
    return await PaymentRepository.update(paymentId, payment);
}

const deletePayment = async (paymentId) => {
    return await PaymentRepository.delete(paymentId);
}

const getPaymentsByUserId = async (userId)=>{
    const userExits=await userRepository.findById(userId);
    
    if(!userExits){
        throw new Error('User Not Found');
    }
    const query = `SELECT 
                    p.*,
                    pp.name AS package_name,
                    pp.usage_limit
                FROM payments p
                LEFT JOIN payment_packages pp ON p.package_id = pp.id
                WHERE 
                    p.user_id = ${userId}
                    AND p.expired_at >= NOW()    -- còn hạn
                ORDER BY 
                    pp.status = 0 DESC,            -- status=0 lên đầu
                    p.expired_at ASC;             -- ưu tiên gói sắp hết hạn`;
    
    const [raw] = await database.pool.query(query);        
    return raw;        
}




function generateTransactionCode() {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const time = Date.now();
    return `MEKO_${time}_${random}`;
}
export default {
    createPayment,
    getPayment,
    getPayments,
    updatePayment,
    deletePayment,
    getPaymentsByUserId
}
