import BaseService from '../../base_service/base_service.js';
class CategoryRepository extends BaseService{
    constructor(){
        super('categories');
    }
    async createCategoryRepo(category){
        const categories= await this.create(category);
        if(!categories) return;
        return await this.findById(categories.insertId);
    }
    async createManyCategoryRepo(category){
        return await this.createMany(category);
    }
    async updateCategoryRepo(category){
        return await this.updateWhere({id:category.id},category);
    }
    async getCategoryRepoById(id){
        return await this.findById(id);
    }
    async getListCategoryRepo(){
        return await this.getAll();
    }
}

export default new CategoryRepository();