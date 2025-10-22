const PostStatus=Object.freeze({
    PENDING:'PENDING', // chờ duyệt
    APPROVED:'APPROVED', // đã duyệt
    REJECTED:'REJECTED', // từ chối
    VIOLATION:'VIOLATION', // vi phạm
    DELETED:'HIDDEN' // ẩn tin
})

export default {PostStatus}