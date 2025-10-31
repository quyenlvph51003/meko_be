import ResponseUtils from '../../utils/response_utils.js';
import { ReportStatus } from '../../utils/enum.common.js';

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
const validationUpdateStatusReport=(req,res,next)=>{
    const postId=req.query.postId;
    const {status}=req.body;
    if(!postId){
        return ResponseUtils.validationErrorResponse(res,'ID bài viết không được để trống');
    }
    if(!status){
        return ResponseUtils.validationErrorResponse(res,'Trạng thái không được để trống');
    }
    if(status != ReportStatus.APPROVED && status != ReportStatus.REJECTED){
        return ResponseUtils.validationErrorResponse(res,'Trạng thái không hợp lệ');
    }
    next();
}
const validationSearchReport=(req,res,next)=>{
    const status=req.body.status;
    if(status != ReportStatus.APPROVED && status != ReportStatus.REJECTED && status != ReportStatus.PENDING){
        return ResponseUtils.validationErrorResponse(res,'Trạng thái không hợp lệ');
    }
    next();
}

export default {validationCreateReport,validationUpdateStatusReport,validationSearchReport}
