import BaseService from "../../../base_service/base_service.js";


class ReportSummaryRepository extends BaseService{
    constructor(){
        super('report_summary');
    }
    async getReportSummaryRepository(){
        return this.getAll();
    }
    async createReportSummaryRepository({postId,totalReports}){
        return this.create({post_id:postId,total_reports:totalReports});
    }
    async updateReportSummaryRepository(reportId,{totalReports}){
        return this.update(reportId,{total_reports:totalReports});
    }
    async getReportSummaryByPostId(postId){
        return this.findOne({post_id:postId});
    }
    async getAllByPostId(postId){
        return this.getAll({post_id:postId});
    }
    async updateStatusReportSummaryRepo(postId,{status}){
        return this.updateWhere({post_id:postId},{status});
    }
    async getReportSummaryById(id){
        return this.findOne({id});
    }
}

export default new ReportSummaryRepository();