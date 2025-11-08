import FavoriteRepository from "./favorite.repository.js";
import Post from "../post/post.repository.js";
import User from "../users/user.repository.js";
import { PostStatus } from "../../utils/enum.common.js";
class FavoriteService {
    constructor() {
        this.favoriteRepository = FavoriteRepository;
    }
    async createFavorite(data){
        const post = await Post.findById(data.postId);
        if(!post){
            throw new Error('Post not found');
        }
        const user = await User.findById(data.userId);
        if(!user){
            throw new Error('User not found');
        }
        if(post.status!==PostStatus.APPROVED){
            throw new Error('Post is not approved');
        }
        const favoriteExists = await this.favoriteRepository.getFavoriteExists(data.postId,data.userId);
        if(favoriteExists){
            throw new Error('Favorite already exists');
        }

        const result = await this.favoriteRepository.createFavorite(data);
        if(result.insertId){
            const favorite = await this.favoriteRepository.getFavoriteById(result.insertId);
            return favorite;
        }
        return null;
    }
    async deleteFavorite(id){
        const favorite = await this.favoriteRepository.getFavoriteById(id);
        if(!favorite){
            throw new Error('Favorite not found');
        }
        await this.favoriteRepository.deleteFavorite(id);
        return true;
    }
    async searchFavoriteService(userId,searchText,page,size){
        const user = await User.findById(userId);
        if(!user){
            throw new Error('User not found');
        }
        const result = await this.favoriteRepository.searchFavorite(userId,searchText,page,size);
        return result;
    }
    async deleteByPostIdUserId(postId,userId){
        const favorite = await this.favoriteRepository.getFavoriteExists(postId,userId);
        if(!favorite){
            throw new Error('Favorite not found');
        }
        await this.favoriteRepository.deleteWhere({post_id:postId,user_id:userId});
        return true;
    }
}

export default new FavoriteService();
