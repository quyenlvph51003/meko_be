const PostService=require('./post.service');
const {successResponse,serverErrorResponse,validationErrorResponse,notFoundResponse}=require('../../utils/response_utils');
const { image } = require('../../config/cloundinary');
const createPostController=async(req,res,next)=>{
    try{
          // Lấy data đã parse từ validation
        const postData = req.body.parsedData;

        // Lấy URL ảnh từ Cloudinary (multer đã upload)
        const imageUrls = req.files.map(file => file.path);
        
          // Thêm imageUrls vào postData
        postData.images = imageUrls;

        const result = await PostService.createPost(postData);
        return successResponse(res, null, 'Tạo bài viết thành công');
    }catch(error){
        if(error.message==='User not found'){
            return notFoundResponse(res,'Không tìm thấy người dùng');
        }
        if(error.message==='Province not found'){
            return notFoundResponse(res,'Không tìm thấy tỉnh/thành phố');
        }
        if(error.message==='Ward not found'){
            return notFoundResponse(res,'Không tìm thấy xã/phường');
        }
        if(error.message==='Category not found'){
            return notFoundResponse(res,'Không tìm thấy danh mục sản phẩm');
        }
        console.log(error);
        return serverErrorResponse(res);
    }
}

module.exports={createPostController}