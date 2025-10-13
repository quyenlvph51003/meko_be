const {validationErrorResponse}=require('../../utils/response_utils');

const validatonCreatePost=(req,res,next)=>{
    // Kiểm tra field data
    if(!req.body.data){
        return validationErrorResponse(res,'Dữ liệu không hợp lệ');
    }
    
    // Parse JSON data
    let data;
    try {
        data = JSON.parse(req.body.data);
    } catch (error) {
        return validationErrorResponse(res,'Dữ liệu không đúng định dạng JSON');
    }
    
    const {title, description, categories, userId, wardCode, provinceCode, address, price} = data;

    if(!title){
        return validationErrorResponse(res,'Tiêu đề không được để trống');
    }
    if(!description){
        return validationErrorResponse(res,'Mô tả không được để trống');
    }
    
    // Kiểm tra file ảnh (req.files từ multer)
    if (!req.files || req.files.length === 0) {
        return validationErrorResponse(res, 'Vui lòng tải lên ít nhất 1 hình ảnh');
    }
    
    // Kiểm tra categories
    if (!Array.isArray(categories) || categories.length === 0) {
        return validationErrorResponse(res, 'Danh sách danh mục không hợp lệ hoặc trống');
    }
    
    if(!userId){
        return validationErrorResponse(res,'userId không được để trống');
    }
    if(!wardCode){
        return validationErrorResponse(res,'ID xã, phường không được để trống');
    }
    if(!provinceCode){
        return validationErrorResponse(res,'ID tỉnh, thành phố không được để trống');
    }
    if(!address){
        return validationErrorResponse(res,'Địa chỉ không được để trống');
    }
    if(!price || isNaN(Number(price))){
        return validationErrorResponse(res,'Giá không hợp lệ');
    }
    
    // Gán data đã parse vào req để controller sử dụng
    req.body.parsedData = data;
    
    next();
}

const validationUpdatePost=(req,res,next)=>{
    if(!req.body.data){
        return validationErrorResponse(res,'Dữ liệu không hợp lệ');
    }
    
    let data;
    try {
        data = JSON.parse(req.body.data);
    } catch (error) {
        return validationErrorResponse(res,'Dữ liệu không đúng định dạng JSON');
    }
    
    const {title, description, categories, wardCode, provinceCode, address, price} = data;
    
    if(!title){
        return validationErrorResponse(res,'Tiêu đề không được để trống');
    }
    if(!description){
        return validationErrorResponse(res,'Mô tả không được để trống');
    }
    
    if(!wardCode){
        return validationErrorResponse(res,'ID xã, phường không được để trống');
    }
    if(!provinceCode){
        return validationErrorResponse(res,'ID tỉnh, thành phố không được để trống');
    }
    if(!address){
        return validationErrorResponse(res,'Địa chỉ không được để trống');
    }
    if(!price || isNaN(Number(price))){
        return validationErrorResponse(res,'Giá không hợp lệ');
    }
    
    if (!Array.isArray(categories) || categories.length === 0) {
        return validationErrorResponse(res, 'Danh sách danh mục không hợp lệ hoặc trống');
    }
    
    // Gán data đã parse vào req để controller sử dụng
    req.body.parsedData = data;
    
    next();
}


module.exports={validatonCreatePost,validationUpdatePost}