import PostService from './post.service.js';
import ResponseUtils from '../../utils/response_utils.js';
import { PostStatus } from '../../utils/enum.common.js';
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

const updatePostByIdController = async (req, res, next) => {
    try {
        const postData = req.body.parsedData;
        console.log(postData);
        
        const hasOldImagesField = Object.prototype.hasOwnProperty.call(postData, 'oldImages');
        const oldImages = hasOldImagesField && Array.isArray(postData.oldImages) ? postData.oldImages : [];
        const newImages = (req.files && Array.isArray(req.files) && req.files.length > 0)
            ? req.files.map(file => file.path)
            : [];

        if (hasOldImagesField || newImages.length > 0) {
            // Dùng cơ chế mới: chỉ set keepOldImages khi client thực sự gửi oldImages
            if (hasOldImagesField) {
                postData.keepOldImages = oldImages;
            } else {
                delete postData.keepOldImages;
            }
            postData.newImages = newImages;
            // Tránh dùng đường cũ khi đã có cơ chế mới
            delete postData.images;
        } else {
            // Không gửi gì về ảnh: để service giữ nguyên DB
            // Vẫn giữ tương thích với dạng cũ nếu client đã gửi images (mảng đầy đủ)
            if (!Array.isArray(postData.images)) {
                delete postData.images;
            }
            delete postData.keepOldImages;
            delete postData.newImages;
        }
        delete postData.oldImages;

        const post = await PostService.updatePost(postData);

        post.images = post.images ? post.images.split(',') : [];
        post.categories = post.categories ? post.categories.split(',') : [];

        return ResponseUtils.successResponse(res, post, 'Cập nhật bài viết thành công');
    } catch (error) {
        if (error.message === 'Post not found') {
            return ResponseUtils.notFoundResponse(res, 'Không tìm thấy bài viết');
        }
        if (error.message === 'Province not found') {
            return ResponseUtils.notFoundResponse(res, 'Không tìm thấy tỉnh/thành phố');
        }
        if (error.message === 'Ward not found') {
            return ResponseUtils.notFoundResponse(res, 'Không tìm thấy xã/phường');
        }
        if (error.message === 'Category not found') {
            return ResponseUtils.notFoundResponse(res, 'Không tìm thấy danh mục sản phẩm');
        }
        if (error.message === 'Old image not belong to post') {
            return ResponseUtils.validationErrorResponse(res, 'Ảnh cũ không thuộc bài viết hiện tại');
        }
        console.log(error);
        return ResponseUtils.serverErrorResponse(res);
    }
}

const getDetailByPostIdController=async(req,res,next)=>{
    try{
        const postId=req.params.postId;
        const userId=req.query.userId;
        const post=await PostService.getDetailByPostId(postId,userId);
        
        post.images=post.images?post.images.split(','):[];
        post.categories=post.categories?post.categories.split(','):[];
        
        return ResponseUtils.successResponse(res,post,'Lấy thông tin bài viết thành công');
    }catch(error){
        if(error.message==='Post not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy bài viết');
        }
        if(error.message==='User not found'){
            return ResponseUtils.notFoundResponse(res,'Người dùng không tồn tại');
        }
        console.log(error);
        return ResponseUtils.serverErrorResponse(res);
    }
}

const searchPostController=async(req,res,next)=>{
    try{
        const page = Number(req.query.page) || 0;     // mặc định 0
        const limit = Number(req.query.size) || 10;  // mặc định 10
        const post=await PostService.searchPost(req.body,page,limit);

        post.content=post.content.map((item)=>{
            item.images=item.images?item.images.split(','):[];
            item.categories=item.categories?item.categories.split(','):[];
            return item;
        });

        return ResponseUtils.successResponse(res,post,'Lấy danh sách bài viết thành công');


    }catch(error){
        if(error.message==='Province not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy tỉnh/thành phố');
        }
        if(error.message==='Ward not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy xã/phường');
        }
        if(error.message==='Status not found'){
            return ResponseUtils.notFoundResponse(res,'Trạng thái không hợp lệ');
        }
        if(error.message==='User not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy người dùng');
        }
        if(error.message==='Category not found'){
            return ResponseUtils.notFoundResponse(res,'Không tìm thấy danh mục sản phẩm');
        }
        if(error.message==='Category ID is not an array'){
            return ResponseUtils.notFoundResponse(res,'Cần truyền mảng danh mục sản phẩm');
        }
        
        console.log(error);
        return ResponseUtils.serverErrorResponse(res);
    }
}

const updateStatusPostController=async(req,res,next)=>{
    try{
        const role=req.user.role;
        const postId=req.params.postId;
        const {status,reasonReject,reasonViolation, violationId}=req.body;

        if((status===PostStatus.VIOLATION || status===PostStatus.REJECTED) && role!=1){
            return ResponseUtils.validationErrorResponse(res,'Chỉ admin mới có quyền thay đổi trạng thái này');
        }
        const post=await PostService.updateStatusPostService(postId,status,reasonReject,reasonViolation,violationId);
        return ResponseUtils.successResponse(res,null,'Cập nhật trạng thái bài viết thành công');
    }catch(error){
        const message = error.message;

    // 🔍 Bắt lỗi xác định
    const errorMap = {
      'Post not found': ['notFoundResponse', 'Không tìm thấy bài viết'],
      'Status not found': ['validationErrorResponse', 'Trạng thái không hợp lệ'],
      'Violation not found': ['validationErrorResponse', 'Không tìm thấy nội dung vi phạm'],
    };

    // 🎯 Nếu là lỗi chuyển trạng thái (Invalid transition)
    if (message.startsWith('Invalid transition')) {
      const [, from, to] = message.match(/from (\w+) to (\w+)/) || [];

      // Map chi tiết từng cặp chuyển trạng thái
      const transitionMessages = {
        [`${PostStatus.APPROVED}->${PostStatus.PENDING}`]: 'Bài viết đã duyệt không thể chuyển về chờ duyệt.',
        [`${PostStatus.APPROVED}->${PostStatus.REJECTED}`]: 'Không thể từ chối bài viết đã được duyệt.',
        [`${PostStatus.REJECTED}->${PostStatus.APPROVED}`]: 'Bài bị từ chối cần gửi lại (PENDING) trước khi được duyệt.',
        [`${PostStatus.VIOLATION}->${PostStatus.PENDING}`]: 'Bài viết vi phạm không thể gửi lại.',
        [`${PostStatus.VIOLATION}->${PostStatus.APPROVED}`]: 'Bài viết vi phạm không thể được duyệt lại.',
        [`${PostStatus.HIDDEN}->${PostStatus.PENDING}`]: 'Bài viết bị ẩn không thể chuyển sang chờ duyệt.',
        [`${PostStatus.PENDING}->${PostStatus.HIDDEN}`]: 'Không thể ẩn bài khi đang chờ duyệt.',
        [`${PostStatus.PENDING}->${PostStatus.PENDING}`]: 'Bài viết đã ở trạng thái chờ duyệt.',
        [`${PostStatus.PENDING}->${PostStatus.VIOLATION}`]: 'Bài viết chưa duyệt không thể vi phạm.',
      };

      const key = `${from}->${to}`;
      const friendlyMessage = transitionMessages[key] || `Không thể chuyển trạng thái từ ${from} sang ${to}.`;
      return ResponseUtils.validationErrorResponse(res, friendlyMessage);
    }

    // 🧠 Các lỗi thông thường khác
    const match = errorMap[message];
    if (match) {
      const [method, msg] = match;
      return ResponseUtils[method](res, msg);
    }

    // ⚠️ Lỗi không xác định
    return ResponseUtils.serverErrorResponse(res, 'Lỗi hệ thống, vui lòng thử lại sau.');
    }
   
}
 const updateIsPinnedPostController=async(req,res,next)=>{
        try{
            const role=req.user.role;
            console.log(role);
            
            if(role!=1){
                return ResponseUtils.validationErrorResponse(res,'Chỉ admin mới có quyền thay đổi trạng thái này');
            }
            const postId=req.params.postId;
            await PostService.updateIsPinnedPostService(postId); 
            const result=await PostService.getDetailByPostId(postId,null);
            return ResponseUtils.successResponse(res,result,'Cập nhật ghim bài viết thành công');
        }catch(error){
            if(error.message==='Post not found'){
                return ResponseUtils.notFoundResponse(res,'Không tìm thấy bài viết');
            }
            console.log(error);
            return ResponseUtils.serverErrorResponse(res);
        }
    }

export default {createPostController,getDetailByPostIdController,updatePostByIdController,searchPostController,updateStatusPostController,updateIsPinnedPostController}