
import ReportRepository from "./repository/report.repository.js";
import UserRepo from "../users/user.repository.js";
import PostRepo from "../post/post.repository.js";
import ViolationRepo from "../category_violation/category.violation.repository.js";
import reportSummaryRepository from "./repository/report.summary.repository.js";
import { ReportStatus } from "../../utils/enum.common.js";
import { PostStatus } from "../../utils/enum.common.js";

class ReportService{
    constructor(){
        this.reportRepository=new ReportRepository();
    }

    async createReport({postId,reporterUserId,reason,violationId}){
        const post=await PostRepo.getDetailByPostId(postId);
        const reporterUser=await UserRepo.findByIdUserRepo(reporterUserId);
        const violation=await ViolationRepo.getDetailViolationRepo(violationId);
        if(!post){
            throw new Error('Post Not Found');
        }
        if(!reporterUser){
            throw new Error('User Not Found');
        }
        if(!violation){
            throw new Error('Violation Not Found');
        }
        let reportSummary=await reportSummaryRepository.getReportSummaryByPostId(postId);
        
        //chưa có thì tạo mới có rồi thì update lên
        if(!reportSummary){
            const createReportSummary=await reportSummaryRepository.createReportSummaryRepository({postId,totalReports:0});
            reportSummary=createReportSummary;
        }

        //validate mỗi user chỉ được update một lần bài viết đó
        const checkExistReport=await this.reportRepository.queryCheckExistReport(postId,reporterUserId);
        if(checkExistReport.length>0){
            throw new Error('You have reported this post');
        }

        const report=await this.reportRepository.createReportRepository({reportSummaryId:reportSummary.id??reportSummary.insertId,reporterUserId,reason,violationId});
        return true;
    }

    async updateStatusReport(postId,status,violationId,reason){
        const reportExists=await reportSummaryRepository.getReportSummaryByPostId(postId);
        if(!reportExists){
            throw new Error('Report Not Found');
        }

        // validate trạng thái
        const VALID_TRANSITIONS={
            [ReportStatus.PENDING]: [ReportStatus.APPROVED, ReportStatus.REJECTED],
            [ReportStatus.APPROVED]: [],
            [ReportStatus.REJECTED]: [],
        };

        const currentStatus=reportExists.status;
        const allowedNext = VALID_TRANSITIONS[currentStatus] || [];
        if (!allowedNext.includes(status)) {
           throw new Error(`Invalid transition from ${currentStatus} to ${status}`);
        }

        // nếu là approved thì update status post
        if(currentStatus===ReportStatus.PENDING && status===ReportStatus.APPROVED){
            if(!violationId){
                throw new Error('Violation ID is required');
            }
            
            if(!reason){
                throw new Error('Reason is required');
            }

            const violation=await ViolationRepo.getDetailViolationRepo(violationId);
            if(!violation){
                throw new Error('Violation Not Found');
            }

            const post=await PostRepo.getDetailByPostId(postId);
            if(!post){
                throw new Error('Post Not Found');
            }
            if(post.status!=PostStatus.APPROVED){
                throw new Error('Post is not approved');
            }
            await PostRepo.updateStatusPostRepo(postId,{status:PostStatus.VIOLATION,violation_id:violationId,reason_violation:reason});
        }

        await reportSummaryRepository.updateStatusReportSummaryRepo(postId,{status});
        return true;
    }
}

export default new ReportService();
