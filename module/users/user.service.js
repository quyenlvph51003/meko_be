
const UserRepository = require('./user.repository');
class UserService{
    async createUser(user){
        return await UserRepository.createUserRepo(user);
    }
    async findByIdUser(id){
        return await UserRepository.findByIdUserRepo(id);
    }
    async findByEmailUser(email){
        return await UserRepository.findByEmailUserRepo(email);
    }
    async updateUser(user){
        await UserRepository.updateUserRepo(user);
        return await UserRepository.findById(user.id);
    }
    async updateUserById(id,user){
        await UserRepository.updateUserRepoById(id,user);
        return await UserRepository.findById(id);
    }

}

module.exports=new UserService();