const BaseService = require('../../base_service/base_service');
const {pool}=require('../../config/db');

class AuthRepository extends BaseService{
    constructor(){
        super('users');
    }
    async findByEmailAuthRepo(email){
        return await this.findByEmail(email);
    }
    async createAuthRepo(user){
        return await this.create(user);
    }
    async updateAuthRepo(user){
        return await this.updateWhere({email:user.email},user);
    }
    async findRefreshToken(email,refreshToken){
        return await this.findOne({email: email,refresh_token:refreshToken});
    }

}

module.exports=new AuthRepository();

