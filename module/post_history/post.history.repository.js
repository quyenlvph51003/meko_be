import BaseService from "../../base_service/base_service.js";

class PostHistoryRepo extends BaseService{
    constructor(){
        super("post_history");
    }
    async createPostHistoryRepo(postHistory){
        return await this.create(postHistory);
    }
    async getPostHistoryRepo(postId,userId){
        return await this.findOne({post_id:postId,user_id:userId});
    }
    async searchHistoryRepo(userId,page,size,searchText){
        const whereClause=[];
        if(searchText){
            whereClause.push(`p.title LIKE '%${searchText}%'`);
        }
        if(userId){
            whereClause.push(`ph.user_id=${userId}`);
        }
        const whereClauseStr=whereClause.join(' and ');
        const query= `select
                    p.id as id,
                    p.user_id as userId,
                    u.username as userNamePoster,
                    u.avatar as avatarPoster,  
                    p.title,
                    p.description,
                    p.price,
                    p.address,
                    p.status,
                    p.phone_number as phoneNumber,
                    p.expired_at as expiredAt,
                    p.is_pinned as isPinned,
                    p.created_at as createdAt,
                    p.updated_at as updatedAt,
                    p.ward_code as wardCode,
                    p.province_code as provinceCode,
                    GROUP_CONCAT(DISTINCT ip.image_url) AS images,
                    GROUP_CONCAT(DISTINCT c.name) AS categories
                from post_history ph
                left join 
                    post p on ph.post_id = p.id
                left join 
                    image_post ip on p.id = ip.post_id
                left join 
                    post_categories pc on p.id = pc.post_id
                left join 
                    categories c on pc.category_id=c.id
                left join 
                    users u on p.user_id=u.id                    
                where ${whereClauseStr} 
                GROUP BY 
                    p.id, p.user_id, p.title, p.description, p.price, p.address, 
                    p.status, p.expired_at, p.is_pinned, p.created_at, p.updated_at`;
        const rows = await this.paginateRawQuery(query,Number(page),Number(size));
        return rows;
    }
}

export default new PostHistoryRepo();