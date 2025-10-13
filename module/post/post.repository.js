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
        const query=stringCommonUtils.queryPostDetail(postId);
        const [result]=await pool.query(query);
        return result[0];
    }

}

module.exports=new PostRepository();
