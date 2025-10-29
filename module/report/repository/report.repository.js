import BaseService from '../../../base_service/base_service.js';
import database from '../../../config/db.js';
class ReportRepository extends BaseService{
    constructor(){
        super('report');
    };

    async createReportRepository({reportSummaryId,reporterUserId,reason,violationId}){
        return this.create({report_summary_id:reportSummaryId,reporter_user_id:reporterUserId,reason,violationId:violationId});
    }
    async getDetailRepostRepoById(reportId){
        return this.findById(reportId);
    }
    async getAllReportRepo(){
        return this.getAll();
    }
    async updateReportRepo(reportId,status){
        return this.update(reportId,{status});
    }
    async queryCheckExistReport(postId,reporterUserId){
        const query=`select r.id from report r 
                join report_summary rs on r.report_summary_id = rs.id where rs.post_id=${postId} and r.reporter_user_id=${reporterUserId} limit 1`;
        const [rows] = await database.pool.query(query);
        return rows;
    }
}

export default ReportRepository;
