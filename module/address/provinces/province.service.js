const ProvinceRepository=require('./province.repository');

class ProvinceService{
    async getProvinces(){
        return await ProvinceRepository.getProvinces();
    }
    async getProvinceByCode(code){
        const province= await ProvinceRepository.getProvinceByCode(code);
        if(!province){
            throw new Error('PROVINCE_NOT_FOUND');
        }
        return province;
    }
}
module.exports=new ProvinceService();