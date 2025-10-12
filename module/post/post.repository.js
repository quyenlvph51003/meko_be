const BaseService = require("../../base_service/base_service");

class PostRepository extends BaseService {
    constructor() {
        super("post");
    }
    async createPostRepo(post){
        const resultCreate= await this.create(post);
        if(!resultCreate) return;
        return await this.findById(resultCreate.insertId);
    }
    async updatePostRepo(post){
        return await this.updateWhere({id:post.id},post);
    }
}

module.exports=new PostRepository();
