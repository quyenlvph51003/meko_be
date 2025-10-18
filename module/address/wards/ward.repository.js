import repository from '../../../base_service/base_service.js';

class WardRepository extends repository{
    constructor(){
        super('wards');
    }
    async getWards(){
        return await this.getAll();
    }
    async getWardByCode(code){
        return await this.findById(code,['*'],'code');
    }
    async getWardsByProvinceCode(provinceCode){
        return await this.getAll({province_code:provinceCode});
    }
}
export default new WardRepository();