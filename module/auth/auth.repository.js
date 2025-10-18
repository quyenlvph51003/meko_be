import BaseService from '../../base_service/base_service.js';


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

export default new AuthRepository();

