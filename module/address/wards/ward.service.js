import WardRepository from './ward.repository.js';
class WardService{
    async getWards(){
        return await WardRepository.getWards();
    }
    async getWardByCode(code){

        const ward= await WardRepository.getWardByCode(code);
        if(!ward){
            throw new Error('WARD_NOT_FOUND');
        }
        return ward;
    }
    async getWardsByProvinceCode(provinceCode){
        return await WardRepository.getWardsByProvinceCode(provinceCode);
    }
}
export default new WardService();
