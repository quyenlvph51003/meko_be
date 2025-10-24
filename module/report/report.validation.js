import ResponseUtils from '../../utils/response_utils';


const validationCreateReport=(req,res,next)=>{
    const {postId,reporterUserId,reason,violationId}=req.body;

    if(!postId){
        return ResponseUtils.validationErrorResponse(res,'ID bài viết không được để trống');
    }
    if(!reporterUserId){
        return ResponseUtils.validationErrorResponse(res,'ID người báo cáo không được để trống');
    }
    if(!reason){
        return ResponseUtils.validationErrorResponse(res,'Lí do báo cáo không được để trống');
    }
    if(!violationId){
        return ResponseUtils.validationErrorResponse(res,'ID vi phạm không được để trống');
    }
    next();
}

export default {validationCreateReport}
