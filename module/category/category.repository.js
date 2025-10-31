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
    async getListCategoryRepo(isActive){
        return await this.getAll({is_active:isActive});
    }
   async searchCategoryRepo(searchText, page, size, sort, isActive) {
    const conditions = {};
    console.log(page);
    console.log(size);
    console.log(sort);
    console.log(isActive);
    
    // 🔍 Nếu có từ khoá tìm kiếm
    if (searchText) {
        conditions['$or'] = [
            { name: searchText },
        ];
    }

    // ⚙️ Nếu có lọc trạng thái
    if (isActive !== undefined && isActive !== null && isActive !== '') {
        conditions.is_active = Number(isActive);
    }

    return await this.paginate(Number(page), Number(size), conditions, 'id', sort);
    }

}

export default new CategoryRepository();