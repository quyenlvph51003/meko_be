
import BaseSevice from "../../base_service/base_service.js";
import database from "../../config/db.js";
class FavoriteRepository extends BaseSevice {
    constructor() {
        super('favorite');
    }
    async createFavorite(data){
        return await this.create({post_id:data.postId,user_id:data.userId});
    }
    async deleteFavorite(id){
        return await this.delete(id);
    }
    async getFavoriteById(id){
        return await this.findById(id);
    }
    async getFavoriteExists(postId,userId){
        return await this.findOne({post_id:postId,user_id:userId});
    }
    async searchFavorite(userId,searchText,page,size){
        const whereClause=[`f.user_id=${userId}`];
        if(searchText){
            whereClause.push(`p.title LIKE '%${searchText}%'`);
        }
        const whereClauseStr=whereClause.join(' and ');
        const query=`
                SELECT
                    f.id AS favoriteId,
                    p.id AS postId,
                    p.user_id AS userPostId,
                    f.user_id AS userFavoriteId,
                    p.title,
                    p.description,
                    p.price,
                    p.address,
                    p.status,
                    p.expired_at AS expiredAt,
                    p.is_pinned AS isPinned,
                    p.created_at AS createdAt,
                    p.updated_at AS updatedAt,
                    p.ward_code AS wardCode,
                    p.province_code AS provinceCode,
                    
                    (
                        SELECT JSON_ARRAYAGG(img.image_url)
                        FROM (
                            SELECT DISTINCT ip.image_url
                            FROM image_post ip
                            WHERE ip.post_id = p.id
                        ) AS img
                    ) AS images,
                    (
                        SELECT JSON_ARRAYAGG(cat.name)
                        FROM (
                            SELECT DISTINCT c.name
                            FROM post_categories pc
                            JOIN categories c ON c.id = pc.category_id
                            WHERE pc.post_id = p.id
                        ) AS cat
                    ) AS categories
                FROM favorite f
                LEFT JOIN post p ON p.id = f.post_id
                WHERE ${whereClauseStr}
                GROUP BY 
                    p.id, p.user_id, p.title, p.description, p.price, p.address, 
                    p.status, p.expired_at, p.is_pinned, p.created_at, p.updated_at, f.id

        `
        const rows = await this.paginateRawQuery(query,Number(page),Number(size));
        return rows;
    }
}

export default new FavoriteRepository();
