const BaseService=require('../../base_service/base_service');
class ImagePostRepository extends BaseService{
    constructor(){
        super('image_post');
    }
    async createImagePostRepo(imagePost){
        return await this.create(imagePost);
    }
    async createManyImagePost(imagePost){
        return await this.createMany(imagePost);
    }
    async updateImagePostRepo(imagePost){
        return await this.updateWhere({id:imagePost.id},imagePost);
    }
    async getImagePostRepo(id){
        return await this.findById(id);
    }
    async getListImageByPostId(postId){
        return await this.getAll({post_id:postId});
    }
    async deleteImagePost(postId){
        return await this.deleteWhere({post_id:postId});
    }
}

module.exports=new ImagePostRepository();
