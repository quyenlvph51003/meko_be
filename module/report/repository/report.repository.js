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
    async searchReportRepo(searchText,status,page,size){
        const whereClause=[];
        if(searchText){
            whereClause.push(`p.title LIKE '%${searchText}%'`);
        }
        if(status){
            whereClause.push(`rs.status = '${status}'`);
        }
        const whereClauseStr=whereClause.join(' and ');
        const query=`SELECT
            rs.id AS report_summary_id,
            rs.total_reports,
            p.id AS post_id,
            p.title,
            u.username,
            p.user_id,
            rs.status,
            -- reports: mảng JSON object (user + name + reason + created_at)
            (
                SELECT JSON_ARRAYAGG(JSON_OBJECT(
                        'user_id_reporter', r2.reporter_user_id,
                        'username', u2.username,
                        'reason', r2.reason,
                        'created_at', r2.created_at
                    ))
                FROM report r2
                LEFT JOIN users u2 ON u2.id = r2.reporter_user_id
                WHERE r2.report_summary_id = rs.id
            ) AS reports,
            -- categories: lấy DISTINCT trước rồi gom thành mảng JSON
            (
                SELECT JSON_ARRAYAGG(t.cat_name)
                FROM (
                SELECT DISTINCT c2.name AS cat_name
                FROM post_categories pc2
                JOIN categories c2 ON c2.id = pc2.category_id
                WHERE pc2.post_id = p.id
                ORDER BY c2.name
                ) AS t
            ) AS categories,
            -- images: lấy DISTINCT image_url rồi gom
            (
                SELECT JSON_ARRAYAGG(timg.image_url)
                FROM (
                SELECT DISTINCT image_url
                FROM image_post
                WHERE post_id = p.id
                ORDER BY image_url
                ) AS timg
            ) AS images
            FROM report_summary rs
            LEFT JOIN post p ON p.id = rs.post_id
            LEFT JOIN users u ON u.id = p.user_id
            -- không join report/image/category trực tiếp để tránh nhân bản
            WHERE ${whereClauseStr}
            GROUP BY rs.id, rs.total_reports, rs.status, p.id, p.title
            ORDER BY rs.id DESC`;
        const rows = await this.paginateRawQuery(query,Number(page),Number(size));
        return rows;
    }
}

export default ReportRepository;
