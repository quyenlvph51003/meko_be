import ViolationRepo from "./category.violation.repository.js";

class CategoryViolationService{
    async createCategoryViolationService(name){
        return await ViolationRepo.createCategoryViolationRepo(name);
    }
    async updateCategoryViolationService(name,violationId,isActive){
        const violation= await ViolationRepo.getDetailViolationRepo(violationId);
        if(!violation){
           throw new Error("Not found violation");
        }    
        await ViolationRepo.updateCategoryViolationRepo(name,violationId,isActive??violation.is_active);
        return ViolationRepo.getDetailViolationRepo(violationId);
    }
    async deleteCategoryViolationService(violationId){
        const violation= await ViolationRepo.getDetailViolationRepo(violationId);
        if(!violation){
           throw new Error("Not found violation");
        }    
        return await ViolationRepo.deleteCategoryViolationRepo(violationId);
    }
    async getAllViolationService(isActive){
        return await ViolationRepo.getAllViolationrepo(isActive);
    }
    async getDetailViolationService(violationId){
        const violation= await ViolationRepo.getDetailViolationRepo(violationId);
        if(!violation){
           throw new Error("Not found violation");
        }
        return violation;
    }
}   

export default new CategoryViolationService();