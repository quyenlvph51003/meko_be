
import BaseService from '../../../base_service/base_service.js';

class ProvinceRepository extends BaseService{
    constructor(){
        super('provinces');
    }
    async getProvinces(){
        return await this.getAll();
    }
    async getProvinceByCode(code){
        return await this.findById(code,['*'],'code');
    }
}
export default new ProvinceRepository();    