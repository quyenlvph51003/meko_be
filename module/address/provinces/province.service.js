import ProvinceRepository from './province.repository.js';

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
export default new ProvinceService();