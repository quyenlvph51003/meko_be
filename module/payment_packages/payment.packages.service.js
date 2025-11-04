import PaymentPackagesRepository from "./payment.packages.repository.js";
class PaymentPackagesService {
    async createPaymentPackage(paymentPackage) {
        return await PaymentPackagesRepository.create({
            name: paymentPackage.name,
            price: paymentPackage.price,
            description: paymentPackage.description,
            duration_days: paymentPackage.durationDays,
            usage_limit: paymentPackage.usageLimit
        });
    }
    async updatePaymentPackage(id,paymentPackage) {
        const paymentPackageExists = await PaymentPackagesRepository.findById(id);
        if(!paymentPackageExists){
            throw new Error('Payment package not found');
        }
        const  result= await PaymentPackagesRepository.update(id,{
            name: paymentPackage.name??paymentPackageExists.name,
            price: paymentPackage.price??paymentPackageExists.price,
            description: paymentPackage.description??paymentPackageExists.description,
            duration_days: paymentPackage.durationDays??paymentPackageExists.duration_days,
            usage_limit: paymentPackage.usageLimit??paymentPackageExists.usage_limit,
            is_active: paymentPackage.isActive??paymentPackageExists.is_active
        });
        if(result){
            return await PaymentPackagesRepository.findById(id);
        }
        return null;
    }
    async getPaymentPackage(id) {
        return await PaymentPackagesRepository.findById(id);
    }
    async getAllPaymentPackage(isActive) {
        return await PaymentPackagesRepository.getAll({is_active:isActive});
    }
}

export default new PaymentPackagesService();
