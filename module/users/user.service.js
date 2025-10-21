
import UserRepository from './user.repository.js';
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex special chars
  }
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
    async searchUser(page,size,searchText,orderBy,sort){
        const conditions={};
        if(searchText){
            // Tìm kiếm gần đúng theo nhiều trường
            conditions['$or'] = [
                { username: searchText },
                { email: searchText },
                { id: searchText }
            ];
        }
        return await UserRepository.searchUserRepo(page,size,conditions,orderBy,sort);
    }

}

export default new UserService();