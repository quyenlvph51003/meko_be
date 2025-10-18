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
        
        const mailOptions={
            from: process.env.EMAIL,
            to: email,
            subject: 'Xác nhận tài khoản MeKo',
            text: `Mã OTP của bạn là: ${otp}, mã này có hiệu lực trong 3 phút`
        }

        const transporter= nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:465,  /// hoặc 587 nếu muốn dùng STARTTLS
            secure:true, // true nếu port là 465, false nếu port là 587
            auth:{
                user: process.env.EMAIL,
                pass: process.env.PASS_EMAIL
            },
            connectionTimeout: 10000,
        
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

module.exports=new AuthService();
