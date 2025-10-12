const BaseService=require('../../base_service/base_service');
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
}
module.exports=new CategoriesRepository();
