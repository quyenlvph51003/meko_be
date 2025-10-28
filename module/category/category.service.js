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
    async getListCategoryService(isActive){
        return await CategoriesRepository.getListCategoryRepo(isActive);
    }
    async searchCategoryService(searchText,page,size,sort,isActive){
        return await CategoriesRepository.searchCategoryRepo(searchText,page,size,sort,isActive);
    }
    async updateIsActiveCategoryService(id){
        const categoryExists=await CategoriesRepository.getCategoryRepoById(id);
        if(!categoryExists) throw new Error('Category not found');
        await CategoriesRepository.updateCategoryRepo({id:id,is_active:categoryExists.is_active===1?0:1});
        return await CategoriesRepository.getCategoryRepoById(id);
    }
}

export default new CategoryService();