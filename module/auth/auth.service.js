import AuthRepository from './auth.repository.js';
import bcrypt from 'bcrypt';
import PaymenRepo from '../payments/repository/payment.repository.js';
import PaymentPackageRepo from '../payment_packages/payment.packages.repository.js';
// import { Resend } from await import('resend'); // ✅ dynamic import
// const resend = new Resend(process.env.RESEND_API_KEY);

class AuthService{
    async register({email,password,username}){
        const hashedPassword = await bcrypt.hash(password,10);
        const user={
            email,
            password:hashedPassword,
            username
        }
        const result=await AuthRepository.createAuthRepo(user);
        if (result) {
            const resultPaymenPackage = await PaymentPackageRepo.getAll({ status: 0, is_active: 1 });
            if (resultPaymenPackage.length > 0) {
                for (const pkg of resultPaymenPackage) {
                const expiredAt = new Date(Date.now() + pkg.expired_at * 24 * 60 * 60 * 1000);
                await PaymenRepo.create({
                    user_id: result.insertId,
                    amount: 0,
                    transaction_code: 'Meko_free',
                    usage_remaining: pkg.usage_limit,
                    expired_at: expiredAt,
                    package_id:pkg.id
                });
                }
            }
        }
        return result;
    };
    async login({email,password}){
        const user=await AuthRepository.findByEmailAuthRepo(email);
        if(!user){
            throw new Error('Email_NOT_FOUND');
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            throw new Error('PASSWORD_NOT_VALID');
        }
        console.log(user.is_active);
        
        if(user.is_active===0){
            throw new Error('USER_NOT_ACTIVE');
        }
        return user;
    }
    
    async updateWhereService(user){
        return await AuthRepository.updateAuthRepo(user);
    }

    async refreshTokenService(email,refreshToken){
     const user=await AuthRepository.findRefreshToken(email,refreshToken);  
     
     if(!user){
        throw new Error('INVALID_TOKEN');
     }
     return user;
    
    }

    async requestOtpService(email){
        const user=await AuthRepository.findByEmailAuthRepo(email);
        if(!user){
            throw new Error('Email_NOT_FOUND');
        }
        const otp=Math.floor(100000 + Math.random() * 900000);
        
        user.otp_code='123456';
        user.otp_expired=new Date(Date.now()+3*60*1000);
        
        await AuthRepository.updateAuthRepo(user);
        
        return user;
    }

    async verifyOtpService(email,otp){
        const user=await AuthRepository.findByEmailAuthRepo(email);
        
        if(!user){
            throw new Error('Email_NOT_FOUND');
        }
        if(user.otp_code!==otp){
            throw new Error('OTP_NOT_VALID');
        }
        if(user.otp_expired<Date.now()){
            throw new Error('OTP_EXPIRED');
        }
        return user;
    }

    async changePassService(email,passwordOld,passwordNew){
        const user=await AuthRepository.findByEmailAuthRepo(email);
        if(!user){
            throw new Error('Email_NOT_FOUND');
        }
        const isPasswordValid=await bcrypt.compare(passwordOld,user.password);
        if(!isPasswordValid){
            throw new Error('PASSWORD_NOT_VALID');
        }
        const hashedPassword = await bcrypt.hash(passwordNew,10);
        user.password=hashedPassword;
        await AuthRepository.updateAuthRepo(user);
        return user;
    }

    async forgotPassService(email,password){
        const user=await AuthRepository.findByEmailAuthRepo(email);
        if(!user){
            throw new Error('Email_NOT_FOUND');
        }
        const hashedPassword = await bcrypt.hash(password,10);
        
        if(user.otp_expired<Date.now()){
            throw new Error('OTP_EXPIRED');
        }
        user.password=hashedPassword;
        await AuthRepository.updateAuthRepo(user);
        
        return user;
    }
}

export default new AuthService();
