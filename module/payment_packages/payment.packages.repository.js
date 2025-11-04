import BaseService from "../../base_service/base_service.js";

class PaymentPackagesRepository extends BaseService {
    
    constructor() {
        super('payment_packages');
    }

}

export default new PaymentPackagesRepository();
