import BaseService from "../../../base_service/base_service.js";

class PaymentUsageRepository extends BaseService{
     constructor() {
        super("payment_usages");
    }
}
    
export default new PaymentUsageRepository();

