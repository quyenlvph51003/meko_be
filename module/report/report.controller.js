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
            return ResponeUtils.notFoundResponse(res,'Bài viết không tồn tại');
        }
        if(error.message.includes('User Not Found')){
            return ResponeUtils.notFoundResponse(res,'Người báo cáo không tồn tại');
        }
        if(error.message.includes('Violation Not Found')){
            return ResponeUtils.notFoundResponse(res,'Danh mục vi phạm không tồn tại');
        }
        if(error.message.includes('You have reported this post')){
            return ResponeUtils.notFoundResponse(res,'Bạn đã báo cáo bài viết này');
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
            return ResponeUtils.notFoundResponse(res,'Báo cáo không tồn tại');
        }
        if(error.message.includes('Post Not Found')){
            return ResponeUtils.notFoundResponse(res,'Bài viết không tồn tại');
        }
        if(error.message.includes('User Not Found')){
            return ResponeUtils.notFoundResponse(res,'Người báo cáo không tồn tại');
        }
        if(error.message.includes('Violation Not Found')){
            return ResponeUtils.notFoundResponse(res,'Danh mục vi phạm không tồn tại');
        }
        if(error.message.includes('Invalid transition')){
            return ResponeUtils.notFoundResponse(res,'Trạng thái không hợp lệ');
        }
        if(error.message.includes('Post is not approved')){
            return ResponeUtils.notFoundResponse(res,'Bài viết không ở trạng thái duyệt');
        }
        if(error.message.includes('Violation ID is required')){
            return ResponeUtils.notFoundResponse(res,'ID danh mục vi phạm không hợp lệ');
        }
        if(error.message.includes('Reason is required')){
            return ResponeUtils.notFoundResponse(res,'Lý do vi phạm không hợp lệ');
        }
        console.log(error.message);
        return ResponeUtils.errorResponse(res,error.message);
    }
}


const searchReportController=async(req,res)=>{
    try{
        const {page,size}=req.query;
        const {searchText,status}=req.body;
        const report=await ReportService.searchReport(searchText,status,page,size);
        return ResponeUtils.successResponse(res,report,'Lấy danh sách báo cáo vi phạm thành công');
    }catch(error){
        console.log(error.message);
        return ResponeUtils.errorResponse(res,error.message);
    }
}

export default {createReportController,updateReportController,searchReportController}
