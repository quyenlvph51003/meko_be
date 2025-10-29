import { PostStatus } from '../../utils/enum.common.js';
import ResponseUtils from '../../utils/response_utils.js';
import ValidateUtils from '../../utils/validate_utils.js';
const validatonCreatePost=(req,res,next)=>{
    // Kiểm tra field data
    console.log('cascsa ');
    if(!req.body.data){
        return ResponseUtils.validationErrorResponse(res,'Dữ liệu không hợp lệ');
    }
    
    // Parse JSON data
    let data;
    try {
        data = JSON.parse(req.body.data);
    } catch (error) {
        return ResponseUtils.validationErrorResponse(res,'Dữ liệu không đúng định dạng JSON');
    }
    
    const {title, description, categories, userId, wardCode, provinceCode, address, price, phoneNumber} = data;

    if(!title){
        return ResponseUtils.validationErrorResponse(res,'Tiêu đề không được để trống');
    }
    if(!description){
        return ResponseUtils.validationErrorResponse(res,'Mô tả không được để trống');
    }
    
    // Kiểm tra file ảnh (req.files từ multer)
    if (!req.files || req.files.length === 0) {
        return ResponseUtils.validationErrorResponse(res, 'Vui lòng tải lên ít nhất 1 hình ảnh');
    }
    
    // Kiểm tra categories
    if (!Array.isArray(categories) || categories.length === 0) {
        return ResponseUtils.validationErrorResponse(res, 'Danh sách danh mục không hợp lệ hoặc trống');
    }
    
    if(!userId){
        return ResponseUtils.validationErrorResponse(res,'userId không được để trống');
    }
    if(!wardCode){
        return ResponseUtils.validationErrorResponse(res,'ID xã, phường không được để trống');
    }
    if(!provinceCode){
        return ResponseUtils.validationErrorResponse(res,'ID tỉnh, thành phố không được để trống');
    }
    if(!address){
        return ResponseUtils.validationErrorResponse(res,'Địa chỉ không được để trống');
    }
    if(!price || isNaN(Number(price))){
        return ResponseUtils.validationErrorResponse(res,'Giá không hợp lệ');
    }
    if(!phoneNumber || !ValidateUtils.isValidVietnamPhone(phoneNumber)){
        return ResponseUtils.validationErrorResponse(res,'Số điện thoại không hợp lệ');
    }
    // Gán data đã parse vào req để controller sử dụng
    req.body.parsedData = data;
    
    next();
}

const validationUpdatePost=(req,res,next)=>{
    if(!req.body.data){
        return ResponseUtils.validationErrorResponse(res,'Dữ liệu không hợp lệ');
    }
    
    let data;
    try {
        data = JSON.parse(req.body.data);
    } catch (error) {
        return ResponseUtils.validationErrorResponse(res,'Dữ liệu không đúng định dạng JSON');
    }
    
    const {title, description, categories, wardCode, provinceCode, address, price, phoneNumber} = data;
    
    if(!title){
        return ResponseUtils.validationErrorResponse(res,'Tiêu đề không được để trống');
    }
    if(!description){
        return ResponseUtils.validationErrorResponse(res,'Mô tả không được để trống');
    }
    
    if(!wardCode){
        return ResponseUtils.validationErrorResponse(res,'ID xã, phường không được để trống');
    }
    if(!provinceCode){
        return ResponseUtils.validationErrorResponse(res,'ID tỉnh, thành phố không được để trống');
    }
    if(!address){
        return ResponseUtils.validationErrorResponse(res,'Địa chỉ không được để trống');
    }
    if(!price || isNaN(Number(price))){
        return ResponseUtils.validationErrorResponse(res,'Giá không hợp lệ');
    }
    
    if (!Array.isArray(categories) || categories.length === 0) {
        return ResponseUtils.validationErrorResponse(res, 'Danh sách danh mục không hợp lệ hoặc trống');
    }
    
    if(!phoneNumber || !ValidateUtils.isValidVietnamPhone(phoneNumber)){
        return ResponseUtils.validationErrorResponse(res,'Số điện thoại không hợp lệ');
    }
    // Gán data đã parse vào req để controller sử dụng
    req.body.parsedData = data;
    
    next();
}

const validateSearchPost=(req,res,next)=>{
    const allowedFields=['searchText','wardCode','provinceCode','userId','status','categoryIds'];
    const invalidFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
        return ResponseUtils.validationErrorResponse(res, `Các trường ${invalidFields.join(', ')} không hợp lệ`);
    }
    next();
}

const validateUpdateStatusPost=(req,res,next)=>{
 const {status,reasonReject, reasonViolation, violationId}=req.body;
 if(!status){
    return ResponseUtils.validationErrorResponse(res,'Trạng thái không hợp lệ');
 }
 if(status==PostStatus.VIOLATION){
    if(!reasonViolation || !violationId){
        return ResponseUtils.validationErrorResponse(res,'Lí do vi phạm và ID vi phạm không được để trống');
    }
 }
 if(status==PostStatus.REJECTED){
    if(!reasonReject){
        return ResponseUtils.validationErrorResponse(res,'Lí do từ chối không được để trống');
    }
 }
 next();
}

export default {validatonCreatePost,validationUpdatePost,validateSearchPost,validateUpdateStatusPost}