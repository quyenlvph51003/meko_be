import BaseService from "../../base_service/base_service.js";
import database from '../../config/db.js';
import stringCommonUtils from '../../utils/string_common_utils.js';
class PostRepository extends BaseService {
    constructor() {
        super("post");
    }
    async createPostRepo(post){
        const resultCreate= await this.create(post);
        if(!resultCreate) return;
        return await this.findById(resultCreate.insertId);
    }
    async updatePostRepo(post,postId){
        return await this.updateWhere({id:postId},post);
    }

    async getDetailByPostId(postId){
        const query=stringCommonUtils.queryPostDetail(`p.id=${postId}`);
        const [result]=await database.pool.query(query);
        return result[0];
    }
    
    async searchPostRepo(searchText,wardCode,provinceCode,userId,status,categoryId,page,limit){

        const conditions=[];

        if(searchText){
            conditions.push(`p.title LIKE '%${searchText}%'`);
        }

        if(wardCode){
            conditions.push(`p.ward_code = ${wardCode}`);
        }

        if(provinceCode){
            conditions.push(`p.province_code = ${provinceCode}`);
        }

        if(userId){
            conditions.push(`p.user_id = ${userId}`);
        }

        if(status){
            conditions.push(`p.status = '${status}'`);
        }

        if(categoryId){
            conditions.push(`pc.category_id = ${categoryId}`);
        }

        //status is_hidden ward_code province_code userId
        // const query=stringCommonUtils.queryPostDetail(`p.title LIKE '%${keyword}%' and p.ward_code=${wardCode} and p.province_code=${provinceCode} and p.user_id=${userId} and p.status=${status}`);
        const query=stringCommonUtils.queryPostDetail(`${conditions.join(' and ')}`);
        const result=await this.paginateRawQuery(query,page,limit);
       
        // const [result]=await database.pool.query(query);
        return result;
    }

}

export default new PostRepository();
