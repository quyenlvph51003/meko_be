const CategoriesRepository=require('../category/category.repository');

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

module.exports=new CategoryService();