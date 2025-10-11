
const BaseService = require('../../../base_service/base_service');

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
module.exports=new ProvinceRepository();    