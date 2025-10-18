import PostService from './post.service.js';
import ResponseUtils from '../../utils/response_utils.js';
const createPostController=async(req,res,next)=>{
    try{
        console.log(req.body);
          // Lấy data đã parse từ validation
        const postData = req.body.parsedData;

        // Lấy URL ảnh từ Cloudinary (multer đã upload)
        const imageUrls = req.files.map(file => file.path);
        
          // Thêm imageUrls vào postData
        postData.images = imageUrls;

        const result = await PostService.createPost(postData);
        return ResponseUtils.successResponse(res, null, 'Tạo bài viết thành công');
    }catch(error){
        if(error.message==='User not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy người dùng');
        }
        if(error.message==='Province not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy tỉnh/thành phố');
        }
        if(error.message==='Ward not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy xã/phường');
        }
        if(error.message==='Category not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy danh mục sản phẩm');
        }
        console.log(error);
        return ResponseUtils.serverErrorResponse(res);
    }
}

const updatePostByIdController=async(req,res,next)=>{
    try{
        const postData=req.body.parsedData;
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const imageUrls = req.files.map(file => file.path);
            postData.images = imageUrls;
        }
        const post=await PostService.updatePost(postData);
        
        post.images=post.images?post.images.split(','):[];
        post.categories=post.categories?post.categories.split(','):[];
        
        return ResponseUtils.successResponse(res,post,'Cập nhật bài viết thành công');
    }catch(error){
        if(error.message==='Post not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy bài viết');
        }
        if(error.message==='Province not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy tỉnh/thành phố');
        }
        if(error.message==='Ward not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy xã/phường');
        }
        if(error.message==='Category not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy danh mục sản phẩm');
        }
        console.log(error);
        return ResponseUtils.serverErrorResponse(res);
    }
}

const getDetailByPostIdController=async(req,res,next)=>{
    try{
        const postId=req.params.postId;
        const post=await PostService.getDetailByPostId(postId);
        
        post.images=post.images?post.images.split(','):[];
        post.categories=post.categories?post.categories.split(','):[];
        
        return ResponseUtils.successResponse(res,post,'Lấy thông tin bài viết thành công');
    }catch(error){
        if(error.message==='Post not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy bài viết');
        }
        console.log(error);
        return ResponseUtils.serverErrorResponse(res);
    }
}

export default {createPostController,getDetailByPostIdController,updatePostByIdController}