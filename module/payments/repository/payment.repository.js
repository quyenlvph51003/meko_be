import BaseService from "../../../base_service/base_service.js";

class PaymentRepository extends BaseService {
    constructor() {
        super("payment");
    }
}

export default new PaymentRepository();
