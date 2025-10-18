import AuthRepository from './auth.repository.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
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
        return await AuthRepository.createAuthRepo(user);
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
        const { Resend } = await import('resend'); // ✅ dynamic import
        const resend = new Resend(process.env.RESEND_API_KEY);

        const user=await AuthRepository.findByEmailAuthRepo(email);
        if(!user){
            throw new Error('Email_NOT_FOUND');
        }
        const otp=Math.floor(100000 + Math.random() * 900000);
        
    //    const response=await resend.emails.send({
    //     from: 'onboarding@resend.dev', // ví dụ: 'noreply@meko.vn'
    //     to: 'quyenlvph51003@gmail.com',
    //     subject: 'Xác nhận tài khoản MeKo',
    //     text: `Mã OTP của bạn là: ${otp}, mã này có hiệu lực trong 3 phút`,
    //     html: `
    //         <div style="
    //         font-family: Arial, sans-serif;
    //         background-color: #f8f9fa;
    //         padding: 20px;
    //         border-radius: 10px;
    //         max-width: 400px;
    //         margin: auto;
    //         border: 1px solid #e0e0e0;
    //         ">
    //         <h2 style="color: #2c3e50; text-align: center;">Xác nhận tài khoản MeKo</h2>
    //         <p style="color: #555; text-align: center; font-size: 15px;">
    //             Xin chào!<br/>
    //             Đây là mã OTP của bạn, vui lòng không chia sẻ cho người khác.
    //         </p>
    //         <div style="
    //             background-color: #007bff;
    //             color: white;
    //             font-size: 24px;
    //             letter-spacing: 3px;
    //             text-align: center;
    //             padding: 10px 0;
    //             border-radius: 8px;
    //             margin: 20px auto;
    //             width: 200px;
    //         ">
    //             <b>${otp}</b>
    //         </div>
    //         <p style="color: #555; text-align: center; font-size: 14px;">
    //             Mã có hiệu lực trong <b>3 phút</b> kể từ khi nhận được email này.
    //         </p>
    //         <p style="text-align: center; color: #aaa; font-size: 12px; margin-top: 20px;">
    //             © ${new Date().getFullYear()} MeKo. Mọi quyền được bảo lưu.
    //         </p>
    //         </div>
    //     `,
    //     });
    
        // console.log(response);

        user.otp_code='123456';
        user.otp_expired=new Date(Date.now()+3*60*1000);
        
        await AuthRepository.updateAuthRepo(user);
        console.log(user);
        
        return user;
    }

    async verifyOtpService(email,otp){
        const user=await AuthRepository.findByEmailAuthRepo(email);
        console.log(user);
        console.log(otp);
        
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

}

export default new AuthService();
