const AuthRepository=require('./auth.repository');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');

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
        
        const mailOptions={
            from: process.env.EMAIL,
            to: email,
            subject: 'Xác nhận tài khoản MeKo',
            text: `Mã OTP của bạn là: ${otp}, mã này có hiệu lực trong 3 phút`
        }

        const transporter= nodemailer.createTransport({
            service:'gmail',
            auth:{
                user: process.env.EMAIL,
                pass: process.env.PASS_EMAIL
            }
        })

        await transporter.sendMail(mailOptions);
        
        user.otp_code=otp;
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

}

module.exports=new AuthService();
