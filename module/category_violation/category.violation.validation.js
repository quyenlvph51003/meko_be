import ResponseUtils from '../../utils/response_utils.js';

const ValidationCreateCategoryViolation=(req,res,next)=>{
 if(!req.body.name){
    return ResponseUtils.validationErrorResponse(res,'Tên danh mục vi phạm không được để trống');
 }   
 next();
}

const ValidationUpdateCategoryViolation=(req,res,next)=>{
    if(!req.body.name){
        return ResponseUtils.validationErrorResponse(res,'Tên danh mục vi phạm không được để trống');
    }   
    next();
}

export default {
    ValidationCreateCategoryViolation,
    ValidationUpdateCategoryViolation
};
