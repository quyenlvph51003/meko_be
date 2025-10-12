const PostRepository=require('./post.repository');
const UserRepository=require('../users/user.repository');
const ProvinceRepository=require('../address/provinces/province.repository');
const WardRepository=require('../address/wards/ward.repository');
const ImagePostRepository=require('../image_post/image.repository');
const PostCategoriesRepository=require('../post_categories/post.categories.repository');
const Category=require('../category/category.repository');


class PostService{
    async createPost(post){
        const userId=post.userId;
        const provinceCode=post.provinceCode;
        const wardCode=post.wardCode;
        const images=post.images;
        const categories=post.categories;

        const user=await UserRepository.findByIdUserRepo(userId);
        if(!user){
            throw new Error('User not found');
        }
       
        const province=await ProvinceRepository.getProvinceByCode(provinceCode);
        if(!province){
            throw new Error('Province not found');
        }
        
        const ward=await WardRepository.getWardByCode(wardCode);
        if(!ward){
            throw new Error('Ward not found');
        }
        
        const expired_at = new Date();
        expired_at.setDate(expired_at.getDate() + 30);
        const expiredAtFormatted = expired_at.toISOString().slice(0, 19).replace('T', ' ');

        // dữ liệu lưu vào db
        const postSave={
            title:post.title,
            description:post.description,
            user_id:userId,
            ward_code:wardCode,
            province_code:provinceCode,
            address:post.address,
            price:post.price,
            expired_at: expiredAtFormatted
        }
        const postResult=await PostRepository.createPostRepo(postSave);
        if(!postResult) return;

        if (images && images.length > 0) {
            const imageValues = images.map((imageUrl) => ({
                post_id: postResult.id,
                image_url: imageUrl
            }));
            await ImagePostRepository.createManyImagePost(imageValues);
        }
        
        if(categories && categories.length > 0){
            for(const id of categories){
                const categoryExist=await Category.getCategoryRepoById(id);
                if(!categoryExist){
                    throw new Error('Category not found');
                }
            }

            const postCategoriesValues = categories.map((categoryId) => ({
                post_id: postResult.id,
                category_id: categoryId
            }));
            await PostCategoriesRepository.createManyPostCategoriesRepo(postCategoriesValues);
        }

        return post;
    }
    async updatePost(post){
        return await PostRepository.updatePostRepo(post);
    }
}
module.exports=new PostService();