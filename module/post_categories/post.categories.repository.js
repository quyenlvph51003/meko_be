import BaseService from '../../base_service/base_service.js';
class CategoriesRepository extends BaseService{
    constructor(){
        super('post_categories');
    }
    async createPostCategoriesRepo(postCategories){
        return await this.create(postCategories);
    }
    async createManyPostCategoriesRepo(postCategories){
        return await this.createMany(postCategories);
    }
    async updatePostCategoriesRepo(postCategories){
        return await this.updateWhere({id:postCategories.id},postCategories);
    }
    async getPostCategoriesRepoById(id){
        return await this.findById(id);
    }
    async getListPostCategoriesRepo(){
        return await this.getAll();
    }
    async deletePostCategories(postId){
        return await this.deleteWhere({post_id:postId});
    }
}
export default new CategoriesRepository();
