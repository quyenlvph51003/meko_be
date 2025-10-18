import CategoriesRepository from '../category/category.repository.js';

class CategoryService{
    async createCategoryService(categories){
        return await CategoriesRepository.createCategoryRepo(categories);
    }
    async updateCategoryService(categories){
        return await CategoriesRepository.updateCategoryRepo(categories);
    }
    async getDetailCategoryService(id){
        return await CategoriesRepository.getCategoryRepoById(id);
    }
    async getListCategoryService(){
        return await CategoriesRepository.getListCategoryRepo();
    }
}

export default new CategoryService();