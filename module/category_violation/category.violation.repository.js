import BaseService from "../../base_service/base_service.js";


class CategoryViolationRepository extends BaseService{
    constructor(){
        super("category_violation");
    }

    async createCategoryViolationRepo(name){
        return await this.create({name});
    }

    async updateCategoryViolationRepo(name,violationId){
        return await this.updateWhere({id:violationId},{name});
    }

    async deleteCategoryViolationRepo(violationId){
        return await this.deleteWhere({id:violationId});
    }

    async getAllViolationrepo(){
        return await this.getAll();
    }

    async getDetailViolationRepo(violationId){
        return await this.findById(violationId);
    }
}

export default new CategoryViolationRepository();

