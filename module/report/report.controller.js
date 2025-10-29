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


export default {createReportController}
