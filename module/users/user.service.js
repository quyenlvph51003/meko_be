
import UserRepository from './user.repository.js';
import bcrypt from 'bcrypt';
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
            ];
        }
        return await UserRepository.searchUserRepo(page,size,conditions,orderBy,sort);
    }

    async createPinWallet(pinWallet,userId){
        const hashedPinWallet=await bcrypt.hash(pinWallet,10);
        return await UserRepository.update(userId,{pin_wallet:hashedPinWallet});
    }
    async updatePinWallet(pinWalletNew,pinWalletOld,userId){
        const user=await UserRepository.findById(userId);
        const comparePinWalletOld=await bcrypt.compare(pinWalletOld,user.pin_wallet);

        if(!user){
            throw new Error('User not found');
        }
        if(!comparePinWalletOld){
            throw new Error('Pin wallet old not valid');
        }
        const hashedPinWalletNew=await bcrypt.hash(pinWalletNew,10);
        return await UserRepository.update(userId,{pin_wallet:hashedPinWalletNew});
    }

}

export default new UserService();