import BaseService from '../../base_service/base_service.js';

class UserRepository extends BaseService{
    constructor(){
        super('users');
    }
    async findByEmailUserRepo(email){
        return await this.findByEmail(email);
    }S
    async findByIdUserRepo(id){
        return await this.findById(id);
    }
    async createUserRepo(user){
        return await this.create(user);
    }
    async updateUserRepo(user){
        return await this.updateWhere({email:user.email},user);
    }
    async updateUserRepoById(id,user){
        return await this.updateWhere({id:id},user);
    }
    async searchUserRepo(page,size,conditions,orderBy,sort){
        return await this.paginate(page,size,conditions,orderBy,sort);
    }
}

export default new UserRepository();
