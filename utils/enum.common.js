// enum.common.js
export const PostStatus = Object.freeze({
  PENDING: 'PENDING',     // chờ duyệt
  APPROVED: 'APPROVED',   // đã duyệt
  REJECTED: 'REJECTED',   // từ chối
  VIOLATION: 'VIOLATION', // vi phạm
  HIDDEN: 'HIDDEN'        // ẩn tin
});


export const ReportStatus=Object.freeze({
  PENDING:'PENDING',
  APPROVED:'APPROVED',
  REJECTED:'REJECTED'
})