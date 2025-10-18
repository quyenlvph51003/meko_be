const BaseService = require("../../base_service/base_service");
const {pool}=require('../../config/db');
const stringCommonUtils=require('../../utils/string_common_utils');

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
        const [result]=await pool.query(query);
        return result[0];
    }
    
    async searchPostRepo(keyword,wardCode,provinceCode,userId,page,limit){
        //status is_hidden ward_code province_code userId
        const query=stringCommonUtils.queryPostDetail(`p.title LIKE '%${keyword}%' and p.is_hidden=0 and p.ward_code=${wardCode} and p.province_code=${provinceCode} and p.user_id=${userId}`);
        const [result]=await pool.query(query);
        return result;
    }

}

module.exports=new PostRepository();
