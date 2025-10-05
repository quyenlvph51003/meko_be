const AuthRepository=require('./auth.repository');
const bcrypt=require('bcrypt');
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

}

module.exports=new AuthService();
