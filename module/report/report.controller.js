import ReportService from "./report.service.js";
import ResponeUtils from "../../utils/response_utils.js";


const createReportController=async(req,res)=>{
    try{
        const {postId,reporterUserId,reason,violationId}=req.body;
        const report=await ReportService.createReport({postId,reporterUserId,reason,violationId});
        if(report===true){
            return ResponeUtils.successResponse(res,null,'Tạo báo cáo vi phạm thành công');
        }
    }catch(error){
        if(error.message.includes('Post Not Found')){
            return ResponeUtils.validationErrorResponse(res,'Bài viết không tồn tại');
        }
        if(error.message.includes('User Not Found')){
            return ResponeUtils.validationErrorResponse(res,'Người báo cáo không tồn tại');
        }
        if(error.message.includes('Violation Not Found')){
            return ResponeUtils.validationErrorResponse(res,'Danh mục vi phạm không tồn tại');
        }
        if(error.message.includes('You have reported this post')){
            return ResponeUtils.validationErrorResponse(res,'Bạn đã báo cáo bài viết này');
        }
        console.log(error.message);
        return ResponeUtils.errorResponse(res,error.message);

    }
}

const updateReportController=async(req,res)=>{
    try{
        const postId=req.query.postId;
        
        const {status,reason,violationId}=req.body;
        const report=await ReportService.updateStatusReport(postId,status,violationId,reason);
        if(report===true){
            return ResponeUtils.successResponse(res,null,'Cập nhật báo cáo vi phạm thành công');
        }
    }catch(error){
        if(error.message.includes('Report Not Found')){
            return ResponeUtils.validationErrorResponse(res,'Báo cáo không tồn tại');
        }
        if(error.message.includes('Post Not Found')){
            return ResponeUtils.validationErrorResponse(res,'Bài viết không tồn tại');
        }
        if(error.message.includes('User Not Found')){
            return ResponeUtils.validationErrorResponse(res,'Người báo cáo không tồn tại');
        }
        if(error.message.includes('Violation Not Found')){
            return ResponeUtils.validationErrorResponse(res,'Danh mục vi phạm không tồn tại');
        }
        if(error.message.includes('Invalid transition')){
            return ResponeUtils.validationErrorResponse(res,'Trạng thái không hợp lệ');
        }
        if(error.message.includes('Post is not approved')){
            return ResponeUtils.validationErrorResponse(res,'Bài viết không ở trạng thái duyệt');
        }
        if(error.message.includes('Violation ID is required')){
            return ResponeUtils.validationErrorResponse(res,'ID danh mục vi phạm không hợp lệ');
        }
        if(error.message.includes('Reason is required')){
            return ResponeUtils.validationErrorResponse(res,'Lý do vi phạm không hợp lệ');
        }
        console.log(error.message);
        return ResponeUtils.errorResponse(res,error.message);
    }
}

export default {createReportController,updateReportController}
