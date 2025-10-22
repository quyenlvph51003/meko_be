import PostRepository from './post.repository.js';
import UserRepository from '../users/user.repository.js';
import ProvinceRepository from '../address/provinces/province.repository.js';
import WardRepository from '../address/wards/ward.repository.js';
import ImagePostRepository from '../image_post/image.repository.js';
import PostCategoriesRepository from '../post_categories/post.categories.repository.js';
import Category from '../category/category.repository.js';
import PostStatus from '../../utils/enum.common.js';

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
            expired_at: expiredAtFormatted,
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

    async getDetailByPostId(postId){
        const post=await PostRepository.findById(postId);
        if(!post){
            throw new Error('Post not found');
        }
        return await PostRepository.getDetailByPostId(postId);
    }


    async updatePost(post){
        const postId=post.postId;
        const title=post.title;
        const description=post.description;
        const address=post.address;
        const price=post.price;
        const images=post.images;
        const categories=post.categories;
        const wardCode=post.wardCode;
        const provinceCode=post.provinceCode;
        
        const postExists=await PostRepository.findById(postId);
        if(!postExists){
            throw new Error('Post not found');
        }
        const provinceExist=await ProvinceRepository.getProvinceByCode(provinceCode);
        if(!provinceExist){
            throw new Error('Province not found');
        }
        
        const wardExist=await WardRepository.getWardByCode(wardCode);
        if(!wardExist){
            throw new Error('Ward not found');
        }
        const postUpdate={
            title:title,
            description:description,
            address:address,
            price:price,
            ward_code:wardCode,
            province_code:provinceCode
        }

        // nếu truyền lên request thì xoá và lưu bản ghi mới
        if(images != undefined){
            const imageValues = images.map((imageUrl) => ({
                post_id: postId,
                image_url: imageUrl
            }));
            await ImagePostRepository.deleteImagePost(postId);
            await ImagePostRepository.createManyImagePost(imageValues);
        }

        if(categories){
            for(const id of categories){
                const categoryExist=await Category.getCategoryRepoById(id);
                if(!categoryExist){
                    throw new Error('Category not found');
                }
            }

            const postCategoriesValues = categories.map((categoryId) => ({
                post_id: postId,
                category_id: categoryId
            }));
            console.log(postCategoriesValues);
            await PostCategoriesRepository.deletePostCategories(postId);
            await PostCategoriesRepository.createManyPostCategoriesRepo(postCategoriesValues);
        }

        await PostRepository.updatePostRepo(postUpdate,postId);

        return await this.getDetailByPostId(postId); // trả ra detail

    };


    async searchPost(post,page,limit){
        const searchText=post.searchText;
        const wardCode=post.wardCode;
        const provinceCode=post.provinceCode;
        const userId=post.userId;
        const status=post.status;
        const categoryIds=post.categoryIds;   
        
        if(userId){
            const user=await UserRepository.findByIdUserRepo(userId);
            if(!user){
                throw new Error('User not found');
            }
        }
        if(status){
            console.log(PostStatus);
            console.log(status);
            
            if(!(Object.values(PostStatus.PostStatus).includes(status))){
            throw new Error('Status not found');
        }
        }

        if(provinceCode){
            const province=await ProvinceRepository.getProvinceByCode(provinceCode);
            if(!province){
                throw new Error('Province not found');
            }
        }

        if(wardCode){
            const ward=await WardRepository.getWardByCode(wardCode);
            if(!ward){
                throw new Error('Ward not found');
            }
        }
        if (categoryIds && categoryIds.length !== 0) {
            if (Array.isArray(categoryIds)) { //categoryIds
                for(const e of categoryIds){
                    const categoryExist=await Category.getCategoryRepoById(e);
                    if(!categoryExist){
                        throw new Error('Category not found');
                    }
                }
            } else {
                throw new Error('Category ID is not an array');
            }
        }
        return await PostRepository.searchPostRepo(searchText,wardCode,provinceCode,userId,status,categoryIds,page,limit);
    }


    async updateStatusPostService(postId,status){
        const postExists=await PostRepository.findById(postId);
        if(!postExists){
            throw new Error('Post not found');
        }

        if(!PostStatus.includes(status)){
            throw new Error('Status not found');
        }
        // cần check luồng của status và trạng thái hiện tại 
        

        return await PostRepository.updateStatusPostRepo(postId,status);
    }

}
export default new PostService();